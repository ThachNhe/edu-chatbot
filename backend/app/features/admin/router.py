from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import app.features.admin.repository as admin_repo
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.features.admin.schemas import (
    AdminStudentOut,
    AdminStudentCreate,
    StudentValidateRequest,
    StudentValidateResponse,
    AdminInstructorOut,
    AdminInstructorCreate,
)
from app.models.user import User
from app.utils.security import hash_password

router = APIRouter(prefix="/admin", tags=["Admin"])

# ─── Students ─────────────────────────────────────────────────────────────

@router.get("/students", response_model=List[AdminStudentOut])
def list_students(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Không có quyền truy cập.")
    return admin_repo.get_students(db, skip=skip, limit=limit)

@router.post("/students", response_model=AdminStudentOut, status_code=status.HTTP_201_CREATED)
def create_student(
    body: AdminStudentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Không có quyền truy cập.")
        
    if body.student_code:
        existing = admin_repo.get_student_by_code(db, body.student_code)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mã học sinh đã tồn tại."
            )
            
    student = admin_repo.create_student(
        db,
        name=body.name,
        class_name=body.class_name,
        student_code=body.student_code,
        email=body.email
    )
    return student

@router.post("/students/validate", response_model=StudentValidateResponse)
def validate_student(
    body: StudentValidateRequest,
    db: Session = Depends(get_db),
):
    student = admin_repo.get_student_by_code(db, body.student_code)
    if not student:
        return StudentValidateResponse(valid=False, student=None)
    
    return StudentValidateResponse(valid=True, student=AdminStudentOut.model_validate(student))

# ─── Instructors ──────────────────────────────────────────────────────────

@router.get("/instructors", response_model=List[AdminInstructorOut])
def list_instructors(
    skip: int = 0, limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Không có quyền truy cập.")
    return admin_repo.get_instructors(db, skip=skip, limit=limit)

@router.post("/instructors", response_model=AdminInstructorOut, status_code=status.HTTP_201_CREATED)
def create_instructor(
    body: AdminInstructorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != 'admin':
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Không có quyền truy cập.")
        
    existing = admin_repo.get_user_by_email(db, body.email.lower())
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email đã được sử dụng."
        )
    
    instructor = admin_repo.create_instructor(
        db,
        name=body.name,
        email=body.email.lower(),
        password_hash=hash_password(body.password)
    )
    return instructor
