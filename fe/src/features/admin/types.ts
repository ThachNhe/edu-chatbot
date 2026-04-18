export interface AdminStudentOut {
    id: number
    name: string
    class_name?: string
    student_code?: string
    email?: string
    avatar?: string
    is_active?: boolean
    created_at: string
}

export interface AdminStudentCreatePayload {
    name: string
    class_name?: string
    student_code?: string
    email?: string
}

export interface StudentValidatePayload {
    student_code: string
}

export interface StudentValidateResponse {
    valid: boolean
    student: AdminStudentOut | null
}

export interface AdminInstructorOut {
    id: number
    name: string
    email: string
    role: string
    is_active: boolean
    created_at: string
}

export interface AdminInstructorCreatePayload {
    name: string
    email: string
    password: string
}

// ─── Extended Stats ────────────────────────────────────────────────────────

export interface AdminStats {
    total_students: number
    total_teachers: number
    total_exams: number
    total_questions: number
}

export interface TrendPoint {
    date: string
    exams: number
    submissions: number
}

export interface TopTeacher {
    id: number
    name: string
    exam_count: number
    student_count: number
    question_count: number
}

export interface ActivityLogOut {
    id: number
    user_id: number | null
    user_name: string
    action: string
    target_type: string | null
    target_id: number | null
    detail: string | null
    ip_address: string | null
    created_at: string
}
