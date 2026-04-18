from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.activity_log import ActivityLog


def get_activity_logs(
    db: Session,
    *,
    action: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
) -> List[ActivityLog]:
    q = db.query(ActivityLog)
    if action:
        q = q.filter(ActivityLog.action == action)
    return q.order_by(ActivityLog.created_at.desc()).offset(skip).limit(limit).all()


def count_activity_logs(db: Session, *, action: Optional[str] = None) -> int:
    q = db.query(ActivityLog)
    if action:
        q = q.filter(ActivityLog.action == action)
    return q.count()
