from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

import app.features.students.repository as student_repo
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.features.students.schemas import ExamScoreOut, StudentOut, StudentWithHistoryOut
from app.models.user import User

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("", response_model=List[StudentOut])
def list_students(
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List students who have taken at least one exam by this teacher."""
    return student_repo.get_students_for_teacher(
        db, teacher_id=current_user.id, search=search, skip=skip, limit=limit
    )


@router.get("/count")
def count_students(
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = student_repo.count_students_for_teacher(db, teacher_id=current_user.id, search=search)
    return {"total": total}


@router.get("/{student_id}", response_model=StudentWithHistoryOut)
def get_student_with_history(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    student = student_repo.get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Học sinh không tồn tại")

    scores = student_repo.get_student_exam_history(db, student_id, teacher_id=current_user.id)
    history = [
        ExamScoreOut(
            score_id=sc.id,
            exam_id=sc.exam_id,
            exam_title=sc.exam.title if sc.exam else f"Đề #{sc.exam_id}",
            score=sc.score,
            taken_at=sc.taken_at,
        )
        for sc in scores
    ]
    return StudentWithHistoryOut(
        id=student.id,
        name=student.name,
        class_name=student.class_name,
        student_code=student.student_code,
        email=student.email,
        avatar=student.avatar,
        created_at=student.created_at,
        exam_history=history,
    )
