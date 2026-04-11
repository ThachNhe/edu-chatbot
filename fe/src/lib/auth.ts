import { authService } from '@/features/auths'
import { useAuthStore } from '@/stores/useAuthStore'
import type { User } from '@/types/common.types'

export async function resolveSessionUser(): Promise<User | null> {
    try {
        const user = await authService.getMe()
        useAuthStore.getState().restoreSession(user)
        return user
    } catch {
        useAuthStore.getState().logout()
        return null
    }
}