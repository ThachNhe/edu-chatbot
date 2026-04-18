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
    topic?: string | null
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
    topic?: string | null
    options: CreateOptionPayload[]
}

export interface QuestionFilter {
    level?: string
    lesson_id?: number
    search?: string
    topic?: string
    skip?: number
    limit?: number
}

// ─── AI Generate ──────────────────────────────────────────────────────────────

export interface GeneratedQuestionOption {
    letter: string
    content: string
    is_correct: boolean
}

/** Câu hỏi do AI tạo ra — chưa có id, chưa lưu DB */
export interface GeneratedBankQuestion {
    content: string
    level: 'easy' | 'med' | 'hard'
    options: GeneratedQuestionOption[]
}

export interface GenerateQuestionsPayload {
    topic: string
    count: number
    difficulty: 'easy' | 'med' | 'hard' | 'mixed'
}
