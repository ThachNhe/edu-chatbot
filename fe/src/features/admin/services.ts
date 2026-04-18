import { apiGet, apiPost } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type {
    AdminStudentOut,
    AdminStudentCreatePayload,
    StudentValidatePayload,
    StudentValidateResponse,
    AdminInstructorOut,
    AdminInstructorCreatePayload,
    AdminStats,
    TrendPoint,
    TopTeacher,
    ActivityLogOut,
} from './types'

export const adminService = {
    // ─── Students ──────────────────────────────────────────────────────────
    listStudents: () => apiGet<AdminStudentOut[]>('/admin/students'),

    createStudent: (payload: AdminStudentCreatePayload) =>
        apiPost<AdminStudentOut>('/admin/students', payload),

    validateStudent: (payload: StudentValidatePayload) =>
        apiPost<StudentValidateResponse>('/admin/students/validate', payload),

    toggleStudentLock: (studentId: number) =>
        apiPost<{ message: string, is_active: boolean }>(`/admin/students/${studentId}/toggle-lock`),

    // ─── Instructors ────────────────────────────────────────────────────────
    listInstructors: () => apiGet<AdminInstructorOut[]>('/admin/instructors'),

    createInstructor: (payload: AdminInstructorCreatePayload) =>
        apiPost<AdminInstructorOut>('/admin/instructors', payload),

    toggleInstructorLock: (instructorId: number) =>
        apiPost<{ message: string, is_active: boolean }>(`/admin/instructors/${instructorId}/toggle-lock`),

    // ─── Statistics ─────────────────────────────────────────────────────────
    getAdminStats: () =>
        apiGet<AdminStats>(API_ENDPOINTS.ADMIN.STATS),

    getTrends: (days = 7) =>
        apiGet<TrendPoint[]>(API_ENDPOINTS.ADMIN.STATS_TRENDS, { days }),

    getTopTeachers: (limit = 5) =>
        apiGet<TopTeacher[]>(API_ENDPOINTS.ADMIN.STATS_TOP_TEACHERS, { limit }),

    // ─── Activity Logs ──────────────────────────────────────────────────────
    getActivityLogs: (params?: { action?: string; skip?: number; limit?: number }) =>
        apiGet<ActivityLogOut[]>(API_ENDPOINTS.ADMIN.ACTIVITY_LOGS, params),

    countActivityLogs: (params?: { action?: string }) =>
        apiGet<{ total: number }>(API_ENDPOINTS.ADMIN.ACTIVITY_LOGS_COUNT, params),
}
