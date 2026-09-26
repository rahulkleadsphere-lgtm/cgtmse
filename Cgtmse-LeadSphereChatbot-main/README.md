# CGTMSE Assist

**CGTMSE Assist** is a polished, production-grade AI chatbot web application focused exclusively on the **Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)** scheme in India.

It connects Micro & Small Enterprises (MSEs) and bankers with clear, easy-to-understand guidance regarding CGTMSE eligibility, guarantee coverage, Annual Guarantee Fee (AGF), required documentation, claim settlements, and NPA procedures.

The frontend connects directly to an existing **n8n + Gemini AI Agent + Qdrant RAG** backend webhook.

---

## Architecture Flow

```
Frontend (React + Vite)
      │
      ▼  POST VITE_N8N_WEBHOOK_URL { message, sessionId, language: "en", client: "web" }
n8n Webhook
      │
      ▼
Gemini AI Agent (with conversational memory keyed by sessionId)
      │
      ▼
Qdrant Vector Database (CGTMSE Guidelines & Circulars)
      │
      ▼
Response normalized & rendered as rich Markdown with Sources & Follow-up Suggestions
```

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file to `.env`:

```bash
copy .env.example .env
```

Open `.env` and configure your active n8n webhook URL:

```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/websiteflow
```

*(Replace with your deployed or tunnelled n8n domain as applicable)*

### 3. Run Development Server

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
npm run preview
```

---

## Features & Highlights

- **ChatGPT-Quality Conversation UX**: Clean, minimal, full-viewport conversation layout with a 760–820px centered reading column.
- **Original Visual Identity**: Custom minimalist shield and intelligence spark logo (no copied OpenAI branding).
- **Persistent Multi-Turn Sessions**: Each conversation automatically creates and preserves a unique `sessionId` (`crypto.randomUUID()`), enabling n8n conversational memory.
- **Robust n8n Response Normalizer**: Automatically handles `.answer`, `.output`, `.response`, `.message`, or plain string responses, extracting verified `sources` and `suggestions` arrays.
- **Rich Markdown Support**: Full GFM markdown rendering supporting headings, bullet points, numbered lists, blockquotes, code blocks, tables with responsive horizontal scrolling, and secure outbound links (`rel="noopener noreferrer"`).
- **Collapsible Sidebar & Mobile Drawer**: 260px expanded, 68px collapsed on desktop, smooth overlay drawer on mobile (tested down to 375px).
- **Local Conversation History & Search**: Versioned `localStorage` persistence (`cgtmse-assist-conversations-v1`), grouped into "Today", "Yesterday", "Previous 7 Days", and "Older", with real-time local search across titles and message contents.
- **Inline Delete Confirmation**: Safe, non-intrusive deletion of individual chat threads.
- **Auto-Growing Sticky Composer**: Expands from 1 to 5+ lines, `Enter` to submit, `Shift + Enter` for new lines, and stop/cancel support for long-running AI queries.
- **60-Second Timeout & AbortController**: Prevents hanging requests during complex vector searches while preserving the user's prompt with an immediate in-chat retry action.
- **Dark Mode Default & Light Mode**: Tailored dark palette (`#0D0D0D`, `#090909`, `#212121`, `#2563EB`) with seamless toggle to light mode.

---

## n8n Integration Contract

### Request Payload (POST)
```json
{
  "message": "Who is eligible under CGTMSE?",
  "sessionId": "b6a718cb-04e4-4d89-9a79-ec0a18712a44",
  "language": "en",
  "client": "web"
}
```

### Preferred Response Contract
```json
{
  "success": true,
  "answer": "Micro and Small Enterprises (both existing and new) are eligible for credit guarantee cover up to ₹500 lakh...",
  "sources": [
    {
      "title": "CGTMSE Scheme Guidelines",
      "url": "https://www.cgtmse.in",
      "section": "Eligibility Criteria"
    }
  ],
  "suggestions": [
    "What documents are required?",
    "What is the Annual Guarantee Fee (AGF)?",
    "What guarantee coverage is provided for women entrepreneurs?"
  ]
}
```

> **CORS Note**: In n8n, ensure your Webhook node or n8n environment has CORS enabled (or set `N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true` / `WEBHOOK_URL`) so browser requests from your frontend origin (e.g. `http://localhost:5173`) are allowed.
# Cgtmse-LeadSphereChatbot
