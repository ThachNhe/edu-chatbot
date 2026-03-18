from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session


import app.features.exams.repository as exam_repo
import app.features.exams.service as exam_service
import app.features.scores.repository as score_repo
import app.features.questions.repository as question_repo
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.features.exams.schemas import (
    CreateExamRequest,
    CreateRoomRequest,
    ExamDetail,
    ExamOut,
    GenerateExamRequest,
    GeneratedQuestionOut,
    OptionOut,
    QuestionOut,
    RoomOut,
)
from app.models.exam import ExamQuestion
from app.models.user import User
from app.features.scores.schemas import ScoreWithStudentOut

router = APIRouter(prefix="/exams", tags=["Exams"])


# ─── Helper ───────────────────────────────────────────────────────────────────

def _to_exam_detail(exam) -> ExamDetail:
    questions = []
    for eq in sorted(exam.exam_questions, key=lambda x: x.order_num):
        q = eq.question
        options = [
            OptionOut(id=o.id, letter=o.letter, content=o.content, is_correct=o.is_correct)
            for o in sorted(q.options, key=lambda x: x.letter)
        ]
        questions.append(
            QuestionOut(id=q.id, content=q.content, level=q.level, options=options)
        )
    return ExamDetail(
        id=exam.id,
        title=exam.title,
        topic=exam.topic,
        duration=exam.duration,
        level_mix=exam.level_mix,
        status=exam.status,
        created_at=exam.created_at,
        questions=questions,
    )


# ─── Generate (AI, chưa lưu DB) ──────────────────────────────────────────────

@router.post("/generate", response_model=List[GeneratedQuestionOut])
async def generate_exam(
    body: GenerateExamRequest,
    current_user: User = Depends(get_current_user),
):
    print("body: \n", body)
    try:
        questions = await exam_service.generate_exam_questions(
            topic=body.topic,
            count=body.question_count,
            difficulty=body.difficulty,
        )
        return questions
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi tạo đề bằng AI: {str(e)}",
        )


# ─── Create ───────────────────────────────────────────────────────────────────

@router.post("", response_model=ExamDetail, status_code=status.HTTP_201_CREATED)
def create_exam(
    body: CreateExamRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = exam_repo.create_exam(
        db=db,
        title=body.title,
        topic=body.topic,
        duration=body.duration,
        level_mix=body.level_mix,
        status=body.status,
        created_by=current_user.id,
    )

    for order, q_in in enumerate(body.questions, start=1):
        question = question_repo.create_question(
            db=db,
            content=q_in.content,
            level=q_in.level,
            created_by=current_user.id,
        )
        for opt_in in q_in.options:
            question_repo.create_option(
                db=db,
                question_id=question.id,
                letter=opt_in.letter,
                content=opt_in.content,
                is_correct=opt_in.is_correct,
            )
        db.add(ExamQuestion(exam_id=exam.id, question_id=question.id, order_num=order))

    db.commit()

    exam_with_qs = exam_repo.get_exam_with_questions(db, exam.id, current_user.id)
    return _to_exam_detail(exam_with_qs)


# ─── List ─────────────────────────────────────────────────────────────────────

@router.get("", response_model=List[ExamOut])
def list_exams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return exam_repo.get_exams(db, current_user.id)


# ─── Detail ───────────────────────────────────────────────────────────────────

@router.get("/{exam_id}", response_model=ExamDetail)
def get_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = exam_repo.get_exam_with_questions(db, exam_id, current_user.id)
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Đề thi không tồn tại",
        )
    return _to_exam_detail(exam)


# ─── Delete ───────────────────────────────────────────────────────────────────

@router.delete("/{exam_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_exam(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = exam_repo.get_exam(db, exam_id, current_user.id)
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Đề thi không tồn tại",
        )
    exam_repo.delete_exam(db, exam)


# ─── Rooms ────────────────────────────────────────────────────────────────────

@router.post("/{exam_id}/rooms", response_model=RoomOut, status_code=status.HTTP_201_CREATED)
def create_room(
    exam_id: int,
    body: CreateRoomRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = exam_repo.get_exam(db, exam_id, current_user.id)
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Đề thi không tồn tại",
        )
    return exam_repo.create_room(db, exam_id=exam_id, expires_at=body.expires_at)


@router.get("/{exam_id}/rooms", response_model=List[RoomOut])
def list_rooms(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = exam_repo.get_exam(db, exam_id, current_user.id)
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Đề thi không tồn tại",
        )
    return exam_repo.get_rooms_by_exam(db, exam_id)


@router.patch("/{exam_id}/rooms/{room_id}/toggle", response_model=RoomOut)
def toggle_room(
    exam_id: int,
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    room = exam_repo.toggle_room(db, exam_id, room_id, current_user.id)
    if not room:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Phòng thi không tồn tại",
        )
    return room


# ─── Thống kê điểm ────────────────────────────────────────────────────────────

@router.get("/{exam_id}/scores", response_model=List[ScoreWithStudentOut])
def get_exam_scores(
    exam_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    exam = exam_repo.get_exam(db, exam_id, current_user.id)
    if not exam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Đề thi không tồn tại",
        )
    scores = score_repo.get_scores_with_students(db, exam_id)
    return [
        ScoreWithStudentOut(
            id=s.id,
            student_name=s.student.name,
            student_class=s.student.class_name,
            student_code=s.student.student_code,
            student_email=s.student.email,
            score=s.score,
            taken_at=s.taken_at,
        )
        for s in scores
    ]