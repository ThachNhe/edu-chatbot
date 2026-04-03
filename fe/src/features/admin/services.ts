import { apiGet, apiPost } from '@/services/api'
import type { 
    AdminStudentOut, 
    AdminStudentCreatePayload,
    StudentValidatePayload,
    StudentValidateResponse,
    AdminInstructorOut,
    AdminInstructorCreatePayload
} from './types'

export const adminService = {
    // ─── Students ──────────────────────────────────────────────────────────
    listStudents: () => apiGet<AdminStudentOut[]>('/admin/students'),
    
    createStudent: (payload: AdminStudentCreatePayload) => 
        apiPost<AdminStudentOut>('/admin/students', payload),
        
    validateStudent: (payload: StudentValidatePayload) =>
        apiPost<StudentValidateResponse>('/admin/students/validate', payload),

    toggleStudentLock: (studentId: number) =>
        apiPost<{message: string, is_active: boolean}>(`/admin/students/${studentId}/toggle-lock`),

    getAdminStats: () =>
        apiGet<{total_students: number, total_teachers: number, total_exams: number}>('/admin/stats'),

    // ─── Instructors ────────────────────────────────────────────────────────
    listInstructors: () => apiGet<AdminInstructorOut[]>('/admin/instructors'),
    
    createInstructor: (payload: AdminInstructorCreatePayload) =>
        apiPost<AdminInstructorOut>('/admin/instructors', payload),

    toggleInstructorLock: (instructorId: number) =>
        apiPost<{message: string, is_active: boolean}>(`/admin/instructors/${instructorId}/toggle-lock`),
}
