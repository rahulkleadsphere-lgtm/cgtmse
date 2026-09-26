from pathlib import Path
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field, field_validator

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Groq LLM
    GROQ_API_KEY: str
    GROQ_MODEL: str = "qwen/qwen3.8-27b"
    GROQ_TEMPERATURE: float = 0.2
    GROQ_MAX_TOKENS: int = 750

    # Qdrant
    QDRANT_URL: str
    QDRANT_API_KEY: str
    QDRANT_COLLECTION: str = "cgtmse_knowledge_base"
    QDRANT_TIMEOUT: int = 30

    # Embeddings
    EMBEDDING_PROVIDER: str = "builtin"  # "builtin", "huggingface", "openai"
    EMBEDDING_DIMENSION: int = 384
    HF_TOKEN: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_EMBEDDING_MODEL: str = "text-embedding-3-small"
    OPENAI_EMBEDDING_URL: str = "https://api.openai.com/v1"

    # Security & CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,*"
    RATE_LIMIT_PER_MINUTE: int = 60
    MAX_UPLOAD_SIZE_MB: int = 25
    API_SECRET_KEY: Optional[str] = None

    # Storage paths
    DATA_DIR: Path = BASE_DIR / "data"
    DEFAULT_KNOWLEDGE_DIR: Path = BASE_DIR / "data" / "default_knowledge"
    UPLOADS_DIR: Path = BASE_DIR / "data" / "uploads"

    @property
    def cors_origins_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
