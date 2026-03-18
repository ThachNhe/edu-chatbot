import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { AppLayout } from '@/components/layout/AppLayout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
  const { user, token} = useAuthStore.getState()

    if (!token) {
      throw redirect({ to: '/login' })
    }
    
    if (user?.role === 'admin') {
      throw redirect({ to: '/admin' })
    }
  },
  component: () => <AppLayout />,
})