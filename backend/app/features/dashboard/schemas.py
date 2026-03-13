from typing import List, Optional
from pydantic import BaseModel


# ─── Dashboard Summary ───────────────────────────────────────────────────────

class DashboardSummary(BaseModel):
    user_name: str
    lesson_count: int
    lesson_goal: int
    exam_count: int
    exam_goal: int
    student_count: int
    ai_query_count: int
    ai_query_goal: int
    pending_questions: int


# ─── Recent Activity ─────────────────────────────────────────────────────────

class ActivityItem(BaseModel):
    icon: str
    icon_bg: str
    title: str
    meta: str


# ─── Week Schedule ───────────────────────────────────────────────────────────

class ScheduleItem(BaseModel):
    day: str         # e.g. "T2", "T4"
    title: str       # e.g. "Lớp 12A1 – Tiết 3,4"
    desc: str        # topic / lesson name
