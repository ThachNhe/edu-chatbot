from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Exam(Base):
    __tablename__ = "exams"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    topic: Mapped[str | None] = mapped_column(String(200))
    duration: Mapped[str] = mapped_column(String(10), nullable=False)  # '15', '45', '60', '90'
    level_mix: Mapped[str] = mapped_column(String(20), default="mixed")  # 'easy'|'med'|'hard'|'mixed'
    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    creator = relationship("User", back_populates="exams")
    exam_questions = relationship("ExamQuestion", back_populates="exam", cascade="all, delete-orphan")
    scores = relationship("Score", back_populates="exam", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Exam(id={self.id}, title='{self.title}')>"


class ExamQuestion(Base):
    __tablename__ = "exam_questions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    exam_id: Mapped[int] = mapped_column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    question_id: Mapped[int] = mapped_column(Integer, ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    order_num: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationships
    exam = relationship("Exam", back_populates="exam_questions")
    question = relationship("Question", back_populates="exam_questions")

    def __repr__(self) -> str:
        return f"<ExamQuestion(exam_id={self.exam_id}, question_id={self.question_id}, order={self.order_num})>"