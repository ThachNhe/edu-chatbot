import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useDashboardSummary } from '../hooks/useDashboardData'
import { Sparkles, MessageCircle, Monitor } from 'lucide-react'

export function WelcomeBanner() {
  const navigate = useNavigate()
  const userName = useAuthStore((s) => s.user?.name) ?? 'Thầy/Cô'
  const { data } = useDashboardSummary()
  const pendingCount = data?.pending_questions ?? 0

  const today = new Date()
  const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
  const dayLabel = weekdays[today.getDay()]

  // Greeting based on hour
  const hour = today.getHours()
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối'

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl px-8 py-7 text-white"
      style={{
        background: 'linear-gradient(135deg, #1a56db 0%, #0ea5e9 60%, #06b6d4 100%)',
        boxShadow: '0 8px 32px rgba(26,86,219,0.25)',
      }}
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
      <div className="pointer-events-none absolute right-32 bottom-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-white/15 px-3 py-0.5 text-[11px] font-bold backdrop-blur-sm flex items-center gap-1">
              <Sparkles size={11} /> Hôm nay, {dayLabel}
            </span>
          </div>
          <h2 className="mt-2 text-[22px] font-extrabold leading-tight">
            {greeting}, {userName}!
          </h2>
          <p className="mt-1.5 max-w-[440px] text-[13px] leading-relaxed text-white/80">
            {pendingCount > 0 ? (
              <>
                Hôm nay có <strong className="text-white">{pendingCount} câu hỏi từ học sinh</strong> đang chờ xem xét.
              </>
            ) : (
              <>Mọi thứ đang ổn định. Hãy tiếp tục công việc bạn đang làm!</>
            )}
          </p>
        </div>
        <button
          onClick={() => navigate({ to: '/chat' })}
          className="z-10 flex-shrink-0 flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-[13px] font-bold text-[#1a56db] shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
        >
          <MessageCircle size={15} /> Mở Trợ lý AI
        </button>
      </div>

      {/* Decorative */}
      <span className="pointer-events-none absolute right-[160px] top-1/2 -translate-y-1/2 opacity-[0.08] select-none">
        <Monitor size={80} className="text-white" />
      </span>
    </div>
  )
}