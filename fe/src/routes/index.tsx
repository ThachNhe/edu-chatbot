import { createFileRoute, redirect } from '@tanstack/react-router'
import { resolveSessionUser } from '@/lib/auth'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const user = await resolveSessionUser()
    if (!user) {
      throw redirect({ to: '/login' })
    }

    throw redirect({ to: user.role === 'admin' ? '/admin' : '/dashboard' })
  },
})