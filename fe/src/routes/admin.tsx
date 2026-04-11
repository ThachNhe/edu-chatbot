import { createFileRoute, redirect } from '@tanstack/react-router'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { resolveSessionUser } from '@/lib/auth'

export const Route = createFileRoute('/admin')({
  beforeLoad: async () => {
    const user = await resolveSessionUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'admin') {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: AdminLayout,
})
