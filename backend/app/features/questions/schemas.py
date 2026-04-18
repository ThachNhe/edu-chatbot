from typing import List, Optional

from pydantic import BaseModel


# ─── Existing ─────────────────────────────────────────────────────────────

class UpdateOptionIn(BaseModel):
    id: int
    letter: str
    content: str
    is_correct: bool


class UpdateQuestionRequest(BaseModel):
    content: Optional[str] = None
    level: Optional[str] = None
    options: Optional[List[UpdateOptionIn]] = None


# ─── Question Bank: Create ───────────────────────────────────────────────

class CreateOptionIn(BaseModel):
    letter: str
    content: str
    is_correct: bool = False


class CreateQuestionRequest(BaseModel):
    content: str
    level: str  # 'easy' | 'med' | 'hard'
    lesson_id: Optional[int] = None
    options: List[CreateOptionIn]


# ─── Question Bank: Response ─────────────────────────────────────────────

class QuestionOptionOut(BaseModel):
    id: int
    letter: str
    content: str
    is_correct: bool

    model_config = {"from_attributes": True}


class QuestionBankItem(BaseModel):
    id: int
    content: str
    level: str
    lesson_id: Optional[int]
    lesson_name: Optional[str] = None
    usage_count: int = 0
    created_at: str
    options: List[QuestionOptionOut]

    model_config = {"from_attributes": True}