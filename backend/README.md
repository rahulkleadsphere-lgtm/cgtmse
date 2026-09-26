# CGTMSE Assist - Python FastAPI RAG Backend

Production-grade, scalable, and secure Retrieval-Augmented Generation (RAG) backend for **CGTMSE Assist**, powered by **Groq LLM** (`qwen/qwen3.8-27b`) and **Qdrant Vector Database** (AWS Cloud).

---

## 🏗️ Architecture Overview

```
Frontend (React + Vite)
       │
       ▼  POST /webhook/websiteflow or /api/chat
FastAPI Backend (Port 8000)
       ├── Session Memory (Multi-turn conversational sliding window)
       ├── Embedding Engine (384-dim subword semantic vectorizer)
       │         │
       │         ▼  Cosine Similarity Vector Query
       ├── Qdrant Cloud Vector Database (CGTMSE Guidelines & Circulars)
       │         │
       │         ▼  Augmented Prompt + Retrieved Chunks
       ├── Groq LLM Inference (qwen/qwen3.8-27b)
       │
       ▼  Structured JSON Response { answer, sources, suggestions }
Frontend UI (Rich Markdown, Tables, Source Badges, Interactive Prompts)
```

---

## 🚀 Key Features

1. **Groq LLM Acceleration**: Lightning-fast inference using Groq API with state-of-the-art models (`qwen/qwen3.8-27b`, `llama-3.1-8b-instant`, etc.).
2. **Qdrant Cloud Vector DB**: Managed, high-availability vector database with HNSW indexing and cosine similarity.
3. **Multi-Source Data Ingestion**:
   - Ingest **PDF**, **DOCX**, **TXT**, **MD**, and **JSON** files.
   - Built-in recursive character & semantic section chunker with configurable overlap.
   - CLI tool (`python ingest.py`) and REST endpoints (`/api/ingest/file`, `/api/ingest/text`).
4. **Conversational Multi-Turn Memory**: Preserves context across queries using `sessionId` sliding window.
5. **n8n Drop-In Compatibility**: Seamlessly exposes `/webhook/websiteflow` so existing frontends require zero code changes.
6. **Security & Production Hardening**:
   - Pydantic Settings with strict validation.
   - CORS origin protection.
   - Rate limiting via `slowapi` (60 req/min).
   - Optional API Key protection for admin endpoints.
   - Custom exception sanitization.

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── chat.py           # Chat & Webhook endpoints
│   │   ├── ingest.py         # Document ingestion & management
│   │   └── health.py         # System health check & info
│   ├── models/
│   │   └── schemas.py        # Pydantic request & response contracts
│   ├── services/
│   │   ├── embedder.py       # Resilient vector embedder
│   │   ├── qdrant_service.py # Qdrant client & vector operations
│   │   ├── groq_service.py   # Groq LLM prompt formatting & inference
│   │   ├── session_service.py# Multi-turn conversational memory
│   │   └── document_parser.py# PDF, Word, Markdown, Text parser & chunker
│   ├── config.py             # Pydantic settings & .env loading
│   └── main.py               # FastAPI app, lifespan, CORS, middleware
├── data/
│   ├── default_knowledge/    # 6 Preloaded official CGTMSE guidelines
│   └── uploads/              # Storage directory for uploaded documents
├── ingest.py                 # Standalone CLI tool to ingest documents
├── run.py                    # Server startup script
├── requirements.txt          # Python dependencies
├── .env                      # Active environment configuration
└── .env.example              # Template configuration
```

---

## ⚙️ Environment Configuration (`.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `HOST` | Server bind host | `0.0.0.0` |
| `PORT` | Server bind port | `8000` |
| `GROQ_API_KEY` | Groq API Key | *(Provided)* |
| `GROQ_MODEL` | Groq Model ID | `qwen/qwen3.8-27b` |
| `QDRANT_URL` | Qdrant Cloud Cluster URL | *(Provided)* |
| `QDRANT_API_KEY` | Qdrant API Key | *(Provided)* |
| `QDRANT_COLLECTION` | Vector collection name | `cgtmse_knowledge_base` |
| `EMBEDDING_PROVIDER` | Embedding engine (`builtin`, `huggingface`, `openai`) | `builtin` |
| `EMBEDDING_DIMENSION`| Vector dimensions | `384` |
| `CORS_ORIGINS` | Allowed CORS origins (comma-separated) | `http://localhost:5173,*` |
| `RATE_LIMIT_PER_MINUTE` | Max requests per IP per minute | `60` |

---

## 🛠️ Installation & Setup

### 1. Activate Virtual Environment
```powershell
# Windows
.\venv\Scripts\activate
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Run the Backend Server
```powershell
python run.py
```
*The server will start at `http://localhost:8000`. Interactive API Docs are available at `http://localhost:8000/docs`.*

---

## 📄 Ingesting Documents & Data

### Method 1: Command-Line Interface (`ingest.py`)

```powershell
# Ingest all built-in official CGTMSE guidelines
python ingest.py --default

# Ingest a custom PDF document
python ingest.py --file "C:\path\to\CGTMSE_Circular_2024.pdf" --title "Circular 2024"

# Ingest an entire directory of documents (.pdf, .docx, .txt, .md)
python ingest.py --dir "C:\path\to\my_circulars"

# Check Qdrant collection statistics
python ingest.py --stats

# Clear all indexed documents from Qdrant
python ingest.py --clear
```

### Method 2: REST API Endpoints

- **Upload & Ingest File**:
  `POST /api/ingest/file` (Multipart Form with `file`, optional `title`, `section`, `url`)
- **Ingest Raw Text / Markdown**:
  `POST /api/ingest/text` (JSON with `title`, `content`, `section`, `url`)
- **Collection Stats**:
  `GET /api/ingest/stats`

---

## 💬 Chat API Contract

### Request (`POST /api/chat` or `POST /webhook/websiteflow`)
```json
{
  "message": "Who is eligible for CGTMSE cover?",
  "sessionId": "b6a718cb-04e4-4d89-9a79-ec0a18712a44",
  "language": "en",
  "client": "web"
}
```

### Response
```json
{
  "success": true,
  "answer": "Micro and Small Enterprises (both existing and new) are eligible for credit guarantee cover up to ₹500 lakh...",
  "sources": [
    {
      "title": "Cgtmse Eligibility",
      "section": "Eligibility Criteria",
      "url": "https://www.cgtmse.in"
    }
  ],
  "suggestions": [
    "What documents are required to apply?",
    "What is the Annual Guarantee Fee (AGF) rate?",
    "What coverage is offered to women entrepreneurs?"
  ],
  "sessionId": "b6a718cb-04e4-4d89-9a79-ec0a18712a44"
}
```
