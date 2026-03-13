from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ─── Request: AI Generate ────────────────────────────────────────────────────

class GenerateExamRequest(BaseModel):
    topic: str
    question_count: int = Field(10, ge=5, le=40)
    difficulty: str = "mixed"  # 'easy' | 'med' | 'hard' | 'mixed'
    duration: str = "45"


# ─── Request: Create Exam ─────────────────────────────────────────────────────

class OptionIn(BaseModel):
    letter: str
    content: str
    is_correct: bool = False


class QuestionIn(BaseModel):
    content: str
    level: str  # 'easy' | 'med' | 'hard'
    options: List[OptionIn]


class CreateExamRequest(BaseModel):
    title: str
    topic: Optional[str] = None
    duration: str
    level_mix: str = "mixed"
    status: str = "draft"  # 'draft' | 'published'
    questions: List[QuestionIn]


# ─── Request: Create Room ─────────────────────────────────────────────────────

class CreateRoomRequest(BaseModel):
    expires_at: Optional[datetime] = None


# ─── Response: ORM ───────────────────────────────────────────────────────────

class OptionOut(BaseModel):
    id: int
    letter: str
    content: str
    is_correct: bool

    model_config = {"from_attributes": True}


class QuestionOut(BaseModel):
    id: int
    content: str
    level: str
    options: List[OptionOut]

    model_config = {"from_attributes": True}


class ExamOut(BaseModel):
    id: int
    title: str
    topic: Optional[str]
    duration: str
    level_mix: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ExamDetail(ExamOut):
    questions: List[QuestionOut]


class RoomOut(BaseModel):
    id: int
    access_code: str
    is_active: bool
    expires_at: Optional[datetime]
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Response: AI Generated (trước khi lưu DB) ───────────────────────────────

class GeneratedOptionOut(BaseModel):
    letter: str
    content: str
    is_correct: bool


class GeneratedQuestionOut(BaseModel):
    number: int
    content: str
    level: str
    options: List[GeneratedOptionOut]


class ScoreWithStudentOut(BaseModel):
    id: int
    student_name: str
    student_class: Optional[str]
    student_code: Optional[str]
    student_email: Optional[str]
    score: float
    taken_at: datetime