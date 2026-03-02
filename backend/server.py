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
from pydantic import BaseModel, Field

import chat_bot
from send_mail import send_support_email
from config import settings
# from auth import check_auth

class SendMailRequest(BaseModel):
    question: str = Field(..., min_length=1, description="User question to send")
    user_email: Optional[str] = Field(
        None, description="Optional email from user to reply later"
    )

app = FastAPI(title="FC2 ChatBot (WebSocket)")


@app.get("/health")
async def health():
    return {"status": "ok"}

# Static
app.mount("/client", StaticFiles(directory="client"), name="client")

@app.get("/api/auth")
async def auth_status(request: Request):
    return JSONResponse(
        status_code=200,
        content={"authenticated": True, "login_url": ""},
    )


@app.get("/")
async def index(request: Request):
    return FileResponse("client/index.html")

@app.websocket("/ws/chat")
async def ws_chat(ws: WebSocket):
    await ws.accept()
    history = []  # Keep the last 2-3 turns (role, content)
    try:
        while True:
            data = await ws.receive_text()
            try:
                payload = json.loads(data)
                query = payload.get("text") or payload.get("message") or ""
            except Exception:
                query = data

            if not query:
                await ws.send_json({"role": "system", "content": "Empty message"})
                continue

            try:
                loop = asyncio.get_running_loop()
                result = await loop.run_in_executor(None, chat_bot.answer, query, history)
            except Exception as e:  # pragma: no cover - runtime safety
                print(f"[ERROR] answer failed: {e}", flush=True)
                await ws.send_json({"role": "system", "content": f"Lỗi xử lý: {e}"})
                continue

            if isinstance(result, (tuple, list)) and len(result) == 2:
                response, can_answer = result
            else:
                response, can_answer = result, True

            await ws.send_json({"role": "assistant", "content": response, "canAnswer": can_answer})
            history.append(("User", query))
            history.append(("Assistant", response))
            if len(history) > 6:
                history = history[-6:]
    except WebSocketDisconnect:
        pass


@app.post("/send_mail")
async def send_mail_api(payload: SendMailRequest):
    loop = asyncio.get_running_loop()
    try:
        await loop.run_in_executor(
            None, send_support_email, payload.question, payload.user_email
        )
        return {"status": "ok"}
    except Exception as e:  # pragma: no cover
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.exception_handler(Exception)
async def _unhandled(request, exc):  # pragma: no cover - safety
    return JSONResponse(status_code=500, content={"error": str(exc)})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("server:app", host="0.0.0.0", port=8765, reload=False)

