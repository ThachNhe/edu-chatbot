from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

import app.features.questions.repository as question_repo
import app.features.exams.service as exam_service
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.features.exams.schemas import GeneratedQuestionOut, OptionOut, QuestionOut
from app.features.questions.schemas import (
    CreateQuestionRequest,
    GenerateQuestionsRequest,
    QuestionBankItem,
    UpdateQuestionRequest,
)
from app.models.exam import ExamQuestion
from app.models.user import User
from app.utils.activity_logger import log_activity

router = APIRouter(tags=["Questions"])


# ─── AI Generate (trả về để review, chưa lưu DB) ─────────────────────────────

@router.post("/questions/generate", response_model=List[GeneratedQuestionOut])
async def generate_questions_for_bank(
    body: GenerateQuestionsRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        questions = await exam_service.generate_exam_questions(
            topic=body.topic,
            count=body.count,
            difficulty=body.difficulty,
        )
        return questions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi tạo câu hỏi bằng AI: {str(e)}",
        )


# ─── Question Bank: List (with filter) ────────────────────────────────────

@router.get("/questions", response_model=List[QuestionBankItem])
def list_questions(
    level: Optional[str] = Query(None, description="easy | med | hard"),
    lesson_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    questions = question_repo.list_questions(
        db,
        created_by=current_user.id,
        level=level,
        lesson_id=lesson_id,
        search=search,
        topic=topic,
        skip=skip,
        limit=limit,
    )
    result = []
    for q in questions:
        usage = question_repo.get_usage_count(db, q.id)
        lesson_name: Optional[str] = q.lesson.name if q.lesson else None
        options = [
            {"id": o.id, "letter": o.letter, "content": o.content, "is_correct": o.is_correct}
            for o in sorted(q.options, key=lambda x: x.letter)
        ]
        result.append(
            QuestionBankItem(
                id=q.id,
                content=q.content,
                level=q.level,
                topic=q.topic,
                lesson_id=q.lesson_id,
                lesson_name=lesson_name,
                usage_count=usage,
                created_at=q.created_at.isoformat(),
                options=options,
            )
        )
    return result


@router.get("/questions/count")
def count_questions(
    level: Optional[str] = Query(None),
    lesson_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    topic: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = question_repo.count_questions(
        db,
        created_by=current_user.id,
        level=level,
        lesson_id=lesson_id,
        search=search,
        topic=topic,
    )
    return {"total": total}


# ─── Question Bank: Create ────────────────────────────────────────────────

@router.post("/questions", response_model=QuestionBankItem, status_code=status.HTTP_201_CREATED)
def create_question(
    body: CreateQuestionRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    question = question_repo.create_question(
        db,
        content=body.content,
        level=body.level,
        created_by=current_user.id,
        lesson_id=body.lesson_id,
        topic=body.topic,
    )
    for opt in body.options:
        question_repo.create_option(db, question.id, opt.letter, opt.content, opt.is_correct)

    log_activity(
        db,
        user_id=current_user.id,
        user_name=current_user.name,
        action="create_question",
        target_type="question",
        target_id=question.id,
        detail=f"Tạo câu hỏi: {body.content[:60]}",
        ip_address=request.client.host if request.client else None,
    )
    db.commit()
    db.refresh(question)

    usage = question_repo.get_usage_count(db, question.id)
    lesson_name: Optional[str] = question.lesson.name if question.lesson else None
    options_out = [
        {"id": o.id, "letter": o.letter, "content": o.content, "is_correct": o.is_correct}
        for o in sorted(question.options, key=lambda x: x.letter)
    ]
    return QuestionBankItem(
        id=question.id,
        content=question.content,
        level=question.level,
        topic=question.topic,
        lesson_id=question.lesson_id,
        lesson_name=lesson_name,
        usage_count=usage,
        created_at=question.created_at.isoformat(),
        options=options_out,
    )


# ─── Question Bank: Delete ────────────────────────────────────────────────

@router.delete("/questions/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    question = question_repo.get_question(db, question_id)
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Câu hỏi không tồn tại")
    if question.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Không có quyền xóa câu hỏi này")

    log_activity(
        db,
        user_id=current_user.id,
        user_name=current_user.name,
        action="delete_question",
        target_type="question",
        target_id=question_id,
        detail=f"Xóa câu hỏi: {question.content[:60]}",
        ip_address=request.client.host if request.client else None,
    )
    question_repo.delete_question(db, question)
    db.commit()


# ─── Existing: Update question within exam ────────────────────────────────

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