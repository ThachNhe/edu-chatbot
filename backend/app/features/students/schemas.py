from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class StudentOut(BaseModel):
    id: int
    name: str
    class_name: Optional[str]
    avatar: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}