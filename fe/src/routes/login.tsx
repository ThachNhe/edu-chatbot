import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/features/auths'
import { useAuthStore } from '@/stores/useAuthStore'
import { GraduationCap } from 'lucide-react'

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #0ea5e9 50%, #06b6d4 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none fixed -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
            <GraduationCap size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-white">EduChatbot</h1>
          <p className="mt-1 text-sm text-white/70">Trợ lý AI cho giáo viên Tin học</p>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}