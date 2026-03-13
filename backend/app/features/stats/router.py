from typing import List, Optional
from collections import defaultdict

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.exam import Exam
from app.models.score import Score
from app.models.student import Student
from app.features.stats.schemas import (
    ChapterScore,
    DistributionBand,
    ExamScoreItem,
    StatsOverview,
    StudentRankItem,
)

router = APIRouter(prefix="/stats", tags=["Stats"])


# ─── Helper ───────────────────────────────────────────────────────────────────

def _get_exam_ids(db: Session, user_id: int):
    return [
        row.id
        for row in db.query(Exam.id).filter(Exam.created_by == user_id).all()
    ]


# ─── Overview ────────────────────────────────────────────────────────────────

@router.get("/overview", response_model=StatsOverview)
def get_stats_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam_ids = _get_exam_ids(db, current_user.id)
    if not exam_ids:
        return StatsOverview(
            avg_score=0.0,
            pass_rate=0.0,
            need_support_count=0,
            total_students=0,
        )

    # All scores for this teacher's exams
    scores = (
        db.query(Score)
        .filter(Score.exam_id.in_(exam_ids))
        .all()
    )

    if not scores:
        return StatsOverview(
            avg_score=0.0,
            pass_rate=0.0,
            need_support_count=0,
            total_students=0,
        )

    # Compute per-student avg
    student_totals: dict[int, list[float]] = defaultdict(list)
    for s in scores:
        student_totals[s.student_id].append(s.score)

    student_avgs = {sid: sum(vals) / len(vals) for sid, vals in student_totals.items()}
    total_students = len(student_avgs)

    avg_score = round(sum(student_avgs.values()) / total_students, 1)
    pass_rate = round(
        sum(1 for v in student_avgs.values() if v >= 5) / total_students * 100, 1
    )
    need_support_count = sum(1 for v in student_avgs.values() if v < 5)

    return StatsOverview(
        avg_score=avg_score,
        pass_rate=pass_rate,
        need_support_count=need_support_count,
        total_students=total_students,
    )


# ─── Chapter Scores ───────────────────────────────────────────────────────────

@router.get("/chapter-scores", response_model=List[ChapterScore])
def get_chapter_scores(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Group exams by topic (used as chapter proxy) and compute avg score
    exam_ids = _get_exam_ids(db, current_user.id)
    if not exam_ids:
        return []

    # Load exams with their topics
    exams = (
        db.query(Exam)
        .filter(Exam.id.in_(exam_ids))
        .all()
    )

    # Map exam_id → topic
    exam_topic_map = {e.id: (e.topic or "Chung") for e in exams}

    # Load all scores
    scores = db.query(Score).filter(Score.exam_id.in_(exam_ids)).all()
    if not scores:
        return []

    # Group scores by topic
    topic_scores: dict[str, list[float]] = defaultdict(list)
    for sc in scores:
        topic = exam_topic_map.get(sc.exam_id, "Chung")
        topic_scores[topic].append(sc.score)

    # Build response — sort by avg desc
    results: list[ChapterScore] = []
    for topic, vals in sorted(topic_scores.items()):
        avg = round(sum(vals) / len(vals), 1)
        results.append(ChapterScore(
            label=topic,
            avg=avg,
            pct=min(int(avg / 10 * 100), 100),
        ))

    results.sort(key=lambda x: x.avg, reverse=True)
    return results[:10]  # max 10 chapters


# ─── Student Distribution ─────────────────────────────────────────────────────

@router.get("/student-distribution", response_model=List[DistributionBand])
def get_student_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam_ids = _get_exam_ids(db, current_user.id)
    if not exam_ids:
        return []

    scores = db.query(Score).filter(Score.exam_id.in_(exam_ids)).all()
    if not scores:
        return []

    # Per-student avg
    student_totals: dict[int, list[float]] = defaultdict(list)
    for s in scores:
        student_totals[s.student_id].append(s.score)
    student_avgs = [sum(v) / len(v) for v in student_totals.values()]
    total = len(student_avgs)

    bands = [
        ("Giỏi (≥8)", "#10b981", lambda v: v >= 8),
        ("Khá (6.5–8)", "#1a56db", lambda v: 6.5 <= v < 8),
        ("TB (5–6.5)", "#f59e0b", lambda v: 5 <= v < 6.5),
        ("Yếu (<5)", "#ef4444", lambda v: v < 5),
    ]

    result: list[DistributionBand] = []
    for label, color, pred in bands:
        count = sum(1 for v in student_avgs if pred(v))
        pct = round(count / total * 100, 1) if total > 0 else 0.0
        result.append(DistributionBand(
            label=f"{label}: {pct}%",
            color=color,
            count=count,
            pct=pct,
        ))
    return result


# ─── Student Ranking ──────────────────────────────────────────────────────────

@router.get("/student-ranking", response_model=List[StudentRankItem])
def get_student_ranking(
    class_name: Optional[str] = Query(None, description="Lọc theo lớp"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam_ids = _get_exam_ids(db, current_user.id)
    if not exam_ids:
        return []

    scores = (
        db.query(Score)
        .options(joinedload(Score.student), joinedload(Score.exam))
        .filter(Score.exam_id.in_(exam_ids))
        .all()
    )
    if not scores:
        return []

    # Group by student
    student_data: dict[int, dict] = {}
    for sc in scores:
        sid = sc.student_id
        if sc.student.class_name and class_name and sc.student.class_name != class_name:
            continue
        if sid not in student_data:
            student_data[sid] = {
                "student": sc.student,
                "scores": [],
            }
        student_data[sid]["scores"].append(sc)

    result: list[StudentRankItem] = []
    for sid, data in student_data.items():
        student = data["student"]
        exam_scores = [
            ExamScoreItem(exam_title=sc.exam.title[:20], score=sc.score)
            for sc in data["scores"]
        ]
        avg = round(sum(es.score for es in exam_scores) / len(exam_scores), 1)
        result.append(StudentRankItem(
            student_id=sid,
            name=student.name,
            class_name=student.class_name,
            avatar=student.name[0].upper() if student.name else "?",
            scores=exam_scores,
            avg_score=avg,
        ))

    result.sort(key=lambda x: x.avg_score, reverse=True)
    return result
