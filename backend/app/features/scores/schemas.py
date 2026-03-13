from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel


# ─── Request ─────────────────────────────────────────────────────────────────

class AnswerIn(BaseModel):
    question_id: int
    selected_letter: str


class SubmitExamRequest(BaseModel):
    student_name: str
    student_code: Optional[str] = None
    class_name: Optional[str] = None
    email: Optional[str] = None
    answers: List[AnswerIn]


# ─── Response ────────────────────────────────────────────────────────────────

class ScoreOut(BaseModel):
    id: int
    student_id: int
    exam_id: int
    score: float
    taken_at: datetime

    model_config = {"from_attributes": True}


class SubmitResult(BaseModel):
    score: float
    total: int
    correct: int
    student_id: int


class ScoreWithStudentOut(BaseModel):
    id: int
    student_name: str
    student_class: Optional[str]
    student_code: Optional[str]
    student_email: Optional[str]
    score: float
    taken_at: datetime