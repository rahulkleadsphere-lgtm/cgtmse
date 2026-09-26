import os
import shutil
import uuid
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Header, Depends
from app.config import settings
from app.models.schemas import IngestTextRequest, IngestResponse, CollectionStats
from app.services.document_parser import document_parser
from app.services.qdrant_service import qdrant_service

router = APIRouter(prefix="/api/ingest", tags=["Data Ingestion & Management"])

def verify_secret(x_api_key: Optional[str] = Header(None)):
    """Verifies optional API secret key if configured."""
    if settings.API_SECRET_KEY and x_api_key != settings.API_SECRET_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")

@router.post(
    "/text",
    response_model=IngestResponse,
    dependencies=[Depends(verify_secret)],
    summary="Ingest Raw Text or Markdown",
    description="Chunks and vectorizes raw text into Qdrant."
)
async def ingest_text(body: IngestTextRequest) -> IngestResponse:
    doc_id = str(uuid.uuid4())
    chunks = document_parser.chunk_text(
        text=body.content,
        chunk_size=body.chunk_size or 800,
        chunk_overlap=body.chunk_overlap or 150
    )

    if not chunks:
        raise HTTPException(status_code=400, detail="Content could not be chunked into valid text.")

    count = qdrant_service.upsert_chunks(
        chunks=chunks,
        title=body.title,
        section=body.section,
        url=body.url,
        doc_id=doc_id
    )

    return IngestResponse(
        success=True,
        document_id=doc_id,
        chunks_count=count,
        message=f"Successfully indexed '{body.title}' into {count} chunks in Qdrant."
    )

@router.post(
    "/file",
    response_model=IngestResponse,
    dependencies=[Depends(verify_secret)],
    summary="Upload & Ingest Document (PDF, DOCX, TXT, MD, JSON)",
    description="Uploads a document file, extracts text, chunks it, and indexes it into Qdrant."
)
async def ingest_file(
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    section: Optional[str] = Form(None),
    url: Optional[str] = Form(None),
    chunk_size: Optional[int] = Form(800),
    chunk_overlap: Optional[int] = Form(150)
) -> IngestResponse:
    # Validate extension
    file_ext = Path(file.filename).suffix.lower()
    allowed_exts = [".pdf", ".docx", ".txt", ".md", ".json"]
    if file_ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{file_ext}'. Allowed: {', '.join(allowed_exts)}"
        )

    # Save to uploads dir
    os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
    temp_path = settings.UPLOADS_DIR / f"{uuid.uuid4()}_{file.filename}"

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Parse file
        parsed = document_parser.parse_file(temp_path)
        doc_title = title or parsed["title"]
        content = parsed["content"]

        if not content.strip():
            raise HTTPException(status_code=400, detail="Extracted text from file was empty.")

        chunks = document_parser.chunk_text(
            text=content,
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap
        )

        doc_id = str(uuid.uuid4())
        count = qdrant_service.upsert_chunks(
            chunks=chunks,
            title=doc_title,
            section=section or "Official Document",
            url=url or f"https://www.cgtmse.in/circulars/{file.filename}",
            doc_id=doc_id
        )

        return IngestResponse(
            success=True,
            document_id=doc_id,
            chunks_count=count,
            message=f"Successfully parsed and indexed '{file.filename}' into {count} chunks in Qdrant."
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")
    finally:
        # Clean up temporary upload file if desired, or keep as archive
        pass

@router.post(
    "/default-knowledge",
    response_model=List[IngestResponse],
    dependencies=[Depends(verify_secret)],
    summary="Ingest Built-in Official CGTMSE Knowledge",
    description="Loads all markdown/txt files in data/default_knowledge/ and populates Qdrant."
)
async def ingest_default_knowledge() -> List[IngestResponse]:
    knowledge_dir = settings.DEFAULT_KNOWLEDGE_DIR
    if not knowledge_dir.exists():
        raise HTTPException(status_code=404, detail="Default knowledge directory not found.")

    results = []
    files = list(knowledge_dir.glob("*.md")) + list(knowledge_dir.glob("*.txt"))
    if not files:
        raise HTTPException(status_code=404, detail="No knowledge files found in directory.")

    for file_path in files:
        parsed = document_parser.parse_file(file_path)
        chunks = document_parser.chunk_text(parsed["content"], chunk_size=800, chunk_overlap=150)
        doc_id = str(uuid.uuid4())
        count = qdrant_service.upsert_chunks(
            chunks=chunks,
            title=parsed["title"],
            section="CGTMSE Core Framework",
            url="https://www.cgtmse.in",
            doc_id=doc_id
        )
        results.append(
            IngestResponse(
                success=True,
                document_id=doc_id,
                chunks_count=count,
                message=f"Indexed '{file_path.name}' ({count} chunks)."
            )
        )

    return results

@router.get(
    "/stats",
    response_model=CollectionStats,
    summary="Get Qdrant Collection Stats",
    description="Returns vectors count and status."
)
async def get_collection_stats() -> CollectionStats:
    stats = qdrant_service.get_stats()
    return CollectionStats(**stats)

@router.post(
    "/clear",
    dependencies=[Depends(verify_secret)],
    summary="Clear Qdrant Collection",
    description="Deletes and recreates the collection."
)
async def clear_collection():
    success = qdrant_service.clear_collection()
    if not success:
        raise HTTPException(status_code=500, detail="Failed to clear collection.")
    return {"success": True, "message": "Collection cleared and reinitialized successfully."}
