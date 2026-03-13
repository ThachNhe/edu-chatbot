from datetime import datetime, timedelta, timezone
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy import func, and_
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.lesson import Lesson
from app.models.exam import Exam
from app.models.student import Student
from app.models.score import Score
from app.models.conversation import Conversation, Message
from app.features.dashboard.schemas import (
    ActivityItem,
    DashboardSummary,
    ScheduleItem,
)

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

_WEEKDAY_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]


# ─── Helper ───────────────────────────────────────────────────────────────────

def _now_naive() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


# ─── Summary ─────────────────────────────────────────────────────────────────

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Count lessons created by this teacher
    lesson_count = (
        db.query(func.count(Lesson.id))
        .filter(Lesson.created_by == current_user.id)
        .scalar() or 0
    )

    # Count exams created by this teacher
    exam_count = (
        db.query(func.count(Exam.id))
        .filter(Exam.created_by == current_user.id)
        .scalar() or 0
    )

    # Count distinct students who took exams by this teacher
    exam_ids = (
        db.query(Exam.id)
        .filter(Exam.created_by == current_user.id)
        .subquery()
    )
    student_count = (
        db.query(func.count(func.distinct(Score.student_id)))
        .filter(Score.exam_id.in_(exam_ids))
        .scalar() or 0
    )

    # Count AI messages TODAY in this teacher's conversations (user side = questions to AI)
    today_start = _now_naive().replace(hour=0, minute=0, second=0, microsecond=0)
    conv_ids = (
        db.query(Conversation.id)
        .filter(Conversation.user_id == current_user.id)
        .subquery()
    )
    ai_query_count = (
        db.query(func.count(Message.id))
        .filter(
            and_(
                Message.conversation_id.in_(conv_ids),
                Message.role == "user",
                Message.created_at >= today_start,
            )
        )
        .scalar() or 0
    )

    # Pending = total AI messages with no subsequent AI reply (approximate: odd count in convs)
    # Simpler proxy: total user messages today without ai reply in same conversation
    # For now we count messages where role='user' sent in last 24h (teacher view)
    pending_questions = (
        db.query(func.count(Message.id))
        .filter(
            and_(
                Message.conversation_id.in_(conv_ids),
                Message.role == "user",
                Message.created_at >= _now_naive() - timedelta(days=1),
            )
        )
        .scalar() or 0
    )

    return DashboardSummary(
        user_name=current_user.name,
        lesson_count=lesson_count,
        lesson_goal=30,
        exam_count=exam_count,
        exam_goal=20,
        student_count=student_count,
        ai_query_count=ai_query_count,
        ai_query_goal=1000,
        pending_questions=pending_questions,
    )


# ─── Recent Activity ──────────────────────────────────────────────────────────

@router.get("/recent-activity", response_model=List[ActivityItem])
def get_recent_activity(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = _now_naive()
    activities: list[tuple[datetime, ActivityItem]] = []

    def _fmt_time(dt: datetime) -> str:
        delta = now - dt
        if delta.total_seconds() < 3600:
            mins = int(delta.total_seconds() / 60)
            return f"{max(mins, 1)} phút trước"
        if delta.days == 0:
            hours = int(delta.total_seconds() / 3600)
            return f"{hours} giờ trước"
        if delta.days == 1:
            return "Hôm qua"
        return f"{delta.days} ngày trước"

    # Exams recently created
    recent_exams = (
        db.query(Exam)
        .filter(Exam.created_by == current_user.id)
        .order_by(Exam.created_at.desc())
        .limit(3)
        .all()
    )
    for e in recent_exams:
        activities.append((
            e.created_at,
            ActivityItem(
                icon="📝",
                icon_bg="#eff6ff",
                title=e.title,
                meta=f"{_fmt_time(e.created_at)} • Đề thi • {e.status}",
            ),
        ))

    # Lessons recently created / published
    recent_lessons = (
        db.query(Lesson)
        .filter(Lesson.created_by == current_user.id)
        .order_by(Lesson.created_at.desc())
        .limit(3)
        .all()
    )
    for ls in recent_lessons:
        activities.append((
            ls.created_at,
            ActivityItem(
                icon="✅",
                icon_bg="#d1fae5",
                title=f"Soạn xong bài {ls.number}: {ls.name}",
                meta=f"{_fmt_time(ls.created_at)} • {ls.status}",
            ),
        ))

    # Recent scores submitted (students did exams)
    exam_ids_sub = (
        db.query(Exam.id)
        .filter(Exam.created_by == current_user.id)
        .subquery()
    )
    recent_scores = (
        db.query(Score)
        .filter(Score.exam_id.in_(exam_ids_sub))
        .order_by(Score.taken_at.desc())
        .limit(3)
        .all()
    )
    for sc in recent_scores:
        activities.append((
            sc.taken_at,
            ActivityItem(
                icon="📊",
                icon_bg="#ede9fe",
                title=f"Học sinh nộp bài • Điểm: {sc.score}",
                meta=f"{_fmt_time(sc.taken_at)} • Kết quả thi",
            ),
        ))

    # Sort by time desc, take top 8
    activities.sort(key=lambda x: x[0], reverse=True)
    return [item for _, item in activities[:8]]


# ─── Week Schedule ───────────────────────────────────────────────────────────

@router.get("/week-schedule", response_model=List[ScheduleItem])
def get_week_schedule(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    now = _now_naive()
    # Start of current week (Monday) and end (Sunday)
    week_start = now - timedelta(days=now.weekday())
    week_start = week_start.replace(hour=0, minute=0, second=0, microsecond=0)
    week_end = week_start + timedelta(days=7)

    # Fetch exams created this week (as schedule proxy)
    exams_this_week = (
        db.query(Exam)
        .filter(
            Exam.created_by == current_user.id,
            Exam.created_at >= week_start,
            Exam.created_at < week_end,
        )
        .order_by(Exam.created_at.asc())
        .limit(7)
        .all()
    )

    items: list[ScheduleItem] = []
    for e in exams_this_week:
        weekday_idx = e.created_at.weekday()  # 0=Mon ... 6=Sun
        day_label = _WEEKDAY_VI[weekday_idx]
        items.append(ScheduleItem(
            day=day_label,
            title=e.title[:50],
            desc=e.topic or "Kiểm tra",
        ))

    # If no exams this week, return empty list (frontend shows empty state)
    return items
