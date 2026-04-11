from fastapi import Depends, HTTPException, Request, WebSocket, status
from sqlalchemy.orm import Session

from app.config.config import settings
from app.database import get_db
from app.models.user import User
from app.utils.security import decode_token


def _extract_bearer_token(authorization_header: str | None) -> str | None:
    if not authorization_header:
        return None

    scheme, _, token = authorization_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None

    return token


def _resolve_request_token(request: Request) -> str | None:
    return request.cookies.get(settings.auth_cookie_name) or _extract_bearer_token(
        request.headers.get("Authorization")
    )


def _resolve_websocket_token(ws: WebSocket) -> str | None:
    return (
        ws.cookies.get(settings.auth_cookie_name)
        or _extract_bearer_token(ws.headers.get("Authorization"))
        or ws.query_params.get("token")
    )


def _get_user_from_token(token: str | None, db: Session) -> User:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Bạn chưa đăng nhập",
        )

    payload = decode_token(token)
    if payload is None or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ hoặc đã hết hạn",
        )

    raw_user_id = payload.get("sub")
    try:
        user_id = int(raw_user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ",
        )

    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Người dùng không tồn tại",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Admin.",
        )

    return user


async def get_current_user(
    request: Request,
    db: Session = Depends(get_db),
) -> User:
    return _get_user_from_token(_resolve_request_token(request), db)


def get_current_user_from_websocket(ws: WebSocket, db: Session) -> User:
    return _get_user_from_token(_resolve_websocket_token(ws), db)