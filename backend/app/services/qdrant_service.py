import uuid
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models
from app.config import settings
from app.services.embedder import embedder

class QdrantService:
    def __init__(self):
        self.client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY,
            timeout=settings.QDRANT_TIMEOUT
        )
        self.collection_name = settings.QDRANT_COLLECTION
        self.dimension = settings.EMBEDDING_DIMENSION
        self.ensure_collection_exists()

    def ensure_collection_exists(self) -> None:
        """Create the collection if it does not exist."""
        try:
            if not self.client.collection_exists(self.collection_name):
                print(f"[Qdrant] Creating collection '{self.collection_name}' (dim={self.dimension})...")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=self.dimension,
                        distance=models.Distance.COSINE
                    )
                )
                print(f"[Qdrant] Collection '{self.collection_name}' created successfully.")
            else:
                print(f"[Qdrant] Collection '{self.collection_name}' already exists.")
        except Exception as e:
            print(f"[Qdrant Error] Failed checking/creating collection: {e}")

    def upsert_chunks(
        self,
        chunks: List[str],
        title: str,
        section: Optional[str] = None,
        url: Optional[str] = None,
        doc_id: Optional[str] = None
    ) -> int:
        """Embeds and upserts a list of text chunks into Qdrant."""
        if not chunks:
            return 0

        doc_id = doc_id or str(uuid.uuid4())
        embeddings = embedder.embed_batch(chunks)
        points = []

        for i, (chunk, vector) in enumerate(zip(chunks, embeddings)):
            point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"{doc_id}_{i}"))
            payload = {
                "doc_id": doc_id,
                "chunk_index": i,
                "title": title,
                "section": section or "General Guidelines",
                "url": url or "https://www.cgtmse.in",
                "content": chunk
            }
            points.append(
                models.PointStruct(
                    id=point_id,
                    vector=vector,
                    payload=payload
                )
            )

        # Batch upsert
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        return len(points)

    def search_relevant_chunks(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Searches Qdrant for chunks closest to the user's query."""
        query_vector = embedder.embed_text(query)
        search_result = self.client.query_points(
            collection_name=self.collection_name,
            query=query_vector,
            limit=limit,
            with_payload=True
        )

        results = []
        for point in search_result.points:
            payload = point.payload or {}
            results.append({
                "id": point.id,
                "score": point.score,
                "content": payload.get("content", ""),
                "title": payload.get("title", "CGTMSE Official Guidelines"),
                "section": payload.get("section", ""),
                "url": payload.get("url", "https://www.cgtmse.in")
            })

        return results

    def get_stats(self) -> Dict[str, Any]:
        """Returns collection info and vector counts."""
        try:
            info = self.client.get_collection(self.collection_name)
            points_count = getattr(info, "points_count", 0) or 0
            vectors_count = getattr(info, "indexed_vectors_count", points_count) or points_count
            return {
                "collection_name": self.collection_name,
                "status": str(getattr(info, "status", "green")),
                "vectors_count": vectors_count,
                "points_count": points_count,
                "dimension": self.dimension
            }
        except Exception as e:
            return {
                "collection_name": self.collection_name,
                "status": f"Error: {e}",
                "vectors_count": 0,
                "points_count": 0,
                "dimension": self.dimension
            }

    def clear_collection(self) -> bool:
        """Deletes and recreates the collection."""
        try:
            if self.client.collection_exists(self.collection_name):
                self.client.delete_collection(self.collection_name)
            self.ensure_collection_exists()
            return True
        except Exception as e:
            print(f"[Qdrant Error] Failed to clear collection: {e}")
            return False

# Singleton instance
qdrant_service = QdrantService()
