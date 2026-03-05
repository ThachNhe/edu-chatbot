from datetime import datetime
from sqlalchemy import String, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    number: Mapped[str] = mapped_column(String(5), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(String(300))
    icon: Mapped[str | None] = mapped_column(String(10))
    icon_bg: Mapped[str | None] = mapped_column(String(20))
    chapter: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="todo")
    created_by: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    creator = relationship("User", back_populates="lessons")
    questions = relationship("Question", back_populates="lesson")

    def __repr__(self) -> str:
        return f"<Lesson(id={self.id}, number='{self.number}', name='{self.name}')>"