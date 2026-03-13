from typing import Optional

from sqlalchemy.orm import Session

from app.models.question import Question, QuestionOption


def create_question(
    db: Session,
    content: str,
    level: str,
    created_by: int,
    lesson_id: Optional[int] = None,
) -> Question:
    question = Question(content=content, level=level, created_by=created_by, lesson_id=lesson_id)
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