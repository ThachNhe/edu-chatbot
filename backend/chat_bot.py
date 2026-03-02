import json
import os
import re
import time
from pathlib import Path
from typing import List, Optional, Tuple

from dotenv import load_dotenv
from langchain_community.document_loaders import UnstructuredMarkdownLoader
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langdetect import DetectorFactory, detect, detect_langs
from lingua import Language, LanguageDetectorBuilder

load_dotenv()  # Load API key from .env

def _to_bool(val: str) -> Optional[bool]:
    if not val:
        return None
    low = val.strip().lower()
    if low in {"true", "yes"}:
        return True
    if low in {"false", "no"}:
        return False
    return None


BLUE = "\033[94m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
RED = "\033[91m"
RESET = "\033[0m"

DetectorFactory.seed = 0
SCORE_THRESHOLD = 0.5
LANG_DELTA = 0.2  # favor priority order when difference is smaller than delta

FALLBACK_MSG = "Xin lỗi, tôi không có đủ thông tin để trả lời câu hỏi này. Vui lòng hỏi giáo viên hoặc tham khảo sách giáo khoa."


def extract_token_usage(result) -> dict:
    """Try to extract token usage from LangChain/OpenAI response."""
    try:
        usage = getattr(result, "response_metadata", {}).get("token_usage", {})
        if usage:
            return usage
    except Exception:
        pass
    try:
        usage = getattr(result, "additional_kwargs", {}).get("usage", {})
        if usage:
            return usage
    except Exception:
        pass
    return {}


def log_token_usage(result, label: str = ""):
    usage = extract_token_usage(result)
    if usage:
        prompt_t = usage.get("prompt_tokens", usage.get("prompt", "?"))
        comp_t = usage.get("completion_tokens", usage.get("completion", "?"))
        total_t = usage.get("total_tokens", usage.get("total", "?"))
        prefix = f"{label} " if label else ""
        print(
            f"{RED}=== TOKEN USAGE {prefix}==={RESET} prompt={prompt_t} completion={comp_t} total={total_t}",
            flush=True,
        )
    else:
        prefix = f" ({label})" if label else ""
        print(f"{RED}=== TOKEN USAGE{prefix} ==={RESET} unavailable", flush=True)

DATA_DIR = Path(__file__).parent / "data"
VECTOR_DIR = DATA_DIR / "vectorstore" / "faiss_index"


def load_vectorstore():
    """
    Load FAISS index từ data/vectorstore/faiss_index.
    Nếu chưa có, thông báo cần chạy build_index.py trước.
    """
    embeddings = OpenAIEmbeddings()
    if VECTOR_DIR.exists():
        try:
            vs = FAISS.load_local(
                str(VECTOR_DIR),
                embeddings,
                allow_dangerous_deserialization=True,
            )
            print(f"[INFO] Loaded FAISS index from {VECTOR_DIR}")
            return vs
        except Exception as e:
            print(f"[WARN] Failed to load FAISS index at {VECTOR_DIR}: {e}")

    raise RuntimeError(
        "FAISS index is missing. Please run build_index.py first.\n"
        "Make sure data/output.txt exists before running build_index.py."
    )


vectorstore = load_vectorstore()
llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

MAIN_PROMPT = ChatPromptTemplate.from_template(
    "Bạn là một chatbot hỗ trợ học sinh trung học phổ thông môn Tin học.\n"
    "Khi có context, hãy trả lời dựa trên context đó (không bịa đặt). "
    "Với câu hỏi chào hỏi, cảm ơn hoặc kiến thức phổ thông (ví dụ 1+1=2), bạn có thể trả lời bằng kiến thức chung dù context trống.\n\n"
    "Context bao gồm nội dung sách giáo khoa Tin học THPT.\n\n"
    "Quy tắc:\n"
    "- Phát hiện ngôn ngữ câu hỏi và trả lời đúng ngôn ngữ đó.\n"
    "- Nếu người dùng hỏi bạn có thể giúp gì, hãy trả lời lịch sự rằng bạn hỗ trợ môn Tin học THPT.\n"
    "- Giữ nguyên markdown và các URL nếu có.\n"
    f"- Nếu context không đủ hoặc câu hỏi không liên quan đến Tin học THPT, trả lời bằng: \"{FALLBACK_MSG}\" theo ngôn ngữ câu hỏi, và không thêm gì khác.\n\n"
    "Ngôn ngữ câu hỏi: {lang_line}\n"
    "{history_block}\n"
    "{context}\n\nCâu hỏi: {question}"
)

EVAL_PROMPT = ChatPromptTemplate.from_template(
    "Câu trả lời sau có chứa thông tin hữu ích để giúp người dùng không?\n"
    "Trả lời CHỈ 'true' nếu có ích.\n"
    "Trả lời CHỈ 'false' nếu nói không thể giúp hoặc yêu cầu liên hệ hỗ trợ.\n\n"
    "Câu trả lời: {draft_answer}\n"
)

GENERAL_PROMPT = ChatPromptTemplate.from_template(
    "Bạn là một giáo viên Tin học THPT nhiệt tình và chuyên nghiệp.\n"
    "Hãy trả lời câu hỏi hoặc tạo bài giảng chi tiết, rõ ràng cho học sinh THPT.\n"
    "Sử dụng markdown để trình bày đẹp (tiêu đề, danh sách, bảng nếu cần).\n"
    "Lịch sử hội thoại:\n{history_block}\n\n"
    "Câu hỏi: {question}\n"
    "Trả lời:"
)

def answer_with_general_knowledge(query: str, history_block: str, lang_line: str) -> str:
    """Fallback: dùng GPT trả lời tự do khi không có context phù hợp."""
    try:
        chain = GENERAL_PROMPT | llm
        result = chain.invoke({
            "question": query,
            "history_block": history_block,
        })
        log_token_usage(result, label="[GENERAL]")
        return result.content if hasattr(result, "content") else str(result)
    except Exception as e:
        print(f"[GENERAL] Failed: {e}")
        return FALLBACK_MSG

def build_history_block(history: Optional[List[Tuple[str, str]]] = None) -> str:
    if not history:
        return ""
    recent = history[-6:]
    lines = []
    for role, content in recent:
        short = content.strip()
        if len(short) > 300:
            short = short[:300] + " ..."
        lines.append(f"{role}: {short}")
    return "Recent chat history:\n" + "\n".join(lines) + "\n"


def get_relevant_docs(query: str):
    raw_results: List[Tuple] = vectorstore.similarity_search_with_score(query, k=3)
    results = [(doc, score) for doc, score in raw_results if score < SCORE_THRESHOLD]
    docs = [doc for doc, _score in results]

    if not docs:
        print(
            "=== NO RELEVANT DOCS FOUND UNDER THRESHOLD "
            f"({SCORE_THRESHOLD}); empty context, LLM will apply fallback per prompt ==="
        )

    raw_context = "\n\n".join([d.page_content for d in docs])
    context = re.sub(r"(^|\n)[QA][\.:：]\s*", r"\1", raw_context)
    if not context.strip():
        print("=== EMPTY CONTEXT AFTER CLEANUP (LLM will decide per prompt) ===")

    print("=== SCORES (similarity_search_with_score) ===")
    if results:
        for idx, (doc, score) in enumerate(results, start=1):
            src = doc.metadata.get("source") or "unknown"
            print(f"{idx}. {YELLOW}score={score:.4f}{RESET} {BLUE}source={src}{RESET}")
        print("=== RELEVANT DOCS (full) ===")
        for idx, doc in enumerate(docs, start=1):
            src = doc.metadata.get("source") or "unknown"
            print(f"[{idx}] {BLUE}source={src}{RESET}\n{doc.page_content}\n---")
    else:
        print("No relevant documents found.")

    return context


def get_llm_response(query: str, context: str, history_block: str, lang_line: str):
    formatted_prompt = MAIN_PROMPT.format(
        context=context, question=query, lang_line=lang_line, history_block=history_block
    )
    print(f"=== LANG DETECTED === {lang_line}")
    result = llm.invoke(formatted_prompt)
    print("Check result : ", result, flush=True)
    output_raw = result.content if hasattr(result, "content") else str(result)
    output_raw = re.sub(r"^\s*(Answer:|A:)\s*", "", output_raw, flags=re.IGNORECASE).strip()
    print("=== RAW ANSWER (step1) ===", flush=True)
    print(output_raw, flush=True)
    return output_raw, result


def evaluate_answerability(query: str, draft_answer: str, lang_line: str):
    eval_msg = EVAL_PROMPT.format(
        draft_answer=draft_answer,
    )
    print("Draft answer for evaluation:", draft_answer, flush=True)
    eval_result = llm.invoke(eval_msg)
    print("=== EVAL RAW OUTPUT (step1) ===", eval_result, flush=True)
    eval_raw = eval_result.content if hasattr(eval_result, "content") else str(eval_result)
    print("=== EVAL RAW OUTPUT (step2) ===", flush=True)
    print(eval_raw, flush=True)

    eval_bool = _to_bool(eval_raw)
    if eval_bool is None:
        norm_out = (eval_raw or "").strip().lower()
        norm_fb = FALLBACK_MSG.lower()
        eval_bool = not (norm_fb in norm_out or "contact the support department" in norm_out)

    return eval_bool, eval_result


def translate_to_japanese(text: str, detected_lang: str) -> str:
    """
    Translate the query to Japanese if it's not already in Japanese.
    Returns the original text if it's already Japanese or translation fails.
    """
    if detected_lang == "ja":
        print("[TRANSLATE] Query is already in Japanese, skipping translation")
        return text
    
    if detected_lang == "unknown":
        print("[TRANSLATE] Unknown language, skipping translation")
        return text
    
    try:
        translate_prompt = ChatPromptTemplate.from_template(
            "Translate the following text to Japanese. "
            "Return ONLY the Japanese translation, nothing else.\n\n"
            "Text: {text}"
        )
        formatted = translate_prompt.format(text=text)
        result = llm.invoke(formatted)
        translated = result.content if hasattr(result, "content") else str(result)
        translated = translated.strip()
        
        print(f"[TRANSLATE] Original ({detected_lang}): {text}")
        print(f"[TRANSLATE] Japanese: {translated}")
        
        log_token_usage(result, label="(translate)")
        return translated
    except Exception as e:
        print(f"[TRANSLATE] Translation failed: {e}, using original query")
        return text

def answer(query: str, history: Optional[List[Tuple[str, str]]] = None) -> tuple:
    start = time.perf_counter()

    lang = 'vi'
    lang_line = (
        f"{lang}. Respond ONLY in {lang}. Do not switch languages."
        if lang != "unknown"
        else "unknown. Respond in the question's language."
    )

    context = get_relevant_docs(query)
    history_block = build_history_block(history)

    # Step 1: Gọi LLM với context từ vectorstore
    output_raw, result = get_llm_response(query, context, history_block, lang_line)

    if not output_raw:
        print("=== EMPTY MODEL OUTPUT -> GENERAL KNOWLEDGE ===")
        ans_text = answer_with_general_knowledge(query, history_block, lang_line)
        elapsed = time.perf_counter() - start
        print(f"=== TOTAL TIME: {elapsed:.2f}s ===")
        return ans_text, True

    # Step 2: Đánh giá câu trả lời có hữu ích không
    eval_bool, eval_result = evaluate_answerability(query, output_raw, lang_line)

    if eval_bool:
        # RAG trả lời được -> dùng luôn
        ans_text = output_raw
        can_answer = True
        print("=== ANSWERED FROM CONTEXT ===")
    else:
        # RAG không đủ context -> gọi GPT kiến thức chung
        print("=== CANNOT ANSWER FROM CONTEXT -> GENERAL KNOWLEDGE ===")
        ans_text = answer_with_general_knowledge(query, history_block, lang_line)
        can_answer = True  # GPT đã xử lý, không fallback nữa

    print("=== RESPONSE ===")
    print(f"{GREEN}{ans_text}{RESET}")

    log_token_usage(result)
    log_token_usage(eval_result, label="[EVAL]")

    elapsed = time.perf_counter() - start
    print(f"=== TOTAL TIME: {elapsed:.2f}s ===")

    return ans_text, can_answer

# query = "アフィリエイトで何ができますか？"
# query = "What can you do as an affiliate?"
# query = "サービスを追加しようとすると、「ログインできません。」と表示されてログアウトをしてしまいます。"

# response = answer(query)
# print(response)