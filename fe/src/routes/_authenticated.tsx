import { createFileRoute, redirect } from '@tanstack/react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { resolveSessionUser } from '@/lib/auth'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const user = await resolveSessionUser()

    if (!user) {
      throw redirect({ to: '/login' })
    }

    if (user.role === 'admin') {
      throw redirect({ to: '/admin' })
    }
  },
  component: () => <AppLayout />,
})