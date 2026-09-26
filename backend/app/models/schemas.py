from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="User's query (max 4000 characters)")
    sessionId: Optional[str] = Field(default=None, description="Unique session ID for conversational memory")
    language: Optional[str] = Field(default="en", description="User preferred language")
    client: Optional[str] = Field(default="web", description="Client identifier (e.g. web, mobile)")
    stream: Optional[bool] = Field(default=False, description="Enable SSE token streaming")

class SourceItem(BaseModel):
    title: str = Field(..., description="Document or guideline title")
    section: Optional[str] = Field(default=None, description="Section or article within document")
    url: Optional[str] = Field(default=None, description="Reference or official circular URL")
    score: Optional[float] = Field(default=None, description="Relevance score from vector search")

class ChatResponse(BaseModel):
    success: bool = True
    answer: str
    sources: List[SourceItem] = Field(default_factory=list)
    suggestions: List[str] = Field(default_factory=list)
    sessionId: Optional[str] = None
    
    # Compatibility aliases for varied frontends or n8n workflows
    @property
    def output(self) -> str:
        return self.answer

    @property
    def response(self) -> str:
        return self.answer

    @property
    def message(self) -> str:
        return self.answer

    model_config = {
        "json_schema_extra": {
            "example": {
                "success": True,
                "answer": "Micro and Small Enterprises (both existing and new) are eligible for credit guarantee cover up to ₹500 lakh...",
                "sources": [
                    {
                        "title": "CGTMSE Scheme Guidelines",
                        "section": "Eligibility Criteria",
                        "url": "https://www.cgtmse.in"
                    }
                ],
                "suggestions": [
                    "What documents are required for application?",
                    "What is the Annual Guarantee Fee (AGF) rate?",
                    "What coverage is offered to women entrepreneurs?"
                ],
                "sessionId": "b6a718cb-04e4-4d89-9a79-ec0a18712a44"
            }
        }
    }

class IngestTextRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Title of the document")
    content: str = Field(..., min_length=10, description="Full text or markdown content")
    section: Optional[str] = Field(default=None, description="Section or category")
    url: Optional[str] = Field(default="https://www.cgtmse.in", description="Source link")
    chunk_size: Optional[int] = Field(default=800, ge=100, le=3000)
    chunk_overlap: Optional[int] = Field(default=150, ge=0, le=500)

class IngestResponse(BaseModel):
    success: bool = True
    document_id: str
    chunks_count: int
    message: str

class CollectionStats(BaseModel):
    collection_name: str
    vectors_count: int
    points_count: int
    status: str

class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
    environment: str
    llm_provider: str = "groq"
    llm_model: str
    vector_db: str = "qdrant"
    embedding_provider: str
