import asyncio
import json

import app.features.conversations.service as conversation_service
from fastapi import APIRouter, WebSocket, WebSocketDisconnect


router = APIRouter(prefix="/ws", tags=["Authentication"])

@router.websocket("/chat")
async def ws_chat(ws: WebSocket):
    await ws.accept()
    history: list[tuple[str, str]] = []

    try:
        while True:
            data = await ws.receive_text()
            payload = json.loads(data)
            user_msg = payload.get("message", "")

            answer_text, is_answerable = await asyncio.to_thread(
                conversation_service.answer, user_msg, history
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