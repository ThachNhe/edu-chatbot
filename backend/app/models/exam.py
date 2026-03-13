import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Exam(Base):
    __tablename__ = "exams"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    topic: Mapped[str | None] = mapped_column(String(200))
    duration: Mapped[str] = mapped_column(String(10), nullable=False)
    level_mix: Mapped[str] = mapped_column(String(20), default="mixed")
    status: Mapped[str] = mapped_column(String(20), default="draft")  # 'draft' | 'published'
    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    creator = relationship("User", back_populates="exams")
    exam_questions = relationship("ExamQuestion", back_populates="exam", cascade="all, delete-orphan")
    scores = relationship("Score", back_populates="exam", cascade="all, delete-orphan")
    rooms = relationship("ExamRoom", back_populates="exam", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Exam(id={self.id}, title='{self.title}')>"


class ExamQuestion(Base):
    __tablename__ = "exam_questions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    exam_id: Mapped[int] = mapped_column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    order_num: Mapped[int] = mapped_column(Integer, nullable=False)

    exam = relationship("Exam", back_populates="exam_questions")
    question = relationship("Question", back_populates="exam_questions")

    def __repr__(self) -> str:
        return f"<ExamQuestion(exam_id={self.exam_id}, question_id={self.question_id}, order={self.order_num})>"


class ExamRoom(Base):
    __tablename__ = "exam_rooms"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    exam_id: Mapped[int] = mapped_column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    access_code: Mapped[str] = mapped_column(String(36), unique=True, default=lambda: str(uuid.uuid4()))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    exam = relationship("Exam", back_populates="rooms")

    def __repr__(self) -> str:
        return f"<ExamRoom(id={self.id}, access_code='{self.access_code}')>"