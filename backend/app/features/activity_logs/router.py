from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.features.activity_logs.schemas import ActivityLogOut
import app.features.activity_logs.repository as log_repo

router = APIRouter(prefix="/admin/activity-logs", tags=["Activity Logs"])


@router.get("", response_model=List[ActivityLogOut])
def list_activity_logs(
    action: Optional[str] = Query(None, description="Lọc theo action"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập.",
        )
    return log_repo.get_activity_logs(db, action=action, skip=skip, limit=limit)


@router.get("/count")
def count_activity_logs(
    action: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Không có quyền truy cập.",
        )
    total = log_repo.count_activity_logs(db, action=action)
    return {"total": total}
