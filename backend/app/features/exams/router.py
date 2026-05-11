from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session


import app.features.exams.repository as exam_repo
import app.features.exams.service as exam_service
import app.features.scores.repository as score_repo
import app.features.questions.repository as question_repo
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.features.exams.schemas import (
    CreateExamFromBankRequest,
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
from app.models.question import Question
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


# ─── Generate from File (AI, tạo và lưu DB) ──────────────────────────────────

@router.post("/generate-from-file", response_model=ExamDetail, status_code=status.HTTP_201_CREATED)
async def generate_exam_from_file(
    file: UploadFile = File(...),
    title: str = Form(...),
    question_count: int = Form(10),
    difficulty: str = Form("mixed"),
    duration: str = Form("45"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Upload một file tài liệu và tạo đề thi từ nội dung đó bằng AI."""
    allowed_types = {
        "text/plain",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
    }
    content_type = file.content_type or ""
    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if content_type not in allowed_types and ext not in ("txt", "pdf", "doc", "docx"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chỉ hỗ trợ file .txt, .pdf, .docx",
        )

    if question_count < 1 or question_count > 40:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Số câu hỏi phải từ 1 đến 40",
        )

    if difficulty not in ("easy", "med", "hard", "mixed"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mức độ không hợp lệ",
        )

    try:
        file_bytes = await file.read()
        text_content = exam_service._extract_text_from_bytes(filename, file_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Không thể đọc nội dung file: {str(e)}",
        )

    if not text_content.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="File không có nội dung văn bản",
        )

    try:
        generated = await exam_service.generate_exam_questions_from_content(
            content=text_content,
            count=question_count,
            difficulty=difficulty,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi AI sinh câu hỏi: {str(e)}",
        )

    # Lưu đề thi vào DB
    exam = exam_repo.create_exam(
        db=db,
        title=title,
        topic=filename,
        duration=duration,
        level_mix=difficulty,
        status="draft",
        created_by=current_user.id,
    )

    for order, q_data in enumerate(generated, start=1):
        question = question_repo.create_question(
            db=db,
            content=q_data["content"],
            level=q_data.get("level", "med"),
            created_by=current_user.id,
        )
        for opt in q_data.get("options", []):
            question_repo.create_option(
                db=db,
                question_id=question.id,
                letter=opt["letter"],
                content=opt["content"],
                is_correct=opt.get("is_correct", False),
            )
        db.add(ExamQuestion(exam_id=exam.id, question_id=question.id, order_num=order))

    db.commit()

    exam = exam_repo.get_exam_with_questions(db, exam.id, current_user.id)
    return _to_exam_detail(exam)


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

# ─── Create from Bank ────────────────────────────────────────────────────────

@router.post("/from-bank", response_model=ExamDetail, status_code=status.HTTP_201_CREATED)
def create_exam_from_bank(
    body: CreateExamFromBankRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not body.question_ids:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Phải chọn ít nhất một câu hỏi",
        )

    existing = db.query(Question.id).filter(Question.id.in_(body.question_ids)).all()
    if len(existing) != len(body.question_ids):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Một số câu hỏi không tồn tại trong ngân hàng",
        )

    exam = exam_repo.create_exam(
        db=db,
        title=body.title,
        topic=body.topic,
        duration=body.duration,
        level_mix=body.level_mix,
        status=body.status,
        created_by=current_user.id,
    )

    for order, qid in enumerate(body.question_ids, start=1):
        db.add(ExamQuestion(exam_id=exam.id, question_id=qid, order_num=order))

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


# ─── Publish ──────────────────────────────────────────────────────────────────

@router.patch("/{exam_id}/publish", response_model=ExamOut)
def publish_exam(
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
    exam.status = "published"
    db.commit()
    db.refresh(exam)
    return exam


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