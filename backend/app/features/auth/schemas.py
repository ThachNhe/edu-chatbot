from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ─── Request Schemas ────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class RefreshTokenRequest(BaseModel):
    refreshToken: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    password: str = Field(..., min_length=8, max_length=100)


# ─── Response Schemas ───────────────────────────────────────────────────────

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    avatar: Optional[str] = None
    createdAt: str
    updatedAt: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    user: UserResponse
    accessToken: str
    refreshToken: str
    expiresIn: int


class RegisterResponse(BaseModel):
    user: UserResponse
    message: str


class ApiResponse(BaseModel):
    data: Optional[dict] = None
    message: str
    success: bool