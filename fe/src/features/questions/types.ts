export interface QuestionOption {
    id: number
    letter: string
    content: string
    is_correct: boolean
}

export interface QuestionBankItem {
    id: number
    content: string
    level: 'easy' | 'med' | 'hard'
    lesson_id: number | null
    lesson_name: string | null
    usage_count: number
    created_at: string
    options: QuestionOption[]
}

export interface CreateOptionPayload {
    letter: string
    content: string
    is_correct: boolean
}

export interface CreateQuestionPayload {
    content: string
    level: 'easy' | 'med' | 'hard'
    lesson_id?: number | null
    options: CreateOptionPayload[]
}

export interface QuestionFilter {
    level?: string
    lesson_id?: number
    search?: string
    skip?: number
    limit?: number
}
