import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/constants'
import { studentService } from './services'

export function useStudents(params?: { search?: string }) {
    return useQuery({
        queryKey: QUERY_KEYS.STUDENTS.LIST(params),
        queryFn: () => studentService.list(params),
    })
}

export function useStudentDetail(id: number | null) {
    return useQuery({
        queryKey: QUERY_KEYS.STUDENTS.DETAIL(id!),
        queryFn: () => studentService.detail(id!),
        enabled: id !== null,
    })
}
