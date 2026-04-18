from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ActivityLogOut(BaseModel):
    id: int
    user_id: Optional[int]
    user_name: str
    action: str
    target_type: Optional[str]
    target_id: Optional[int]
    detail: Optional[str]
    ip_address: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}
