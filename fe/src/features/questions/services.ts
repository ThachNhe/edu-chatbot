import { apiGet, apiPost, apiDelete } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { QuestionBankItem, CreateQuestionPayload, QuestionFilter, GeneratedBankQuestion, GenerateQuestionsPayload } from './types'

export const questionService = {
    list: (filter?: QuestionFilter) =>
        apiGet<QuestionBankItem[]>(API_ENDPOINTS.QUESTIONS.LIST, filter),

    count: (filter?: Omit<QuestionFilter, 'skip' | 'limit'>) =>
        apiGet<{ total: number }>(API_ENDPOINTS.QUESTIONS.COUNT, filter),

    create: (payload: CreateQuestionPayload) =>
        apiPost<QuestionBankItem>(API_ENDPOINTS.QUESTIONS.CREATE, payload),

    delete: (id: number) =>
        apiDelete<void>(API_ENDPOINTS.QUESTIONS.DELETE(id)),

    /** AI tạo câu hỏi — trả về danh sách để review, chưa lưu DB */
    generateForBank: (payload: GenerateQuestionsPayload) =>
        apiPost<GeneratedBankQuestion[]>(API_ENDPOINTS.QUESTIONS.GENERATE, payload),
}
