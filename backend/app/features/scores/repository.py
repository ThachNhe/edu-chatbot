from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.score import Score
from app.models.student import Student


def create_student(
    db: Session,
    name: str,
    class_name: Optional[str],
    student_code: Optional[str] = None,
    email: Optional[str] = None,
) -> Student:
    student = Student(name=name, class_name=class_name, student_code=student_code, email=email)
    db.add(student)
    db.flush()
    return student


def create_score(db: Session, student_id: int, exam_id: int, score: float) -> Score:
    record = Score(student_id=student_id, exam_id=exam_id, score=score)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_scores_by_exam(db: Session, exam_id: int) -> List[Score]:
    return (
        db.query(Score)
        .filter(Score.exam_id == exam_id)
        .order_by(Score.taken_at.desc())
        .all()
    )


def get_scores_with_students(db: Session, exam_id: int) -> List[Score]:
    return (
        db.query(Score)
        .options(joinedload(Score.student))
        .filter(Score.exam_id == exam_id)
        .order_by(Score.taken_at.desc())
        .all()
    )