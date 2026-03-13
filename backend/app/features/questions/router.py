from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import app.features.questions.repository as question_repo
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.features.exams.schemas import OptionOut, QuestionOut
from app.features.questions.schemas import UpdateQuestionRequest
from app.models.exam import ExamQuestion
from app.models.user import User

router = APIRouter(tags=["Questions"])


@router.patch("/exams/{exam_id}/questions/{question_id}", response_model=QuestionOut)
def update_question(
    exam_id: int,
    question_id: int,
    body: UpdateQuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Verify câu hỏi thuộc đề thi
    link = (
        db.query(ExamQuestion)
        .filter(
            ExamQuestion.exam_id == exam_id,
            ExamQuestion.question_id == question_id,
        )
        .first()
    )
    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Câu hỏi không tồn tại trong đề thi",
        )

    question = question_repo.get_question(db, question_id)
    question_repo.update_question(db, question, body.content, body.level)

    if body.options:
        for opt_in in body.options:
            question_repo.update_option(db, opt_in.id, opt_in.content, opt_in.is_correct)

    db.commit()
    db.refresh(question)

    options = [
        OptionOut(id=o.id, letter=o.letter, content=o.content, is_correct=o.is_correct)
        for o in sorted(question.options, key=lambda x: x.letter)
    ]
    return QuestionOut(id=question.id, content=question.content, level=question.level, options=options)