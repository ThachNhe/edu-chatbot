from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.student import Student
from app.models.user import User

def get_students(db: Session, skip: int = 0, limit: int = 100) -> List[Student]:
    return db.query(Student).order_by(Student.id.desc()).offset(skip).limit(limit).all()

def create_student(db: Session, name: str, class_name: Optional[str], student_code: Optional[str], email: Optional[str]) -> Student:
    student = Student(
        name=name,
        class_name=class_name,
        student_code=student_code,
        email=email
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student

def get_student_by_code(db: Session, student_code: str) -> Optional[Student]:
    return db.query(Student).filter(Student.student_code == student_code).first()

def get_instructors(db: Session, skip: int = 0, limit: int = 100) -> List[User]:
    return db.query(User).filter(User.role == "teacher").order_by(User.id.desc()).offset(skip).limit(limit).all()

def create_instructor(db: Session, name: str, email: str, password_hash: str) -> User:
    user = User(name=name, email=email, password=password_hash, role="teacher")
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()
