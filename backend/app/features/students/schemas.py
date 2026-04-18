from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class StudentOut(BaseModel):
    id: int
    name: str
    class_name: Optional[str] = None
    student_code: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ExamScoreOut(BaseModel):
    score_id: int
    exam_id: int
    exam_title: str
    score: float
    taken_at: datetime


class StudentWithHistoryOut(StudentOut):
    exam_history: List[ExamScoreOut] = []
