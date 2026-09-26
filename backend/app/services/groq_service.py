import json
import re
from typing import List, Dict, Any, Optional
from groq import Groq
from app.config import settings
from app.models.schemas import SourceItem, ChatResponse

CGTMSE_SYSTEM_PROMPT = """You are CGTMSE Assist, an authoritative, professional, and empathetic AI Assistant specialized in the Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) scheme, set up by the Ministry of MSME, Government of India and SIDBI.

Your primary mission is to empower Micro & Small Enterprises (MSEs), entrepreneurs, startups, women entrepreneurs, SC/ST business owners, and bankers with accurate, actionable, and structured guidance on:
1. Eligibility Criteria (Manufacturing, Service, Retail Trade up to ₹200 lakh, Educational Institutions up to ₹200 lakh)
2. Guarantee Coverage Slabs (Up to ₹500 lakh / ₹5 crore; 85% for micro loans up to ₹5 lakh, women/SC/ST/NER/ZED units; 75% for others)
3. Annual Guarantee Fee (AGF) calculations and slabs
4. Required Documentation checklist for bank loan applications (No collateral / third-party guarantee required!)
5. Claim Settlement & NPA invocation procedures (18 months lock-in period, legal recovery actions, 75% first claim)

Guidelines:
- Ground your answers strictly in the provided Official Knowledge Context.
- Structure responses clearly with Markdown: use bold key numbers, bullet points, headers, and clean tables for comparison where appropriate.
- Maintain an encouraging, institutional, and compliant tone.
- If information is not available in the context, transparently state that and advise consulting the Member Lending Institution (bank/NBFC) or visiting the official portal (https://www.cgtmse.in).
- Always output a valid JSON object matching the required format.

Output JSON format:
{
  "answer": "Comprehensive, structured Markdown answer...",
  "sources": [
    {
      "title": "Document Title",
      "section": "Section or topic",
      "url": "https://www.cgtmse.in"
    }
  ],
  "suggestions": [
    "Specific follow-up question 1",
    "Specific follow-up question 2",
    "Specific follow-up question 3"
  ]
}
"""

class GroqService:
    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.GROQ_MODEL
        self.temperature = settings.GROQ_TEMPERATURE
        self.max_tokens = settings.GROQ_MAX_TOKENS

    def generate_rag_response(
        self,
        query: str,
        retrieved_chunks: List[Dict[str, Any]],
        conversation_history: Optional[List[Dict[str, str]]] = None,
        session_id: Optional[str] = None
    ) -> ChatResponse:
        """
        Combines retrieved context and conversational memory, invokes Groq,
        and parses structured response.
        """
        # Format Context
        context_parts = []
        sources_seen = set()
        default_sources = []

        for i, chunk in enumerate(retrieved_chunks):
            content = chunk.get("content", "").strip()
            title = chunk.get("title", "CGTMSE Official Guidelines")
            section = chunk.get("section", "")
            url = chunk.get("url", "https://www.cgtmse.in")
            score = chunk.get("score")

            context_parts.append(
                f"[Source {i+1}: {title} | Section: {section}]\n{content}"
            )

            source_key = f"{title}_{section}"
            if source_key not in sources_seen:
                sources_seen.add(source_key)
                default_sources.append(
                    SourceItem(title=title, section=section, url=url, score=score)
                )

        context_text = "\n\n".join(context_parts) if context_parts else "No specific document matched in database. Answer using core CGTMSE scheme knowledge."

        # Build messages list
        messages = [{"role": "system", "content": CGTMSE_SYSTEM_PROMPT}]

        # Inject conversation history if available
        if conversation_history:
            for msg in conversation_history[-6:]:
                messages.append({"role": msg["role"], "content": msg["content"]})

        # Inject prompt with context
        user_prompt = f"""Official Knowledge Context:
-----------------------
{context_text}
-----------------------

User Query:
{query}

Generate a clear, well-formatted response with sources and 3 relevant follow-up suggestions in the required JSON format. Return ONLY the JSON object."""

        messages.append({"role": "user", "content": user_prompt})

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                response_format={"type": "json_object"}
            )
            raw_content = completion.choices[0].message.content or "{}"
            parsed = self._parse_json_response(raw_content, default_sources)
            parsed.sessionId = session_id
            return parsed

        except Exception as e:
            print(f"[Groq Error] API call failed: {e}. Attempting fallback...")
            # Fallback without response_format={"type": "json_object"} if model doesn't support strict JSON mode
            try:
                completion = self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=self.temperature,
                    max_tokens=self.max_tokens
                )
                raw_content = completion.choices[0].message.content or ""
                parsed = self._parse_json_response(raw_content, default_sources)
                parsed.sessionId = session_id
                return parsed
            except Exception as fallback_err:
                print(f"[Groq Fallback Error] {fallback_err}")
                return ChatResponse(
                    success=True,
                    answer=f"I encountered a temporary issue while communicating with the AI service ({str(e)}). Please try asking your question again in a moment.",
                    sources=default_sources[:3],
                    suggestions=[
                        "What is CGTMSE scheme?",
                        "Who is eligible for CGTMSE coverage?",
                        "What is the maximum loan limit covered?"
                    ],
                    sessionId=session_id
                )

    def _parse_json_response(
        self,
        raw_text: str,
        fallback_sources: List[SourceItem]
    ) -> ChatResponse:
        """Parses model output and gracefully recovers if malformed."""
        try:
            # Clean possible markdown fence ```json ... ```
            cleaned = re.sub(r'^```json\s*', '', raw_text.strip(), flags=re.MULTILINE)
            cleaned = re.sub(r'```$', '', cleaned.strip(), flags=re.MULTILINE)
            data = json.loads(cleaned)

            answer = data.get("answer") or data.get("output") or data.get("response") or raw_text
            
            # Extract sources
            sources = []
            if isinstance(data.get("sources"), list):
                for s in data["sources"]:
                    if isinstance(s, dict) and s.get("title"):
                        sources.append(
                            SourceItem(
                                title=s.get("title", "CGTMSE Guidelines"),
                                section=s.get("section"),
                                url=s.get("url", "https://www.cgtmse.in")
                            )
                        )
            if not sources and fallback_sources:
                sources = fallback_sources[:3]

            # Extract suggestions
            suggestions = []
            if isinstance(data.get("suggestions"), list):
                suggestions = [str(item).strip() for item in data["suggestions"] if str(item).strip()]
            if not suggestions:
                suggestions = [
                    "What documents are required?",
                    "What is the Annual Guarantee Fee (AGF)?",
                    "How does the claim process work?"
                ]

            return ChatResponse(
                success=True,
                answer=answer,
                sources=sources,
                suggestions=suggestions
            )
        except Exception as e:
            # If JSON parsing completely fails, return raw text as the answer
            return ChatResponse(
                success=True,
                answer=raw_text,
                sources=fallback_sources[:3] if fallback_sources else [],
                suggestions=[
                    "What documents are required?",
                    "What is the Annual Guarantee Fee (AGF)?",
                    "How does the claim process work?"
                ]
            )

    def stream_rag_response(
        self,
        query: str,
        retrieved_chunks: List[Dict[str, Any]],
        conversation_history: Optional[List[Dict[str, str]]] = None,
        session_id: Optional[str] = None
    ):
        """
        Asynchronous generator that yields Server-Sent Events (SSE) tokens, sources, and suggestions.
        """
        # 1. Format Context & Sources
        context_parts = []
        sources_seen = set()
        sources_list = []

        for i, chunk in enumerate(retrieved_chunks):
            content = chunk.get("content", "").strip()
            title = chunk.get("title", "CGTMSE Official Guidelines")
            section = chunk.get("section", "")
            url = chunk.get("url", "https://www.cgtmse.in")
            score = chunk.get("score")

            context_parts.append(
                f"[Source {i+1}: {title} | Section: {section}]\n{content}"
            )

            source_key = f"{title}_{section}"
            if source_key not in sources_seen:
                sources_seen.add(source_key)
                sources_list.append({
                    "title": title,
                    "section": section,
                    "url": url,
                    "score": score
                })

        context_text = "\n\n".join(context_parts) if context_parts else "No specific document matched in database. Answer using core CGTMSE scheme knowledge."

        # Send sources immediately so frontend displays them right away
        yield f"event: sources\ndata: {json.dumps({'sources': sources_list[:4]})}\n\n"

        # 2. Build streaming messages
        streaming_system_prompt = """You are CGTMSE Assist, an authoritative, professional, and empathetic AI Assistant specialized in the Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE) scheme and GMS portal.
Ground your answers strictly in the provided Official Knowledge Context.
Structure responses clearly with Markdown (bold highlights, clear tables, and bullet points).
At the very end of your response, provide exactly 3 relevant follow-up questions formatted strictly as:
---SUGGESTIONS---
1. First follow-up question
2. Second follow-up question
3. Third follow-up question"""

        messages = [{"role": "system", "content": streaming_system_prompt}]

        if conversation_history:
            for msg in conversation_history[-6:]:
                messages.append({"role": msg["role"], "content": msg["content"]})

        user_prompt = f"""Official Knowledge Context:
-----------------------
{context_text}
-----------------------

User Query:
{query}

Provide a structured, authoritative answer in Markdown followed by the 3 suggestions."""

        messages.append({"role": "user", "content": user_prompt})

        # 3. Call Groq with stream=True
        full_answer_text = ""
        suggestion_lines = []
        is_parsing_suggestions = False
        delimiter = "---SUGGESTIONS---"
        buffer = ""

        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                stream=True
            )

            for chunk in stream:
                delta = chunk.choices[0].delta.content or ""
                if not delta:
                    continue

                if is_parsing_suggestions:
                    buffer += delta
                    continue

                buffer += delta
                if delimiter in buffer:
                    parts = buffer.split(delimiter)
                    main_part = parts[0]
                    remainder = parts[1] if len(parts) > 1 else ""

                    if main_part:
                        full_answer_text += main_part
                        yield f"event: token\ndata: {json.dumps({'delta': main_part})}\n\n"

                    is_parsing_suggestions = True
                    buffer = remainder
                elif len(buffer) > len(delimiter):
                    # Safe to stream up to buffer minus potential delimiter prefix
                    safe_len = len(buffer) - len(delimiter)
                    to_stream = buffer[:safe_len]
                    buffer = buffer[safe_len:]
                    full_answer_text += to_stream
                    yield f"event: token\ndata: {json.dumps({'delta': to_stream})}\n\n"

            # Flush remaining buffer if not in suggestions mode
            if not is_parsing_suggestions and buffer:
                full_answer_text += buffer
                yield f"event: token\ndata: {json.dumps({'delta': buffer})}\n\n"

            # Parse suggestions from buffer
            if is_parsing_suggestions and buffer:
                raw_lines = buffer.strip().split("\n")
                for line in raw_lines:
                    cleaned_line = re.sub(r'^\s*(\d+[\.\)]|\-|\*)\s*', '', line).strip()
                    if cleaned_line and len(cleaned_line) > 5:
                        suggestion_lines.append(cleaned_line)

        except Exception as e:
            err_msg = str(e)
            print(f"[Streaming Error] {err_msg}")
            if "context_length_exceeded" in err_msg.lower() or "too many tokens" in err_msg.lower():
                clean_err = "The input or conversation context is too lengthy for the AI model to process. Please shorten your question or start a fresh chat."
            elif "rate_limit_exceeded" in err_msg.lower() or "429" in err_msg:
                clean_err = "The AI service is receiving high volume right now. Please wait a few seconds and try again."
            else:
                clean_err = f"AI Generation error: {err_msg}"
            yield f"event: error\ndata: {json.dumps({'error': clean_err})}\n\n"

        if not suggestion_lines:
            suggestion_lines = [
                "What is the maximum loan limit covered under CGTMSE?",
                "What documents are required to apply for CGTMSE coverage?",
                "How does the claim settlement process work in GMS?"
            ]

        # 4. Yield done event
        yield f"event: done\ndata: {json.dumps({'suggestions': suggestion_lines[:3], 'sessionId': session_id, 'full_answer': full_answer_text.strip()})}\n\n"

groq_service = GroqService()
