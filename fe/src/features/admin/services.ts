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

    // ─── Instructors ────────────────────────────────────────────────────────
    listInstructors: () => apiGet<AdminInstructorOut[]>('/admin/instructors'),
    
    createInstructor: (payload: AdminInstructorCreatePayload) =>
        apiPost<AdminInstructorOut>('/admin/instructors', payload),
}
