from datetime import datetime
from sqlalchemy import Integer, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Score(Base):
    __tablename__ = "scores"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    exam_id: Mapped[int] = mapped_column(Integer, ForeignKey("exams.id", ondelete="CASCADE"), nullable=False)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    taken_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    student = relationship("Student", back_populates="scores")
    exam = relationship("Exam", back_populates="scores")

    def __repr__(self) -> str:
        return f"<Score(id={self.id}, student_id={self.student_id}, score={self.score})>"