from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.features.auth.router import router as auth_router
from app.features.conversations.router import router as conversations_router
from app.features.exams.router import router as exams_router
from app.features.questions.router import router as questions_router
from app.features.scores.router import router as rooms_router

app = FastAPI(title="FC2 ChatBot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(conversations_router, prefix="/api")
app.include_router(exams_router, prefix="/api")
app.include_router(questions_router, prefix="/api")
app.include_router(rooms_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}