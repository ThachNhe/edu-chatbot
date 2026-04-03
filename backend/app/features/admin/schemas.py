from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AdminStudentOut(BaseModel):
    id: int
    name: str
    class_name: Optional[str] = None
    student_code: Optional[str] = None
    email: Optional[str] = None
    avatar: Optional[str] = None
    is_active: bool = True
    created_at: datetime

    model_config = {"from_attributes": True}

class AdminStudentCreate(BaseModel):
    name: str
    class_name: Optional[str] = None
    student_code: Optional[str] = None
    email: Optional[str] = None

class StudentValidateRequest(BaseModel):
    student_code: str

class StudentValidateResponse(BaseModel):
    valid: bool
    student: Optional[AdminStudentOut] = None

class AdminInstructorOut(BaseModel):
    id: int
    name: str
    email: str
    role: str
    is_active: bool = True
    created_at: datetime
    
    model_config = {"from_attributes": True}

class AdminInstructorCreate(BaseModel):
    name: str
    email: str
    password: str
