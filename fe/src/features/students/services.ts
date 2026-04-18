import { apiGet } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { StudentOut, StudentWithHistory } from './types'

export const studentService = {
    list: (params?: { search?: string; skip?: number; limit?: number }) =>
        apiGet<StudentOut[]>(API_ENDPOINTS.STUDENTS.LIST, params),

    count: (params?: { search?: string }) =>
        apiGet<{ total: number }>(API_ENDPOINTS.STUDENTS.COUNT, params),

    detail: (id: number) =>
        apiGet<StudentWithHistory>(API_ENDPOINTS.STUDENTS.DETAIL(id)),
}
