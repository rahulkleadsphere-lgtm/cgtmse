from fastapi import APIRouter
from app.config import settings
from app.models.schemas import HealthResponse

router = APIRouter(tags=["System & Health"])

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health Check",
    description="Returns current health status and connected components."
)
async def health_check() -> HealthResponse:
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        llm_provider="groq",
        llm_model=settings.GROQ_MODEL,
        vector_db="qdrant",
        embedding_provider=settings.EMBEDDING_PROVIDER
    )

@router.get("/", summary="Root Endpoint")
async def root():
    return {
        "app": "CGTMSE Assist RAG Backend",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "health_url": "/health",
        "endpoints": {
            "chat": "/api/chat",
            "webhook_compatibility": "/webhook/websiteflow",
            "ingest_file": "/api/ingest/file",
            "ingest_text": "/api/ingest/text",
            "collection_stats": "/api/ingest/stats"
        }
    }
