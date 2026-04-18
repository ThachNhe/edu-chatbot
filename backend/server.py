from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.config import settings
from app.features.auth.router import router as auth_router
from app.features.conversations.router import router as conversations_router
from app.features.dashboard.router import router as dashboard_router
from app.features.exams.router import router as exams_router
from app.features.questions.router import router as questions_router
from app.features.scores.router import router as rooms_router
from app.features.stats.router import router as stats_router
from app.features.admin.router import router as admin_router
from app.features.students.router import router as students_router
from app.features.activity_logs.router import router as activity_logs_router

app = FastAPI(title="FC2 ChatBot")

cors_origins = [origin.strip() for origin in settings.frontend_url.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins or ["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(conversations_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(exams_router, prefix="/api")
app.include_router(questions_router, prefix="/api")
app.include_router(rooms_router, prefix="/api")
app.include_router(stats_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(students_router, prefix="/api")
app.include_router(activity_logs_router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}