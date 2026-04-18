import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { useUIStore } from '@/stores/useUIStore'
import { examService } from '../services/exam.service'
import type { CreateExamFromBankPayload, ExamConfig, ExamQuestion } from '../types/exam.type'

// ─── Teacher hooks ────────────────────────────────────────────────────────

export function useGenerateExam() {
    const { addToast } = useUIStore()

    return useMutation({
        mutationFn: (config: ExamConfig) => examService.generate(config),
        onError: () => {
            addToast({ type: 'error', title: 'Tạo đề thất bại', description: 'Không thể kết nối AI, vui lòng thử lại.' })
        },
    })
}

export function useCreateExam() {
    const queryClient = useQueryClient()
    const { addToast } = useUIStore()

    return useMutation({
        mutationFn: examService.create,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXAMS.LIST })
            addToast({
                type: 'success',
                title: data.status === 'published' ? 'Đề thi đã xuất bản' : 'Đã lưu nháp',
                description: data.title,
            })
        },
        onError: () => {
            addToast({ type: 'error', title: 'Lưu thất bại', description: 'Vui lòng thử lại.' })
        },
    })
}

export function useCreateExamFromBank() {
    const queryClient = useQueryClient()
    const { addToast } = useUIStore()

    return useMutation({
        mutationFn: (payload: CreateExamFromBankPayload) => examService.createFromBank(payload),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXAMS.LIST })
            addToast({
                type: 'success',
                title: data.status === 'published' ? 'Đề thi đã xuất bản' : 'Đã lưu nháp',
                description: data.title,
            })
        },
        onError: () => {
            addToast({ type: 'error', title: 'Tạo đề thất bại', description: 'Vui lòng thử lại.' })
        },
    })
}

export function useExamList() {
    return useQuery({
        queryKey: QUERY_KEYS.EXAMS.LIST,
        queryFn: examService.list,
    })
}

export function useExamDetail(id: number | null) {
    return useQuery({
        queryKey: QUERY_KEYS.EXAMS.DETAIL(id!),
        queryFn: () => examService.detail(id!),
        enabled: id !== null,
    })
}

export function useDeleteExam() {
    const queryClient = useQueryClient()
    const { addToast } = useUIStore()

    return useMutation({
        mutationFn: examService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXAMS.LIST })
            addToast({ type: 'success', title: 'Đã xóa đề thi' })
        },
        onError: () => {
            addToast({ type: 'error', title: 'Xóa thất bại' })
        },
    })
}

export function useUpdateQuestion(examId: number) {
    const queryClient = useQueryClient()
    const { addToast } = useUIStore()

    return useMutation({
        mutationFn: ({ questionId, payload }: {
            questionId: number
            payload: {
                content?: string
                level?: string
                options?: { id: number; letter: string; content: string; is_correct: boolean }[]
            }
        }) => examService.updateQuestion(examId, questionId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXAMS.DETAIL(examId) })
            addToast({ type: 'success', title: 'Đã cập nhật câu hỏi' })
        },
        onError: () => {
            addToast({ type: 'error', title: 'Cập nhật thất bại' })
        },
    })
}

export function useCreateRoom(examId: number) {
    const queryClient = useQueryClient()
    const { addToast } = useUIStore()

    return useMutation({
        mutationFn: (expiresAt?: string) => examService.createRoom(examId, expiresAt),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXAMS.ROOMS(examId) })
            addToast({ type: 'success', title: 'Phòng thi đã được tạo' })
        },
        onError: () => {
            addToast({ type: 'error', title: 'Tạo phòng thi thất bại' })
        },
    })
}

// ─── Student hooks ─────────────────────────────────────────────────────────

export function useRoomExam(code: string) {
    return useQuery({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(code),
        queryFn: () => examService.getRoom(code),
        retry: false,
    })
}

export function useSubmitExam(code: string) {
    const { addToast } = useUIStore()

    return useMutation({
        mutationFn: (payload: {
            student_name: string
            student_code?: string
            class_name?: string
            email?: string
            answers: { question_id: number; selected_letter: string }[]
        }) => examService.submitExam(code, payload),
        onError: () => {
            addToast({ type: 'error', title: 'Nộp bài thất bại', description: 'Vui lòng thử lại.' })
        },
    })
}


export function useToggleRoom(examId: number) {
    const queryClient = useQueryClient()
    const { addToast } = useUIStore()

    return useMutation({
        mutationFn: (roomId: number) => examService.toggleRoom(examId, roomId),
        onSuccess: (room) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EXAMS.ROOMS(examId) })
            addToast({
                type: room.is_active ? 'success' : 'warning',
                title: room.is_active ? 'Phòng thi đã mở' : 'Phòng thi đã khóa',
            })
        },
        onError: () => {
            addToast({ type: 'error', title: 'Không thể thay đổi trạng thái phòng thi' })
        },
    })
}

export function useExamScores(examId: number | null) {
    return useQuery({
        queryKey: ['exams', examId, 'scores'],
        queryFn: () => examService.getExamScores(examId!),
        enabled: examId !== null,
    })
}