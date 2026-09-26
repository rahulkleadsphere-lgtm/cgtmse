import hashlib
import re
import math
from typing import List, Optional
import httpx
import numpy as np
from app.config import settings

class ResilientEmbedder:
    """
    Robust embedding generator with multi-provider failover.
    Supports:
    1. Built-in dense subword feature projection (zero external dependency, high speed)
    2. Hugging Face Inference API (if HF_TOKEN is configured)
    3. OpenAI / compatible API (if OPENAI_API_KEY is configured)
    """

    def __init__(self):
        self.dimension = settings.EMBEDDING_DIMENSION
        self.provider = settings.EMBEDDING_PROVIDER.lower()
        self.hf_token = settings.HF_TOKEN
        self.openai_key = settings.OPENAI_API_KEY

    def embed_text(self, text: str) -> List[float]:
        """Generate embedding vector for a single string."""
        vectors = self.embed_batch([text])
        return vectors[0]

    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a batch of strings."""
        if not texts:
            return []

        # 1. Try Hugging Face if configured
        if self.provider == "huggingface" and self.hf_token:
            try:
                return self._embed_huggingface(texts)
            except Exception as e:
                print(f"[Embedder Warning] HuggingFace embedding failed, falling back: {e}")

        # 2. Try OpenAI if configured
        if self.provider == "openai" and self.openai_key:
            try:
                return self._embed_openai(texts)
            except Exception as e:
                print(f"[Embedder Warning] OpenAI embedding failed, falling back: {e}")

        # 3. Default built-in dense semantic subword projection
        return self._embed_builtin(texts)

    def _embed_huggingface(self, texts: List[str]) -> List[List[float]]:
        url = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2"
        headers = {"Authorization": f"Bearer {self.hf_token}"}
        with httpx.Client(timeout=15.0) as client:
            response = client.post(url, headers=headers, json={"inputs": texts})
            if response.status_code == 200:
                data = response.json()
                # data is List[List[float]]
                return data
            raise RuntimeError(f"HF Error {response.status_code}: {response.text}")

    def _embed_openai(self, texts: List[str]) -> List[List[float]]:
        url = f"{settings.OPENAI_EMBEDDING_URL.rstrip('/')}/embeddings"
        headers = {"Authorization": f"Bearer {self.openai_key}"}
        with httpx.Client(timeout=15.0) as client:
            response = client.post(
                url,
                headers=headers,
                json={"input": texts, "model": settings.OPENAI_EMBEDDING_MODEL}
            )
            if response.status_code == 200:
                data = response.json()
                return [item["embedding"] for item in data.get("data", [])]
            raise RuntimeError(f"OpenAI Error {response.status_code}: {response.text}")

    def _embed_builtin(self, texts: List[str]) -> List[List[float]]:
        """
        Pure Python + NumPy dense feature hasher.
        Computes character n-grams and word tokens, hashes them onto dimension space,
        applies logarithmic term frequency, and L2 normalizes.
        Guarantees cosine distance compatibility in Qdrant.
        """
        results = []
        dim = self.dimension

        for text in texts:
            vec = np.zeros(dim, dtype=np.float32)
            normalized = text.lower().strip()
            # Tokenize words
            words = re.findall(r'\b\w+\b', normalized)
            
            # Word tokens + 3-char, 4-char, 5-char n-grams for typo and subword resilience
            tokens = list(words)
            for w in words:
                if len(w) >= 3:
                    for n in range(3, min(6, len(w) + 1)):
                        for i in range(len(w) - n + 1):
                            tokens.append(w[i:i+n])

            # Bigrams
            for i in range(len(words) - 1):
                tokens.append(f"{words[i]}_{words[i+1]}")

            if not tokens:
                results.append(vec.tolist())
                continue

            # Project into fixed dimension using deterministic hash
            for token in tokens:
                # Use md5 for stable hash distribution across platforms
                h = int(hashlib.md5(token.encode('utf-8')).hexdigest(), 16)
                idx = h % dim
                sign = 1.0 if ((h >> 8) & 1) == 1 else -1.0
                vec[idx] += sign

            # Log frequency dampening (sublinear scaling)
            vec = np.sign(vec) * np.log1p(np.abs(vec))

            # L2 normalization for Cosine similarity
            norm = np.linalg.norm(vec)
            if norm > 1e-8:
                vec = vec / norm

            results.append(vec.tolist())

        return results

# Singleton instance
embedder = ResilientEmbedder()
