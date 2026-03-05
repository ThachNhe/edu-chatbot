"""
FastAPI WebSocket server dùng chatbot từ chat_bot.py.
Frontend được tách riêng trong thư mục client.
Chạy: uvicorn server:app --host 0.0.0.0 --port 8765
"""

import asyncio
import json
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import chat_bot
from send_mail import send_support_email
from app.config.config import settings
from app.features.auth.router import router as auth_router


class SendMailRequest(BaseModel):
    question: str = Field(..., min_length=1, description="User question to send")
    user_email: Optional[str] = Field(
        None, description="Optional email from user to reply later"
    )


app = FastAPI(title="FC2 ChatBot (WebSocket)")

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # phải False nếu dùng wildcard
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(auth_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/")
async def index(request: Request):
    return FileResponse("client/index.html")


@app.websocket("/ws/chat")
async def ws_chat(ws: WebSocket):
    await ws.accept()
    history: list[tuple[str, str]] = []

    try:
        while True:
            data = await ws.receive_text()
            payload = json.loads(data)
            user_msg = payload.get("message", "")

            answer_text, is_answerable = await asyncio.to_thread(
                chat_bot.answer, user_msg, history
            )

            history.append((user_msg, answer_text))

            await ws.send_text(
                json.dumps(
                    {
                        "reply": answer_text,
                        "is_answerable": is_answerable,
                    }
                )
            )

    except WebSocketDisconnect:
        pass


@app.post("/send_mail")
async def send_mail(req: SendMailRequest):
    result = await asyncio.to_thread(
        send_support_email, req.question, req.user_email
    )
    if result:
        return {"status": "ok"}
    return JSONResponse(status_code=500, content={"error": "Failed to send email"})


# Static
# app.mount("/client", StaticFiles(directory="client"), name="client")