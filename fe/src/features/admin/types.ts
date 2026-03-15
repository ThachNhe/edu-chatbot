export interface AdminStudentOut {
    id: number
    name: string
    class_name?: string
    student_code?: string
    email?: string
    avatar?: string
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
    created_at: string
}

export interface AdminInstructorCreatePayload {
    name: string
    email: string
    password: string
}
