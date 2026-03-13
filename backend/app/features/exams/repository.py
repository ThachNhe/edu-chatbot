from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

from app.models.exam import Exam, ExamQuestion, ExamRoom
from app.models.question import Question


def create_exam(
    db: Session,
    title: str,
    topic: Optional[str],
    duration: str,
    level_mix: str,
    status: str,
    created_by: int,
) -> Exam:
    exam = Exam(
        title=title,
        topic=topic,
        duration=duration,
        level_mix=level_mix,
        status=status,
        created_by=created_by,
    )
    db.add(exam)
    db.flush()
    return exam


def get_exams(db: Session, user_id: int) -> List[Exam]:
    return (
        db.query(Exam)
        .filter(Exam.created_by == user_id)
        .order_by(Exam.created_at.desc())
        .all()
    )


def get_exam(db: Session, exam_id: int, user_id: int) -> Optional[Exam]:
    return (
        db.query(Exam)
        .filter(Exam.id == exam_id, Exam.created_by == user_id)
        .first()
    )


def get_exam_with_questions(db: Session, exam_id: int, user_id: int) -> Optional[Exam]:
    return (
        db.query(Exam)
        .options(
            joinedload(Exam.exam_questions)
            .joinedload(ExamQuestion.question)
            .joinedload(Question.options)
        )
        .filter(Exam.id == exam_id, Exam.created_by == user_id)
        .first()
    )


def get_exam_with_questions_public(db: Session, exam_id: int) -> Optional[Exam]:
    return (
        db.query(Exam)
        .options(
            joinedload(Exam.exam_questions)
            .joinedload(ExamQuestion.question)
            .joinedload(Question.options)
        )
        .filter(Exam.id == exam_id)
        .first()
    )


def delete_exam(db: Session, exam: Exam) -> None:
    db.delete(exam)
    db.commit()


def create_room(
    db: Session,
    exam_id: int,
    expires_at: Optional[datetime],
) -> ExamRoom:
    room = ExamRoom(exam_id=exam_id, expires_at=expires_at)
    db.add(room)
    db.commit()
    db.refresh(room)
    return room


def get_room_by_code(db: Session, access_code: str) -> Optional[ExamRoom]:
    return (
        db.query(ExamRoom)
        .filter(ExamRoom.access_code == access_code, ExamRoom.is_active == True)
        .first()
    )


def get_rooms_by_exam(db: Session, exam_id: int) -> List[ExamRoom]:
    return (
        db.query(ExamRoom)
        .filter(ExamRoom.exam_id == exam_id)
        .order_by(ExamRoom.created_at.desc())
        .all()
    )


def toggle_room(db: Session, exam_id: int, room_id: int, user_id: int):
    """Toggle is_active của room — chỉ chủ sở hữu đề thi mới được toggle."""
    room = (
        db.query(ExamRoom)
        .join(Exam, ExamRoom.exam_id == Exam.id)
        .filter(
            ExamRoom.id == room_id,
            ExamRoom.exam_id == exam_id,
            Exam.created_by == user_id,
        )
        .first()
    )
    if not room:
        return None
    room.is_active = not room.is_active
    db.commit()
    db.refresh(room)
    return room