from typing import List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.exam import Exam
from app.models.score import Score
from app.models.student import Student


def get_students_for_teacher(
    db: Session,
    teacher_id: int,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
) -> List[Student]:
    """Return distinct students who have taken at least one exam created by this teacher."""
    exam_ids = db.query(Exam.id).filter(Exam.created_by == teacher_id).subquery()
    student_ids = (
        db.query(Score.student_id)
        .filter(Score.exam_id.in_(exam_ids))
        .distinct()
        .subquery()
    )
    q = db.query(Student).filter(Student.id.in_(student_ids))
    if search:
        q = q.filter(Student.name.ilike(f"%{search}%"))
    return q.order_by(Student.name).offset(skip).limit(limit).all()


def count_students_for_teacher(
    db: Session,
    teacher_id: int,
    search: Optional[str] = None,
) -> int:
    exam_ids = db.query(Exam.id).filter(Exam.created_by == teacher_id).subquery()
    student_ids = (
        db.query(Score.student_id)
        .filter(Score.exam_id.in_(exam_ids))
        .distinct()
        .subquery()
    )
    q = db.query(func.count(Student.id)).filter(Student.id.in_(student_ids))
    if search:
        q = q.filter(Student.name.ilike(f"%{search}%"))
    return q.scalar() or 0


def get_student_by_id(db: Session, student_id: int) -> Optional[Student]:
    return db.query(Student).filter(Student.id == student_id).first()


def get_student_exam_history(db: Session, student_id: int, teacher_id: int):
    """Return scores (with exam) for a student across exams made by this teacher."""
    teacher_exam_ids = db.query(Exam.id).filter(Exam.created_by == teacher_id).subquery()
    scores = (
        db.query(Score)
        .filter(Score.student_id == student_id, Score.exam_id.in_(teacher_exam_ids))
        .order_by(Score.taken_at.desc())
        .all()
    )
    return scores
