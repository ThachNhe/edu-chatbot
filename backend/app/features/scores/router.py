from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

import app.features.exams.repository as exam_repo
import app.features.scores.repository as score_repo
from app.database import get_db
from app.features.scores.schemas import SubmitExamRequest, SubmitResult
from app.models.exam import Exam, ExamQuestion
from app.models.question import Question

router = APIRouter(prefix="/rooms", tags=["Rooms"])


def _check_room_valid(room) -> None:
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phòng thi không tồn tại hoặc đã đóng",
        )
    if room.expires_at:
        # So sánh naive datetime (DB lưu không có tzinfo)
        now = datetime.now(timezone.utc).replace(tzinfo=None)
        if room.expires_at < now:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="Phòng thi đã hết hạn",
            )


def _exam_to_student_view(exam: Exam) -> Dict[str, Any]:
    """Trả về đề thi cho học sinh — ẩn đáp án đúng."""
    questions = []
    for eq in sorted(exam.exam_questions, key=lambda x: x.order_num):
        q = eq.question
        options = [
            {"id": o.id, "letter": o.letter, "content": o.content}
            for o in sorted(q.options, key=lambda x: x.letter)
        ]
        questions.append(
            {"id": q.id, "content": q.content, "level": q.level, "options": options}
        )
    return {
        "id": exam.id,
        "title": exam.title,
        "topic": exam.topic,
        "duration": exam.duration,
        "questions": questions,
    }


# ─── Học sinh lấy đề thi ─────────────────────────────────────────────────────

@router.get("/{access_code}")
def get_room_exam(access_code: str, db: Session = Depends(get_db)):
    room = exam_repo.get_room_by_code(db, access_code)
    _check_room_valid(room)

    exam = (
        db.query(Exam)
        .options(
            joinedload(Exam.exam_questions)
            .joinedload(ExamQuestion.question)
            .joinedload(Question.options)
        )
        .filter(Exam.id == room.exam_id)
        .first()
    )
    return _exam_to_student_view(exam)


# ─── Học sinh nộp bài ─────────────────────────────────────────────────────────

@router.post("/{access_code}/submit", response_model=SubmitResult)
def submit_exam(
    access_code: str,
    body: SubmitExamRequest,
    db: Session = Depends(get_db),
):
    room = exam_repo.get_room_by_code(db, access_code)
    _check_room_valid(room)

    # Load exam với answers để tính điểm
    exam = (
        db.query(Exam)
        .options(
            joinedload(Exam.exam_questions)
            .joinedload(ExamQuestion.question)
            .joinedload(Question.options)
        )
        .filter(Exam.id == room.exam_id)
        .first()
    )

    # Map {question_id: correct_letter}
    correct_map: dict[int, str] = {}
    for eq in exam.exam_questions:
        for opt in eq.question.options:
            if opt.is_correct:
                correct_map[eq.question.id] = opt.letter
                break

    correct_count = sum(
        1
        for a in body.answers
        if correct_map.get(a.question_id) == a.selected_letter
    )
    total = len(correct_map)
    score_value = round((correct_count / total) * 10, 2) if total > 0 else 0.0

    from app.models.student import Student
    student = None
    if body.student_code:
        student = db.query(Student).filter(Student.student_code == body.student_code).first()
        
    if not student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mã học sinh không hợp lệ hoặc không tồn tại trong hệ thống."
        )
    score_repo.create_score(db, student.id, room.exam_id, score_value)

    return SubmitResult(
        score=score_value,
        total=total,
        correct=correct_count,
        student_id=student.id,
    )