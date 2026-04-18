from typing import List, Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.exam import ExamQuestion
from app.models.question import Question, QuestionOption


def list_questions(
    db: Session,
    *,
    created_by: int,
    level: Optional[str] = None,
    lesson_id: Optional[int] = None,
    search: Optional[str] = None,
    topic: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[Question]:
    q = db.query(Question).filter(Question.created_by == created_by)
    if level:
        q = q.filter(Question.level == level)
    if lesson_id:
        q = q.filter(Question.lesson_id == lesson_id)
    if search:
        q = q.filter(Question.content.ilike(f"%{search}%"))
    if topic:
        q = q.filter(Question.topic == topic)
    return q.order_by(Question.created_at.desc()).offset(skip).limit(limit).all()


def count_questions(
    db: Session,
    *,
    created_by: int,
    level: Optional[str] = None,
    lesson_id: Optional[int] = None,
    search: Optional[str] = None,
    topic: Optional[str] = None,
) -> int:
    q = db.query(func.count(Question.id)).filter(Question.created_by == created_by)
    if level:
        q = q.filter(Question.level == level)
    if lesson_id:
        q = q.filter(Question.lesson_id == lesson_id)
    if search:
        q = q.filter(Question.content.ilike(f"%{search}%"))
    if topic:
        q = q.filter(Question.topic == topic)
    return q.scalar() or 0


def get_usage_count(db: Session, question_id: int) -> int:
    return db.query(func.count(ExamQuestion.id)).filter(ExamQuestion.question_id == question_id).scalar() or 0


def delete_question(db: Session, question: Question) -> None:
    db.delete(question)
    db.flush()


def create_question(
    db: Session,
    content: str,
    level: str,
    created_by: int,
    lesson_id: Optional[int] = None,
    topic: Optional[str] = None,
) -> Question:
    question = Question(content=content, level=level, created_by=created_by, lesson_id=lesson_id, topic=topic)
    db.add(question)
    db.flush()
    return question


def create_option(
    db: Session,
    question_id: int,
    letter: str,
    content: str,
    is_correct: bool,
) -> QuestionOption:
    opt = QuestionOption(
        question_id=question_id,
        letter=letter,
        content=content,
        is_correct=is_correct,
    )
    db.add(opt)
    db.flush()
    return opt


def get_question(db: Session, question_id: int) -> Optional[Question]:
    return db.query(Question).filter(Question.id == question_id).first()


def update_question(
    db: Session,
    question: Question,
    content: Optional[str],
    level: Optional[str],
) -> Question:
    if content is not None:
        question.content = content
    if level is not None:
        question.level = level
    db.flush()
    return question


def update_option(
    db: Session,
    option_id: int,
    content: str,
    is_correct: bool,
) -> Optional[QuestionOption]:
    opt = db.query(QuestionOption).filter(QuestionOption.id == option_id).first()
    if opt:
        opt.content = content
        opt.is_correct = is_correct
        db.flush()
    return opt