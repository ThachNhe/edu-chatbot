from datetime import datetime, timedelta, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

import app.features.admin.repository as admin_repo
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.features.admin.schemas import (
    AdminInstructorCreate,
    AdminInstructorOut,
    AdminStudentCreate,
    AdminStudentOut,
    StudentValidateRequest,
    StudentValidateResponse,
)
from app.models.exam import Exam
from app.models.question import Question
from app.models.score import Score
from app.models.student import Student
from app.models.user import User
from app.utils.security import hash_password
from send_mail import send_teacher_credentials_email

router = APIRouter(prefix="/admin", tags=["Admin"])


def _require_admin(current_user: User) -> None:
    if current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Không có quyền truy cập.")


# ─── Students ─────────────────────────────────────────────────────────────

@router.get("/students", response_model=List[AdminStudentOut])
def list_students(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    return admin_repo.get_students(db, skip=skip, limit=limit)

@router.post("/students", response_model=AdminStudentOut, status_code=status.HTTP_201_CREATED)
def create_student(
    body: AdminStudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    if body.student_code:
        existing = admin_repo.get_student_by_code(db, body.student_code)
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Mã học sinh đã tồn tại.")
    student = admin_repo.create_student(
        db, name=body.name, class_name=body.class_name, student_code=body.student_code, email=body.email
    )
    return student

@router.post("/students/validate", response_model=StudentValidateResponse)
def validate_student(body: StudentValidateRequest, db: Session = Depends(get_db)):
    student = admin_repo.get_student_by_code(db, body.student_code)
    if not student:
        return StudentValidateResponse(valid=False, student=None)
    return StudentValidateResponse(valid=True, student=AdminStudentOut.model_validate(student))

@router.post("/students/{student_id}/toggle-lock")
def toggle_student_lock(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise HTTPException(404, "Học sinh không tồn tại")
    student.is_active = not student.is_active
    db.commit()
    return {"message": "Success", "is_active": student.is_active}

# ─── Instructors ──────────────────────────────────────────────────────────

@router.get("/instructors", response_model=List[AdminInstructorOut])
def list_instructors(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    return admin_repo.get_instructors(db, skip=skip, limit=limit)

@router.post("/instructors", response_model=AdminInstructorOut, status_code=status.HTTP_201_CREATED)
def create_instructor(
    body: AdminInstructorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    existing = admin_repo.get_user_by_email(db, body.email.lower())
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email đã được sử dụng.")
    instructor = User(
        name=body.name,
        email=body.email.lower(),
        password=hash_password(body.password),
        role="teacher",
    )
    db.add(instructor)
    try:
        db.flush()
        send_teacher_credentials_email(
            teacher_name=instructor.name,
            recipient_email=instructor.email,
            password=body.password,
        )
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Không thể gửi email tài khoản giáo viên. Vui lòng kiểm tra MailHog/SMTP và thử lại.",
        )
    db.refresh(instructor)
    return instructor

@router.post("/instructors/{instructor_id}/toggle-lock")
def toggle_instructor_lock(
    instructor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    instructor = db.query(User).filter(User.id == instructor_id, User.role == "teacher").first()
    if not instructor:
        raise HTTPException(404, "Giáo viên không tồn tại")
    instructor.is_active = not instructor.is_active
    db.commit()
    return {"message": "Success", "is_active": instructor.is_active}

# ─── Statistics ───────────────────────────────────────────────────────────

@router.get("/stats")
def get_admin_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _require_admin(current_user)
    total_students = db.query(Student).count()
    total_teachers = db.query(User).filter(User.role == "teacher").count()
    total_exams = db.query(Exam).count()
    total_questions = db.query(Question).count()
    return {
        "total_students": total_students,
        "total_teachers": total_teachers,
        "total_exams": total_exams,
        "total_questions": total_questions,
    }


@router.get("/stats/trends")
def get_admin_trends(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return daily exam count and student submission count for the last N days."""
    _require_admin(current_user)
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    result = []
    for i in range(days - 1, -1, -1):
        day_start = (now - timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)
        exams = (
            db.query(func.count(Exam.id))
            .filter(Exam.created_at >= day_start, Exam.created_at < day_end)
            .scalar() or 0
        )
        submissions = (
            db.query(func.count(Score.id))
            .filter(Score.taken_at >= day_start, Score.taken_at < day_end)
            .scalar() or 0
        )
        result.append({
            "date": day_start.strftime("%d/%m"),
            "exams": exams,
            "submissions": submissions,
        })
    return result


@router.get("/stats/top-teachers")
def get_top_teachers(
    limit: int = 5,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Return top teachers ordered by number of exams created."""
    _require_admin(current_user)
    rows = (
        db.query(User.id, User.name, func.count(Exam.id).label("exam_count"))
        .outerjoin(Exam, Exam.created_by == User.id)
        .filter(User.role == "teacher")
        .group_by(User.id, User.name)
        .order_by(func.count(Exam.id).desc())
        .limit(limit)
        .all()
    )
    result = []
    for row in rows:
        # count distinct students
        teacher_exam_ids = db.query(Exam.id).filter(Exam.created_by == row.id).subquery()
        student_count = (
            db.query(func.count(func.distinct(Score.student_id)))
            .filter(Score.exam_id.in_(teacher_exam_ids))
            .scalar() or 0
        )
        question_count = (
            db.query(func.count(Question.id))
            .filter(Question.created_by == row.id)
            .scalar() or 0
        )
        result.append({
            "id": row.id,
            "name": row.name,
            "exam_count": row.exam_count,
            "student_count": student_count,
            "question_count": question_count,
        })
    return result

