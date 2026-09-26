import argparse
import sys
import uuid
from pathlib import Path

# Add backend directory to sys.path so app modules are resolvable
BACKEND_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BACKEND_DIR))

from app.config import settings
from app.services.document_parser import document_parser
from app.services.qdrant_service import qdrant_service

def ingest_file(file_path: Path, title: str = None, section: str = None, url: str = None):
    print(f"[Ingest] Reading file: {file_path}...")
    try:
        parsed = document_parser.parse_file(file_path)
        doc_title = title or parsed["title"]
        chunks = document_parser.chunk_text(parsed["content"], chunk_size=800, chunk_overlap=150)
        
        doc_id = str(uuid.uuid4())
        count = qdrant_service.upsert_chunks(
            chunks=chunks,
            title=doc_title,
            section=section or "Official Circular",
            url=url or f"https://www.cgtmse.in/circulars/{file_path.name}",
            doc_id=doc_id
        )
        print(f"  -> SUCCESS: Indexed '{doc_title}' ({count} chunks, doc_id={doc_id})")
        return count
    except Exception as e:
        print(f"  -> FAILED {file_path.name}: {e}")
        return 0

def ingest_directory(dir_path: Path):
    if not dir_path.exists():
        print(f"[Error] Directory not found: {dir_path}")
        return

    supported_exts = {".pdf", ".docx", ".txt", ".md", ".json"}
    files = [f for f in dir_path.glob("*") if f.suffix.lower() in supported_exts]
    print(f"[Ingest] Found {len(files)} supported document(s) in {dir_path}...")

    total_chunks = 0
    for f in files:
        total_chunks += ingest_file(f)
    print(f"[Ingest Complete] Total {total_chunks} chunks indexed into Qdrant collection '{settings.QDRANT_COLLECTION}'.")

def show_stats():
    stats = qdrant_service.get_stats()
    print("=" * 50)
    print("  Qdrant Knowledge Base Stats")
    print("=" * 50)
    for k, v in stats.items():
        print(f"  {k:20}: {v}")
    print("=" * 50)

def clear_all():
    confirm = input("Are you sure you want to clear the entire Qdrant collection? (y/N): ")
    if confirm.lower() == "y":
        qdrant_service.clear_collection()
        print("Collection cleared and reinitialized.")
    else:
        print("Aborted.")

def main():
    parser = argparse.ArgumentParser(description="CGTMSE Knowledge Ingestion CLI")
    parser.add_argument("--file", "-f", type=str, help="Path to single file to ingest (.pdf, .docx, .txt, .md, .json)")
    parser.add_argument("--dir", "-d", type=str, help="Directory of files to ingest")
    parser.add_argument("--default", action="store_true", help="Ingest all built-in official CGTMSE guidelines")
    parser.add_argument("--stats", "-s", action="store_true", help="Display Qdrant collection statistics")
    parser.add_argument("--clear", "-c", action="store_true", help="Clear all vectors from the collection")
    parser.add_argument("--title", "-t", type=str, help="Optional custom title for the document")
    parser.add_argument("--section", type=str, help="Optional section/topic name")
    parser.add_argument("--url", type=str, help="Optional source URL")

    args = parser.parse_args()

    if args.stats:
        show_stats()
    elif args.clear:
        clear_all()
    elif args.default:
        ingest_directory(settings.DEFAULT_KNOWLEDGE_DIR)
    elif args.file:
        ingest_file(Path(args.file), title=args.title, section=args.section, url=args.url)
    elif args.dir:
        ingest_directory(Path(args.dir))
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
