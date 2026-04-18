export interface StudentOut {
    id: number
    name: string
    class_name: string | null
    student_code: string | null
    email: string | null
    avatar: string | null
    created_at: string
}

export interface ExamScoreOut {
    score_id: number
    exam_id: number
    exam_title: string
    score: number
    taken_at: string
}

export interface StudentWithHistory extends StudentOut {
    exam_history: ExamScoreOut[]
}
