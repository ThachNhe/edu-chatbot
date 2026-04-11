import smtplib
from email.message import EmailMessage
from typing import Optional

from app.config.config import settings

# Hard-coded recipient (customer support)
SUPPORT_EMAIL = "thach.dv@zinza.com.vn"


def send_support_email(question: str, user_email: Optional[str] = None) -> bool:
    msg = EmailMessage()
    msg["Subject"] = "New support question from chatbot"
    msg["From"] = settings.smtp_from_email or settings.smtp_user or "no-reply@localhost"
    msg["To"] = SUPPORT_EMAIL
    body = [
        "A question could not be answered by the chatbot:",
        "",
        f"Question: {question}",
    ]
    if user_email:
        body.append(f"User email: {user_email}")
    msg.set_content("\n".join(body))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        if settings.smtp_use_tls:
            server.starttls()
        if settings.smtp_user and settings.smtp_pass:
            server.login(settings.smtp_user, settings.smtp_pass)
        server.send_message(msg)
    return True


def send_teacher_credentials_email(
    teacher_name: str,
    recipient_email: str,
    password: str,
) -> bool:
    msg = EmailMessage()
    msg["Subject"] = "Tai khoan giao vien EduChatbot"
    msg["From"] = settings.smtp_from_email or settings.smtp_user or "no-reply@localhost"
    msg["To"] = recipient_email
    msg.set_content(
        "\n".join(
            [
                f"Xin chao {teacher_name},",
                "",
                "Tai khoan giao vien cua ban da duoc admin tao tren EduChatbot.",
                f"Email dang nhap: {recipient_email}",
                f"Mat khau tam thoi: {password}",
                "",
                "Vui long dang nhap va doi mat khau neu can.",
            ]
        )
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        if settings.smtp_use_tls:
            server.starttls()
        if settings.smtp_user and settings.smtp_pass:
            server.login(settings.smtp_user, settings.smtp_pass)
        server.send_message(msg)

    return True


__all__ = ["send_support_email", "send_teacher_credentials_email", "SUPPORT_EMAIL"]
