import json
import sys
import uuid
from pathlib import Path

# Add backend to path
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

from app.config import settings
from app.services.embedder import embedder
from app.services.qdrant_service import qdrant_service
from qdrant_client.http import models

def main():
    json_path = BACKEND_DIR / "data" / "cgtmse_gms_100_faqs.json"
    if not json_path.exists():
        print(f"[Error] File not found: {json_path}")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        faqs = json.load(f)

    print(f"Loaded {len(faqs)} FAQs from {json_path.name}")
    print(f"Target Qdrant Collection: {settings.QDRANT_COLLECTION}")

    # Prepare Markdown version as well
    md_lines = ["# CGTMSE Guarantee Management System (GMS) - 100 Comprehensive Operational FAQs\n"]
    current_cat = None

    points = []
    texts_to_embed = []

    for item in faqs:
        cat = item["category"]
        q = item["question"]
        a = item["answer"]
        faq_id = item["id"]

        if cat != current_cat:
            current_cat = cat
            md_lines.append(f"\n## {cat}\n")

        md_lines.append(f"### {q}\n{a}\n")

        # Rich composite content for vector embedding and retrieval
        content = f"Question: {q}\nCategory: {cat}\nAnswer:\n{a}"
        texts_to_embed.append(content)

    # Save Markdown file to default_knowledge
    md_path = BACKEND_DIR / "data" / "default_knowledge" / "cgtmse_gms_100_faqs.md"
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("\n".join(md_lines))
    print(f"Saved comprehensive Markdown archive to {md_path.name}")

    # Generate embeddings in batches of 20
    print("Generating vector embeddings...")
    batch_size = 20
    all_embeddings = []
    for i in range(0, len(texts_to_embed), batch_size):
        batch = texts_to_embed[i:i+batch_size]
        batch_vecs = embedder.embed_batch(batch)
        all_embeddings.extend(batch_vecs)
        print(f"  -> Embedded {len(all_embeddings)} / {len(texts_to_embed)} FAQs...")

    # Build Qdrant points
    for i, item in enumerate(faqs):
        faq_id = item["id"]
        cat = item["category"]
        q = item["question"]
        a = item["answer"]
        vector = all_embeddings[i]

        point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"faq_{faq_id}"))
        payload = {
            "faq_id": faq_id,
            "title": f"GMS FAQ: {q}",
            "question": q,
            "section": cat,
            "url": "https://www.cgtmse.in/gms",
            "content": f"### {q}\n\n**Category**: {cat}\n\n{a}"
        }
        points.append(
            models.PointStruct(
                id=point_id,
                vector=vector,
                payload=payload
            )
        )

    # Upsert to Qdrant
    print(f"Upserting {len(points)} points into Qdrant collection '{settings.QDRANT_COLLECTION}'...")
    qdrant_service.client.upsert(
        collection_name=settings.QDRANT_COLLECTION,
        points=points
    )

    print("\n[SUCCESS] All 100 GMS FAQs successfully indexed into Qdrant Cloud!")
    
    # Check updated stats
    stats = qdrant_service.get_stats()
    print("=" * 50)
    print("Updated Qdrant Knowledge Base Stats:")
    print(f"  Collection Name: {stats.get('collection_name')}")
    print(f"  Total Vectors  : {stats.get('vectors_count')}")
    print(f"  Status         : {stats.get('status')}")
    print("=" * 50)

    # Verification Test Search
    print("\nRunning Verification Search on FAQ: 'What should I do if my GMS account is locked?'")
    results = qdrant_service.search_relevant_chunks("What should I do if my GMS account is locked?", limit=2)
    for r in results:
        print(f"Found: {r['title']} (Score: {r['score']:.4f})")
        print(f"Snippet: {r['content'][:120]}...\n")

if __name__ == "__main__":
    main()
