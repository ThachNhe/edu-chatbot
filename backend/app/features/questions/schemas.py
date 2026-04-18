from typing import List, Optional

from pydantic import BaseModel, Field


# ─── AI Generate ─────────────────────────────────────────────────────────────

class GenerateQuestionsRequest(BaseModel):
    topic: str
    count: int = Field(default=5, ge=1, le=30)
    difficulty: str = "mixed"  # 'easy' | 'med' | 'hard' | 'mixed'


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
    topic: Optional[str] = None
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
    topic: Optional[str] = None
    lesson_id: Optional[int]
    lesson_name: Optional[str] = None
    usage_count: int = 0
    created_at: str
    options: List[QuestionOptionOut]

    model_config = {"from_attributes": True}