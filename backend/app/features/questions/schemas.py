from typing import List, Optional

from pydantic import BaseModel


class UpdateOptionIn(BaseModel):
    id: int
    letter: str
    content: str
    is_correct: bool


class UpdateQuestionRequest(BaseModel):
    content: Optional[str] = None
    level: Optional[str] = None
    options: Optional[List[UpdateOptionIn]] = None