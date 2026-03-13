from typing import List, Optional
from pydantic import BaseModel


# ─── Stats Overview ──────────────────────────────────────────────────────────

class StatsOverview(BaseModel):
    avg_score: float            # điểm TB toàn bộ
    pass_rate: float            # % đạt >= 5
    need_support_count: int     # học sinh cần hỗ trợ (avg < 5)
    total_students: int


# ─── Chapter Scores ──────────────────────────────────────────────────────────

class ChapterScore(BaseModel):
    label: str      # "Chương 1", "Chương 2", ...
    avg: float      # avg score (0–10)
    pct: int        # percentage of max (avg / 10 * 100)


# ─── Student Distribution ────────────────────────────────────────────────────

class DistributionBand(BaseModel):
    label: str      # "Giỏi (≥8): 35%"
    color: str
    count: int
    pct: float


# ─── Student Ranking ─────────────────────────────────────────────────────────

class ExamScoreItem(BaseModel):
    exam_title: str
    score: float


class StudentRankItem(BaseModel):
    student_id: int
    name: str
    class_name: Optional[str]
    avatar: str                 # first char of name
    scores: List[ExamScoreItem]
    avg_score: float
