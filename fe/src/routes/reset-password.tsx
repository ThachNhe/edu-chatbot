import { createFileRoute } from '@tanstack/react-router'
import { ResetPasswordForm } from '@/features/auths/components/ResetPasswordForm'
import { Lock } from 'lucide-react'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #0ea5e9 50%, #06b6d4 100%)',
      }}
    >
      <div className="pointer-events-none fixed -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Lock size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Đặt lại mật khẩu</h1>
          <p className="mt-1 text-sm text-white/70">Nhập mật khẩu mới của bạn</p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  )
}