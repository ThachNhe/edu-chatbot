from datetime import datetime
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    user_name: Mapped[str] = mapped_column(String(100), nullable=False)
    action: Mapped[str] = mapped_column(String(50), nullable=False)   # 'login' | 'create_exam' | 'create_room' | 'lock_user' | 'unlock_user' | 'create_question' | 'delete_exam' | 'create_student' | 'create_instructor'
    target_type: Mapped[str | None] = mapped_column(String(50))       # 'exam' | 'question' | 'student' | 'instructor' | 'room'
    target_id: Mapped[int | None] = mapped_column(Integer)
    detail: Mapped[str | None] = mapped_column(Text)
    ip_address: Mapped[str | None] = mapped_column(String(50))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user = relationship("User", backref="activity_logs")

    def __repr__(self) -> str:
        return f"<ActivityLog(id={self.id}, action='{self.action}', user='{self.user_name}')>"
