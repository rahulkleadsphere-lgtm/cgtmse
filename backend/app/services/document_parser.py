import json
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
from pypdf import PdfReader
import docx

class DocumentParser:
    """
    Parses PDF, DOCX, TXT, MD, and JSON files and splits them into clean chunks.
    """

    @staticmethod
    def parse_file(file_path: Path) -> Dict[str, Any]:
        """Extracts text content and metadata from a file."""
        suffix = file_path.suffix.lower()
        title = file_path.stem.replace("_", " ").replace("-", " ").title()

        if suffix in [".txt", ".md"]:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()
            return {"title": title, "content": content, "source": file_path.name}

        elif suffix == ".pdf":
            reader = PdfReader(str(file_path))
            pages = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text() or ""
                if text.strip():
                    pages.append(f"--- Page {i+1} ---\n{text.strip()}")
            content = "\n\n".join(pages)
            return {"title": title, "content": content, "source": file_path.name}

        elif suffix == ".docx":
            doc = docx.Document(str(file_path))
            paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            content = "\n\n".join(paragraphs)
            return {"title": title, "content": content, "source": file_path.name}

        elif suffix == ".json":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                data = json.load(f)
            if isinstance(data, list):
                content = "\n\n".join(json.dumps(item, indent=2) for item in data)
            elif isinstance(data, dict):
                content = json.dumps(data, indent=2)
            else:
                content = str(data)
            return {"title": title, "content": content, "source": file_path.name}

        else:
            raise ValueError(f"Unsupported file format: {suffix}")

    @staticmethod
    def chunk_text(
        text: str,
        chunk_size: int = 800,
        chunk_overlap: int = 150
    ) -> List[str]:
        """
        Splits text recursively using paragraphs, section headings, and sentences.
        Preserves natural boundaries and overlaps.
        """
        cleaned = text.strip()
        if not cleaned:
            return []

        if len(cleaned) <= chunk_size:
            return [cleaned]

        # First split by major markdown headers or multiple newlines
        paragraphs = re.split(r'\n{2,}|\n(?=#{1,4}\s)', cleaned)
        chunks = []
        current_chunk = []
        current_length = 0

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            para_len = len(para)

            # If a single paragraph is larger than chunk_size, split by sentences
            if para_len > chunk_size:
                sentences = re.split(r'(?<=[.!?])\s+', para)
                for sentence in sentences:
                    sentence = sentence.strip()
                    if not sentence:
                        continue
                    if current_length + len(sentence) > chunk_size and current_chunk:
                        chunk_str = " ".join(current_chunk)
                        chunks.append(chunk_str)
                        # Overlap
                        overlap_tokens = chunk_str[-chunk_overlap:] if chunk_overlap > 0 else ""
                        current_chunk = [overlap_tokens, sentence] if overlap_tokens else [sentence]
                        current_length = sum(len(c) for c in current_chunk) + len(current_chunk)
                    else:
                        current_chunk.append(sentence)
                        current_length += len(sentence) + 1
            else:
                if current_length + para_len > chunk_size and current_chunk:
                    chunk_str = "\n\n".join(current_chunk)
                    chunks.append(chunk_str)
                    overlap_tokens = chunk_str[-chunk_overlap:] if chunk_overlap > 0 else ""
                    current_chunk = [overlap_tokens, para] if overlap_tokens else [para]
                    current_length = sum(len(c) for c in current_chunk) + len(current_chunk)
                else:
                    current_chunk.append(para)
                    current_length += para_len + 2

        if current_chunk:
            chunks.append("\n\n".join(current_chunk))

        # Filter out empty or whitespace-only chunks
        return [c.strip() for c in chunks if c.strip()]

document_parser = DocumentParser()
