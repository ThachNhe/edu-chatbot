from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    class_name: Mapped[str | None] = mapped_column(String(20))
    student_code: Mapped[str | None] = mapped_column(String(20))   # mã số học sinh
    email: Mapped[str | None] = mapped_column(String(150))
    avatar: Mapped[str | None] = mapped_column(String(1))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    scores = relationship("Score", back_populates="student", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Student(id={self.id}, name='{self.name}')>"