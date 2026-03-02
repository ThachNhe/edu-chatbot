import hashlib
import os
import re
from pathlib import Path

from dotenv import load_dotenv
from langchain_core.documents import Document
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter

load_dotenv()

DATA_DIR = Path(__file__).parent / "data"
SOURCE_FILE = DATA_DIR / "output.txt"
VECTOR_DIR = DATA_DIR / "vectorstore" / "faiss_index"


def build_faiss_index():
    if not SOURCE_FILE.exists():
        raise RuntimeError(
            f"No source file found at {SOURCE_FILE}. "
            "Please place output.txt in the data/ directory."
        )

    text = SOURCE_FILE.read_text(encoding="utf-8")
    if not text.strip():
        raise RuntimeError("output.txt is empty.")

    splitter = CharacterTextSplitter(chunk_size=800, chunk_overlap=200)
    chunks = splitter.split_text(text)

    all_docs = []
    seen = set()

    for chunk in chunks:
        if not chunk.strip():
            continue
        content = chunk.strip()
        key = hashlib.sha1(content.encode("utf-8")).hexdigest()
        if key in seen:
            continue
        seen.add(key)
        all_docs.append(
            Document(
                page_content=content,
                metadata={"source": str(SOURCE_FILE), "type": "textbook"},
            )
        )

    if not all_docs:
        raise RuntimeError("No content could be extracted from output.txt.")

    print(f"Total chunks indexed: {len(all_docs)}")

    embeddings = OpenAIEmbeddings()
    vectorstore = FAISS.from_documents(all_docs, embeddings)

    VECTOR_DIR.parent.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(VECTOR_DIR))
    print(f"Saved FAISS index at {VECTOR_DIR}")


if __name__ == "__main__":
    build_faiss_index()