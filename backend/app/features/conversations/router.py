import asyncio
import json
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect, status
from sqlalchemy.orm import Session

import app.features.conversations.repository as conversation_repo
import app.features.conversations.service as conversation_service
from app.database import get_db
from app.dependencies.auth import get_current_user
from app.features.conversations.schemas import ConversationDetail, ConversationOut
from app.models.user import User
from app.utils.security import decode_token

router = APIRouter(tags=["Conversations"])


# ─── REST ──────────────────────────────────────────────────────────────────

@router.get("/conversations", response_model=list[ConversationOut])
def list_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return conversation_repo.get_conversations(db, current_user.id)


@router.get("/conversations/{conversation_id}/messages", response_model=ConversationDetail)
def get_conversation_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    conv = conversation_repo.get_conversation(db, conversation_id, current_user.id)
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )
    return conv


# ─── WebSocket ────────────────────────────────────────────────────────────

@router.websocket("/ws/chat")
async def ws_chat(
    ws: WebSocket,
    token: str = Query(...),
    conversation_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
):
    # Authenticate via query param (WebSocket cannot send Authorization headers)
    payload = decode_token(token)
    if payload is None or payload.get("type") != "access":
        await ws.accept()
        await ws.close(code=4001)
        return

    user_id: int = payload.get("sub")
    if user_id is None:
        await ws.close(code=4001)
        return

    await ws.accept()

    history: list[tuple[str, str]] = []
    conv = None

    # Resume existing conversation: validate ownership and preload history
    if conversation_id is not None:
        conv = conversation_repo.get_conversation(db, conversation_id, user_id)
        if conv is None:
            await ws.close(code=4004)
            return
        db_messages = conversation_repo.get_messages(db, conv.id)
        history = [(m.role, m.content) for m in db_messages]

    try:
        while True:
            data = await ws.receive_text()
            payload_msg = json.loads(data)
            user_msg = payload_msg.get("message", "").strip()
            if not user_msg:
                continue

            # Auto-create conversation on the first message
            if conv is None:
                title = user_msg[:80]
                conv = conversation_repo.create_conversation(db, user_id, title)
                # Notify frontend of the new conversation id
                await ws.send_text(json.dumps({"conversation_id": conv.id}))

            conversation_repo.add_message(db, conv.id, "user", user_msg)

            answer_text, is_answerable = await asyncio.to_thread(
                conversation_service.answer, user_msg, history
            )

            history.append((user_msg, answer_text))
            conversation_repo.add_message(db, conv.id, "ai", answer_text)

            await ws.send_text(
                json.dumps({"reply": answer_text, "is_answerable": is_answerable})
            )

    except WebSocketDisconnect:
        pass