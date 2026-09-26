# CGTMSE Assist - Production Deployment Guide

This guide walks you through deploying the **FastAPI RAG Backend on Railway** and the **React Chatbot Frontend on Vercel**.

---

## Part 1: Deploy Backend to Railway

### Step 1: Push Code to GitHub
Ensure your repository is pushed to GitHub. The repository includes:
- `backend/Dockerfile`
- `backend/Procfile`
- `backend/railway.json`
- `backend/requirements.txt`
- `backend/.dockerignore` & `backend/.gitignore`

### Step 2: Create Railway Project
1. Log in to [Railway.app](https://railway.app).
2. Click **+ New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. If deploying from a monorepo, go to **Settings** -> **Root Directory** and set it to:
   ```text
   backend
   ```
5. Railway will automatically detect the `Dockerfile` and `railway.json`.

### Step 3: Set Environment Variables in Railway
Under your Railway service -> **Variables** tab, add the following:

| Variable Name | Production Value |
| :--- | :--- |
| `ENVIRONMENT` | `production` |
| `DEBUG` | `False` |
| `GROQ_API_KEY` | `your_groq_api_key_here` |
| `GROQ_MODEL` | `qwen/qwen3.8-27b` |
| `GROQ_TEMPERATURE` | `0.2` |
| `GROQ_MAX_TOKENS` | `750` |
| `QDRANT_URL` | `https://your-cluster-id.us-west-1-0.aws.cloud.qdrant.io` |
| `QDRANT_API_KEY` | `your_qdrant_api_key_here` |
| `QDRANT_COLLECTION` | `cgtmse_knowledge_base` |
| `EMBEDDING_PROVIDER` | `builtin` |
| `EMBEDDING_DIMENSION` | `384` |
| `CORS_ORIGINS` | `*` |
| `RATE_LIMIT_PER_MINUTE` | `60` |

### Step 4: Generate Domain
1. In Railway service -> **Settings** -> **Public Networking**, click **Generate Domain**.
2. Note your Railway public URL: `https://cgtmse-production.up.railway.app`.
3. Verify it by visiting: `https://cgtmse-production.up.railway.app/health`.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Import Project to Vercel
1. Log in to [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Select your GitHub repository.
4. Set the **Root Directory** to:
   ```text
   Cgtmse-LeadSphereChatbot-main
   ```
5. Vercel automatically detects the framework as **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Step 2: Set Environment Variables in Vercel
In Vercel -> **Environment Variables**, add:

| Variable Name | Value |
| :--- | :--- |
| `VITE_N8N_WEBHOOK_URL` | `https://cgtmse-production.up.railway.app/webhook/websiteflow` |

### Step 3: Deploy
1. Click **Deploy**.
2. Vercel builds the SPA in ~30 seconds using the pre-configured `vercel.json` rewrite rules.
3. Test your live chatbot!

---

## Part 3: Verification Checklist

- [ ] `GET https://cgtmse-production.up.railway.app/health` returns status `healthy`
- [ ] `POST https://cgtmse-production.up.railway.app/webhook/websiteflow` returns SSE token streaming
- [ ] Vercel app loads with theme toggle, suggestions, and real-time streaming
- [ ] Input exceeding 4,000 characters displays the red context warning banner
