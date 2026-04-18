import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from './services'
import { QUERY_KEYS } from '@/lib/constants'
import { toast } from 'react-hot-toast'
import type {
    AdminStudentCreatePayload,
    StudentValidatePayload,
    AdminInstructorCreatePayload
} from './types'

export function useAdminStudents() {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.STUDENTS,
        queryFn: () => adminService.listStudents(),
    })
}

export function useAddAdminStudent() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: AdminStudentCreatePayload) => adminService.createStudent(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STUDENTS })
            toast.success('Thêm học sinh thành công')
        },
        onError: (err: any) => {
            toast.error(err.message || 'Lỗi thêm học sinh. Mã HS có thể đã tồn tại.')
        }
    })
}

export function useValidateStudent() {
    return useMutation({
        mutationFn: (payload: StudentValidatePayload) => adminService.validateStudent(payload)
    })
}

export function useToggleStudentLock() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (studentId: number) => adminService.toggleStudentLock(studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.STUDENTS })
            toast.success('Cập nhật trạng thái thành công')
        },
        onError: (err: any) => {
            toast.error(err.message || 'Lỗi cập nhật trạng thái')
        }
    })
}

export function useAdminInstructors() {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.INSTRUCTORS,
        queryFn: () => adminService.listInstructors(),
    })
}

export function useAddAdminInstructor() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: AdminInstructorCreatePayload) => adminService.createInstructor(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.INSTRUCTORS })
            toast.success('Thêm giáo viên thành công và đã gửi email qua MailHog/SMTP')
        },
        onError: (err: any) => {
            toast.error(err.message || 'Lỗi thêm giáo viên. Email có thể đã tồn tại.')
        }
    })
}

export function useToggleInstructorLock() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (instructorId: number) => adminService.toggleInstructorLock(instructorId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN.INSTRUCTORS })
            toast.success('Cập nhật trạng thái thành công')
        },
        onError: (err: any) => {
            toast.error(err.message || 'Lỗi cập nhật trạng thái')
        }
    })
}

export function useAdminStats() {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.STATS,
        queryFn: () => adminService.getAdminStats(),
    })
}

export function useAdminTrends(days = 7) {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.TRENDS,
        queryFn: () => adminService.getTrends(days),
    })
}

export function useTopTeachers(limit = 5) {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.TOP_TEACHERS,
        queryFn: () => adminService.getTopTeachers(limit),
    })
}

export function useActivityLogs(params?: { action?: string; skip?: number; limit?: number }) {
    return useQuery({
        queryKey: QUERY_KEYS.ADMIN.ACTIVITY_LOGS(params),
        queryFn: () => adminService.getActivityLogs(params),
    })
}

