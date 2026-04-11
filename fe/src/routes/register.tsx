import { createFileRoute, redirect } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { GraduationCap, ShieldCheck } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { resolveSessionUser } from '@/lib/auth'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    const user = await resolveSessionUser()
    if (user) {
      throw redirect({ to: user.role === 'admin' ? '/admin' : '/dashboard' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #0ea5e9 50%, #06b6d4 100%)',
      }}
    >
      <div className="pointer-events-none fixed -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
            <GraduationCap />
          </div>
          <h1 className="text-2xl font-extrabold text-white">EduChatbot</h1>
          <p className="mt-1 text-sm text-white/70">Tài khoản giáo viên được quản trị viên cấp</p>
        </div>

        <div className="rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
          <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
            <ShieldCheck className="size-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Không hỗ trợ tự đăng ký</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Giáo viên không thể tự tạo tài khoản. Admin sẽ tạo tài khoản và gửi email đăng nhập kèm mật khẩu qua MailHog hoặc hệ thống SMTP đã cấu hình.
          </p>
          <div className="mt-6 flex gap-3">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              Quay lại đăng nhập
            </Link>
            <span className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600">
              Cần tài khoản mới? Liên hệ admin.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}