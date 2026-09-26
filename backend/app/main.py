import sys
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

import time
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.config import settings
from app.api import chat_router, ingest_router, health_router
from app.services.qdrant_service import qdrant_service
from app.services.document_parser import document_parser

# Rate Limiter
limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup & shutdown events."""
    print("=" * 60)
    print("Initializing CGTMSE Assist RAG Backend...")
    print(f"   Environment : {settings.ENVIRONMENT}")
    print(f"   Groq Model  : {settings.GROQ_MODEL}")
    print(f"   Qdrant DB   : {settings.QDRANT_URL}")
    print(f"   Embeddings  : {settings.EMBEDDING_PROVIDER} (dim={settings.EMBEDDING_DIMENSION})")
    print("=" * 60)

    # Ensure Qdrant collection is ready
    qdrant_service.ensure_collection_exists()

    # Automatically check if knowledge base has data; if empty, ingest default CGTMSE guidelines
    stats = qdrant_service.get_stats()
    if stats.get("points_count", 0) == 0:
        print("[Startup] Knowledge base is empty. Auto-ingesting official CGTMSE guidelines...")
        try:
            knowledge_dir = settings.DEFAULT_KNOWLEDGE_DIR
            if knowledge_dir.exists():
                files = list(knowledge_dir.glob("*.md")) + list(knowledge_dir.glob("*.txt"))
                total_chunks = 0
                for f in files:
                    parsed = document_parser.parse_file(f)
                    chunks = document_parser.chunk_text(parsed["content"], chunk_size=800, chunk_overlap=150)
                    total_chunks += qdrant_service.upsert_chunks(
                        chunks=chunks,
                        title=parsed["title"],
                        section="Official Framework",
                        url="https://www.cgtmse.in"
                    )
                print(f"[Startup] Successfully pre-indexed {len(files)} official guidelines ({total_chunks} chunks)!")
        except Exception as e:
            print(f"[Startup Warning] Could not auto-ingest default guidelines: {e}")
    else:
        print(f"[Startup] Qdrant already contains {stats.get('points_count')} indexed knowledge vectors.")

    yield
    print("[Shutdown] CGTMSE Assist backend stopped.")

# FastAPI App
app = FastAPI(
    title="CGTMSE Assist RAG API",
    description="Scalable, Production-Grade RAG Backend for Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE).",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Set rate limiter on state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS Configuration
raw_origins = settings.cors_origins_list
has_wildcard = "*" in raw_origins
explicit_origins = [o for o in raw_origins if o != "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=explicit_origins if not has_wildcard else [],
    allow_origin_regex=r"^https?://.*" if has_wildcard else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Process Timing Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = f"{process_time:.4f}s"
        return response
    except Exception as e:
        process_time = time.time() - start_time
        return JSONResponse(
            status_code=500,
            content={"success": False, "detail": "Internal server error occurred.", "error": str(e)},
            headers={"X-Process-Time": f"{process_time:.4f}s"}
        )

# Register Routers
app.include_router(health_router)
app.include_router(chat_router)
app.include_router(ingest_router)
