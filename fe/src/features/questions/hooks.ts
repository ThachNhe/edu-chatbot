import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { QUERY_KEYS } from '@/lib/constants'
import { questionService } from './services'
import type { CreateQuestionPayload, QuestionFilter, GenerateQuestionsPayload } from './types'

export function useQuestions(filter?: QuestionFilter) {
    return useQuery({
        queryKey: QUERY_KEYS.QUESTIONS.LIST(filter),
        queryFn: () => questionService.list(filter),
    })
}

export function useCreateQuestion() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateQuestionPayload) => questionService.create(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] })
            toast.success('Thêm câu hỏi thành công')
        },
        onError: (err: any) => {
            toast.error(err.message || 'Lỗi khi thêm câu hỏi')
        },
    })
}

export function useDeleteQuestion() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => questionService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['questions'] })
            toast.success('Xóa câu hỏi thành công')
        },
        onError: (err: any) => {
            toast.error(err.message || 'Lỗi khi xóa câu hỏi')
        },
    })
}

/** Gọi AI để tạo danh sách câu hỏi mẫu — chưa lưu ngân hàng */
export function useGenerateBankQuestions() {
    return useMutation({
        mutationFn: (payload: GenerateQuestionsPayload) => questionService.generateForBank(payload),
        onError: (err: any) => {
            toast.error(err.message || 'Lỗi khi tạo câu hỏi')
        },
    })
}
