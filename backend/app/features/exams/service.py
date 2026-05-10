import json
import os
import tempfile
from typing import List

from fastapi import UploadFile
from langchain_openai import ChatOpenAI

from app.config.config import settings


def _build_prompt(topic: str, count: int, difficulty: str) -> str:
    diff_map = {
        "easy": "dễ",
        "med": "trung bình",
        "hard": "khó",
        "mixed": "hỗn hợp (phân bổ đều các mức độ dễ/trung bình/khó)",
    }
    diff_label = diff_map.get(difficulty, "hỗn hợp")

    return f"""Bạn là giáo viên Tin học lớp 12. Hãy tạo {count} câu hỏi trắc nghiệm về chủ đề "{topic}" với mức độ {diff_label}.

Trả về JSON thuần túy (không markdown, không giải thích thêm), theo đúng cấu trúc sau:
{{
  "questions": [
    {{
      "number": 1,
      "content": "Nội dung câu hỏi",
      "level": "easy",
      "options": [
        {{"letter": "A", "content": "Lựa chọn A", "is_correct": false}},
        {{"letter": "B", "content": "Lựa chọn B", "is_correct": true}},
        {{"letter": "C", "content": "Lựa chọn C", "is_correct": false}},
        {{"letter": "D", "content": "Lựa chọn D", "is_correct": false}}
      ]
    }}
  ]
}}

Quy tắc bắt buộc:
- Mỗi câu hỏi có đúng 4 lựa chọn (A, B, C, D)
- Chỉ đúng 1 lựa chọn có "is_correct": true
- Giá trị "level" chỉ được là "easy", "med", hoặc "hard"
- Nếu difficulty là "mixed", phân bổ đều các mức độ"""


async def generate_exam_questions(topic: str, count: int, difficulty: str) -> List[dict]:
    llm = ChatOpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key,
        temperature=0.7,
    )

    prompt = _build_prompt(topic, count, difficulty)
    print("prompt: \n", prompt)
    result = await llm.ainvoke(prompt)
    raw = result.content.strip()

    # Strip markdown code block nếu model trả về ```json ... ```
    if raw.startswith("```"):
        parts = raw.split("```")
        raw = parts[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    data = json.loads(raw)
    return data["questions"]


# ─── File text extraction ─────────────────────────────────────────────────────

def _extract_text_from_bytes(filename: str, file_bytes: bytes) -> str:
    """Extract plain text from uploaded file bytes. Supports txt, pdf, docx."""
    suffix = os.path.splitext(filename)[1].lower()

    if suffix == ".txt":
        return file_bytes.decode("utf-8", errors="ignore")

    # Write to temp file and use unstructured for pdf/docx/etc.
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        from unstructured.partition.auto import partition  # type: ignore
        elements = partition(filename=tmp_path)
        return "\n".join(str(el) for el in elements if str(el).strip())
    except Exception:
        # Fallback: try to decode as UTF-8 text
        return file_bytes.decode("utf-8", errors="ignore")
    finally:
        os.unlink(tmp_path)


# ─── Prompt from file content ─────────────────────────────────────────────────

def _build_prompt_from_content(content: str, count: int, difficulty: str) -> str:
    diff_map = {
        "easy": "dễ",
        "med": "trung bình",
        "hard": "khó",
        "mixed": "hỗn hợp (phân bổ đều các mức độ dễ/trung bình/khó)",
    }
    diff_label = diff_map.get(difficulty, "hỗn hợp")

    # Truncate content to avoid exceeding context window
    max_chars = 6000
    if len(content) > max_chars:
        content = content[:max_chars] + "\n[... nội dung bị cắt bớt ...]"

    return f"""Bạn là giáo viên. Dựa trên nội dung tài liệu sau đây, hãy tạo {count} câu hỏi trắc nghiệm với mức độ {diff_label}.

NỘI DUNG TÀI LIỆU:
{content}

Trả về JSON thuần túy (không markdown, không giải thích thêm), theo đúng cấu trúc sau:
{{
  "questions": [
    {{
      "number": 1,
      "content": "Nội dung câu hỏi",
      "level": "easy",
      "options": [
        {{"letter": "A", "content": "Lựa chọn A", "is_correct": false}},
        {{"letter": "B", "content": "Lựa chọn B", "is_correct": true}},
        {{"letter": "C", "content": "Lựa chọn C", "is_correct": false}},
        {{"letter": "D", "content": "Lựa chọn D", "is_correct": false}}
      ]
    }}
  ]
}}

Quy tắc bắt buộc:
- Mỗi câu hỏi có đúng 4 lựa chọn (A, B, C, D)
- Chỉ đúng 1 lựa chọn có "is_correct": true
- Giá trị "level" chỉ được là "easy", "med", hoặc "hard"
- Nếu difficulty là "mixed", phân bổ đều các mức độ
- Câu hỏi phải dựa trực tiếp vào nội dung tài liệu đã cung cấp"""


async def generate_exam_questions_from_content(
    content: str, count: int, difficulty: str
) -> List[dict]:
    llm = ChatOpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key,
        temperature=0.7,
    )

    prompt = _build_prompt_from_content(content, count, difficulty)
    result = await llm.ainvoke(prompt)
    raw = result.content.strip()

    if raw.startswith("```"):
        parts = raw.split("```")
        raw = parts[1]
        if raw.startswith("json"):
            raw = raw[4:]
        raw = raw.strip()

    data = json.loads(raw)
    return data["questions"]