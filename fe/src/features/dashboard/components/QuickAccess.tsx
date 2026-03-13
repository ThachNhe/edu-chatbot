import { useNavigate } from '@tanstack/react-router'

const ITEMS = [
  { icon: '💬', label: 'Trợ lý AI', path: '/chat', bg: 'linear-gradient(135deg,#dbeafe,#eff6ff)', color: '#1a56db' },
  { icon: '📝', label: 'Tạo đề thi', path: '/exam', bg: 'linear-gradient(135deg,#d1fae5,#ecfdf5)', color: '#10b981' },
  // { icon: '📚', label: 'Bài học', path: '/lessons', bg: 'linear-gradient(135deg,#fef3c7,#fffbeb)', color: '#f59e0b' },
  { icon: '📊', label: 'Thống kê', path: '/stats', bg: 'linear-gradient(135deg,#ede9fe,#f5f3ff)', color: '#7c3aed' },
]

export function QuickAccess() {
  const navigate = useNavigate()
  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-[13px] font-extrabold text-gray-700">
        ⚡ Truy cập nhanh
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate({ to: item.path as any })}
            className="group flex flex-col items-center gap-2.5 rounded-xl border border-gray-100 p-4 transition-all hover:-translate-y-0.5 hover:border-transparent hover:shadow-md"
            style={{ background: 'white' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = item.bg)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
          >
            <span className="text-[26px]">{item.icon}</span>
            <span className="text-[12px] font-bold text-gray-600 group-hover:text-gray-800">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}