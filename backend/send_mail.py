import os
import smtplib
from email.message import EmailMessage
from typing import Optional
from config import settings

# Hard-coded recipient (customer support)
SUPPORT_EMAIL = "thach.dv@zinza.com.vn"


def send_support_email(question: str, user_email: Optional[str] = None) -> bool:
    """
    Send a support email containing the user's question.
    Read SMTP config from environment variables:
      SMTP_HOST (default: smtp.gmail.com)
      SMTP_PORT (default: 587)
      SMTP_USER (required)
      SMTP_PASS (required)
    """
    smtp_host = settings.smtp_host
    smtp_port = settings.smtp_port
    smtp_user = settings.smtp_user
    smtp_pass = settings.smtp_pass
    
    print(f"SMTP config: host={smtp_host}, port={smtp_port}, user={smtp_user}, pass={'***' if smtp_pass else None}")

    if not smtp_user or not smtp_pass:
        raise RuntimeError("SMTP_USER/SMTP_PASS is not configured in .env")

    msg = EmailMessage()
    msg["Subject"] = "New support question from chatbot"
    msg["From"] = smtp_user
    msg["To"] = SUPPORT_EMAIL
    body = [
        "A question could not be answered by the chatbot:",
        "",
        f"Question: {question}",
    ]
    if user_email:
        body.append(f"User email: {user_email}")
    msg.set_content("\n".join(body))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
    return True


__all__ = ["send_support_email", "SUPPORT_EMAIL"]
