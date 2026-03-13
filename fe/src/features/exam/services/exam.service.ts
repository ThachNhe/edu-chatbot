import { api } from '@/services/api'
import { apiGet, apiPost, apiDelete } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ScoreWithStudent } from '../types/exam.type'
import type {
    ExamConfig,
    ExamDetail,
    ExamOut,
    ExamQuestion,
    QuestionOut,
    RoomOut,
    StudentExam,
    SubmitResult,
} from '../types/exam.type'

export const examService = {
    generate: (config: ExamConfig) =>
        apiPost<ExamQuestion[]>(API_ENDPOINTS.EXAMS.GENERATE, {
            topic: config.topic,
            question_count: config.questionCount,
            difficulty: config.difficulty,
            duration: config.duration,
        }),

    create: (payload: {
        title: string
        topic: string
        duration: string
        level_mix: string
        status: 'draft' | 'published'
        questions: ExamQuestion[]
    }) => apiPost<ExamDetail>(API_ENDPOINTS.EXAMS.CREATE, payload),

    list: () => apiGet<ExamOut[]>(API_ENDPOINTS.EXAMS.LIST),

    detail: (id: number) => apiGet<ExamDetail>(API_ENDPOINTS.EXAMS.DETAIL(id)),

    delete: (id: number) => apiDelete<void>(API_ENDPOINTS.EXAMS.DELETE(id)),

    updateQuestion: (examId: number, questionId: number, payload: {
        content?: string
        level?: string
        options?: { id: number; letter: string; content: string; is_correct: boolean }[]
    }) =>
        api
            .patch<QuestionOut>(API_ENDPOINTS.EXAMS.UPDATE_QUESTION(examId, questionId), payload)
            .then((r) => r.data),

    createRoom: (examId: number, expiresAt?: string) =>
        apiPost<RoomOut>(API_ENDPOINTS.EXAMS.CREATE_ROOM(examId), {
            expires_at: expiresAt ?? null,
        }),

    listRooms: (examId: number) =>
        apiGet<RoomOut[]>(API_ENDPOINTS.EXAMS.LIST_ROOMS(examId)),

    // ─── Public (học sinh) ───────────────────────────────────────────────────
    getRoom: (code: string) =>
        apiGet<StudentExam>(API_ENDPOINTS.ROOMS.GET(code)),

    submitExam: (code: string, payload: {
        student_name: string
        class_name?: string
        answers: { question_id: number; selected_letter: string }[]
    }) => apiPost<SubmitResult>(API_ENDPOINTS.ROOMS.SUBMIT(code), payload),


    toggleRoom: (examId: number, roomId: number) =>
        api
            .patch<RoomOut>(API_ENDPOINTS.EXAMS.TOGGLE_ROOM(examId, roomId))
            .then((r) => r.data),

    getExamScores: (examId: number) =>
        apiGet<ScoreWithStudent[]>(API_ENDPOINTS.EXAMS.SCORES(examId)),
}