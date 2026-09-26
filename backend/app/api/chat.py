import json
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
from app.models.schemas import ChatRequest, ChatResponse
from app.services.qdrant_service import qdrant_service
from app.services.groq_service import groq_service
from app.services.session_service import session_manager

router = APIRouter(tags=["Chat & RAG"])

@router.post(
    "/api/chat",
    summary="Chat with CGTMSE Assist RAG",
    description="Processes user queries with Qdrant vector retrieval and Groq LLM generation. Supports JSON and text/event-stream."
)
async def chat_endpoint(request: Request, body: ChatRequest):
    return await process_chat(request, body)

@router.post(
    "/webhook/websiteflow",
    summary="Drop-in n8n Webhook Compatibility Endpoint",
    description="Direct drop-in endpoint matching the frontend VITE_N8N_WEBHOOK_URL contract. Supports JSON and text/event-stream."
)
async def webhook_endpoint(request: Request, body: ChatRequest):
    return await process_chat(request, body)

async def process_chat(request: Request, body: ChatRequest):
    user_query = body.message.strip()
    session_id = body.sessionId

    if not user_query:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    if len(user_query) > 4000:
        raise HTTPException(
            status_code=400,
            detail=f"Your query is too lengthy ({len(user_query)} characters). Please shorten your question to under 4,000 characters so CGTMSE Assist can provide an accurate response."
        )

    # 1. Retrieve session history for multi-turn context
    history = session_manager.get_history(session_id) if session_id else []

    # 2. Query Qdrant for relevant knowledge context
    try:
        retrieved_chunks = qdrant_service.search_relevant_chunks(user_query, limit=5)
    except Exception as e:
        print(f"[Search Warning] Qdrant search encountered an error: {e}")
        retrieved_chunks = []

    # Check if client requested streaming via body flag or Accept header
    accept_header = request.headers.get("accept", "").lower()
    is_streaming = bool(body.stream) or ("text/event-stream" in accept_header)

    if is_streaming:
        def event_stream():
            if session_id:
                session_manager.add_message(session_id, "user", user_query)

            assistant_full = []
            for event_str in groq_service.stream_rag_response(
                query=user_query,
                retrieved_chunks=retrieved_chunks,
                conversation_history=history,
                session_id=session_id
            ):
                yield event_str

                # Capture full answer for session memory
                if event_str.startswith("event: token\ndata: "):
                    try:
                        data = json.loads(event_str[len("event: token\ndata: "):].strip())
                        assistant_full.append(data.get("delta", ""))
                    except Exception:
                        pass
                elif event_str.startswith("event: done\ndata: "):
                    try:
                        data = json.loads(event_str[len("event: done\ndata: "):].strip())
                        if "full_answer" in data and data["full_answer"]:
                            assistant_full = [data["full_answer"]]
                    except Exception:
                        pass

            if session_id and assistant_full:
                full_text = "".join(assistant_full).strip()
                if full_text:
                    session_manager.add_message(session_id, "assistant", full_text)

        return StreamingResponse(
            event_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )

    # 3. Standard Non-Streaming JSON Response
    response = groq_service.generate_rag_response(
        query=user_query,
        retrieved_chunks=retrieved_chunks,
        conversation_history=history,
        session_id=session_id
    )

    # 4. Save turn in session memory
    if session_id:
        session_manager.add_message(session_id, "user", user_query)
        session_manager.add_message(session_id, "assistant", response.answer)

    return response

