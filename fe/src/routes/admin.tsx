import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuthStore } from '@/stores/useAuthStore'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    const { token, user } = useAuthStore.getState()
    if (!token) {
      throw redirect({ to: '/login' })
    }
    if (user?.role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: AdminLayout,
})
