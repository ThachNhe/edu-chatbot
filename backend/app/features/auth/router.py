from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.features.auth.schemas import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    LoginResponse,
    RegisterResponse,
    UserResponse,
    ApiResponse,
)
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_reset_token,
    decode_token,
)
from app.dependencies.auth import get_current_user
from app.config.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


COOKIE_MAX_AGE_SECONDS = settings.jwt_access_token_expire_days * 24 * 60 * 60


def _set_auth_cookie(response: Response, access_token: str) -> None:
    response.set_cookie(
        key=settings.auth_cookie_name,
        value=access_token,
        max_age=COOKIE_MAX_AGE_SECONDS,
        httponly=True,
        secure=settings.is_production,
        samesite="lax",
        path="/",
    )


def _clear_auth_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.auth_cookie_name,
        path="/",
        secure=settings.is_production,
        httponly=True,
        samesite="lax",
    )


def _user_to_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        role=user.role,
        avatar=None,
        createdAt=user.created_at.isoformat() if user.created_at else "",
        updatedAt=user.created_at.isoformat() if user.created_at else "",
    )


# ─── Register ───────────────────────────────────────────────────────────────

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(_body: RegisterRequest):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Tài khoản giáo viên được cấp bởi admin. Bạn không thể tự đăng ký.",
    )


# ─── Login ──────────────────────────────────────────────────────────────────

@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower()).first()

    if not user or not verify_password(body.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.",
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    _set_auth_cookie(response, access_token)

    return LoginResponse(
        user=_user_to_response(user),
        expiresIn=COOKIE_MAX_AGE_SECONDS,
    )


# ─── Logout ─────────────────────────────────────────────────────────────────

@router.post("/logout", response_model=ApiResponse)
def logout(response: Response):
    _clear_auth_cookie(response)
    return ApiResponse(
        message="Đăng xuất thành công",
        success=True,
    )


# ─── Get Me ──────────────────────────────────────────────────────────────────

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return _user_to_response(current_user)


# ─── Forgot Password ────────────────────────────────────────────────────────

@router.post("/forgot-password", response_model=ApiResponse)
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower()).first()

    if user:
        reset_token = create_reset_token(user.email)
        reset_link = f"{settings.frontend_url}/reset-password?token={reset_token}"

        # TODO: Send email with reset_link
        # For now, log it during development
        if settings.debug:
            print(f"[DEBUG] Reset link for {user.email}: {reset_link}")

    # Always return success to prevent email enumeration
    return ApiResponse(
        message="Nếu email tồn tại, chúng tôi đã gửi link đặt lại mật khẩu.",
        success=True,
    )


# ─── Reset Password ─────────────────────────────────────────────────────────

@router.post("/reset-password", response_model=ApiResponse)
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    payload = decode_token(body.token)

    if payload is None or payload.get("type") != "reset":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token không hợp lệ hoặc đã hết hạn",
        )

    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Người dùng không tồn tại",
        )

    user.password = hash_password(body.password)
    db.commit()

    return ApiResponse(
        message="Mật khẩu đã được đặt lại thành công",
        success=True,
    )