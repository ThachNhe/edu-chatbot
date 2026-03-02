import { useNavigate } from '@tanstack/react-router'

const QUICK_ITEMS = [
  { icon: '🤖', label: 'Trợ lý AI', path: '/chat' },
  { icon: '📝', label: 'Tạo đề thi', path: '/exam' },
  { icon: '📚', label: 'Bài học', path: '/lessons' },
  { icon: '📊', label: 'Thống kê', path: '/stats' },
] as const

export function QuickAccess() {
  const navigate = useNavigate()

  return (
    <div className="mb-5 rounded-[var(--edu-radius)] border border-[var(--edu-gray-100)] bg-white shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-100)] px-5 py-4">
        <div className="flex items-center gap-[7px] text-sm font-extrabold text-[var(--edu-gray-800)]">
          ⚡ Truy cập nhanh
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3.5 p-5">
        {QUICK_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate({ to: item.path })}
            className="rounded-[10px] border-[1.5px] border-[var(--edu-gray-200)] bg-[var(--edu-gray-50)] p-3.5 text-center transition-all hover:border-[var(--edu-primary-border)] hover:bg-[var(--edu-primary-soft)]"
          >
            <div className="mb-1.5 text-[22px]">{item.icon}</div>
            <div className="text-xs font-bold text-[var(--edu-gray-700)]">
              {item.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}