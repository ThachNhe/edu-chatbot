import { useNavigate } from '@tanstack/react-router'

export function WelcomeBanner() {
  const navigate = useNavigate()

  return (
    <div className="relative mb-6 flex items-center justify-between overflow-hidden rounded-[var(--edu-radius-lg)] bg-gradient-to-r from-[#1a56db] via-[#0ea5e9] to-[#06b6d4] px-8 py-7 text-white">
      <div className="relative z-10">
        <h2 className="mb-1.5 text-[22px] font-extrabold">
          Chào buổi sáng, thầy/cô Nguyễn Văn An! 👋
        </h2>
        <p className="max-w-[420px] text-[13.5px] leading-relaxed opacity-85">
          Hôm nay có <strong>3 câu hỏi mới từ học sinh</strong> đang chờ xem
          xét, và đề thi tuần sau chưa được tạo.
        </p>
      </div>
      <button
        onClick={() => navigate({ to: '/chat' })}
        className="z-10 flex-shrink-0 rounded-[10px] bg-white px-[22px] py-2.5 text-[13px] font-bold text-[var(--edu-primary)] transition-all hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(0,0,0,0.15)]"
      >
        💬 Mở Trợ lý AI
      </button>
      {/* Decorative emoji */}
      <span className="pointer-events-none absolute right-[130px] top-1/2 -translate-y-1/2 text-[80px] opacity-[0.12]">
        💻
      </span>
    </div>
  )
}