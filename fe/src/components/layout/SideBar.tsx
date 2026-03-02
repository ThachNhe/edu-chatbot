import { useNavigate, useRouterState } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

interface NavItem {
  icon: string
  label: string
  path: string
  badge?: number
}

const NAV_SECTIONS: { header: string; items: NavItem[] }[] = [
  {
    header: 'Tổng quan',
    items: [{ icon: '🏠', label: 'Trang chủ', path: '/' }],
  },
  {
    header: 'Chức năng chính',
    items: [
      { icon: '🤖', label: 'Trợ lý AI Chat', path: '/chat', badge: 3 },
      { icon: '📝', label: 'Tạo đề thi / Bài tập', path: '/exam' },
      { icon: '📚', label: 'Quản lý Bài học', path: '/lessons' },
      { icon: '📊', label: 'Thống kê & Báo cáo', path: '/stats' },
    ],
  },
]

export function Sidebar() {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  return (
    <aside className="sidebar-gradient relative w-60 flex-shrink-0 flex flex-col overflow-hidden bg-[var(--edu-sidebar-bg)]">
      {/* Logo */}
      <div className="flex items-center gap-[11px] border-b border-white/[0.08] px-5 pb-[18px] pt-[22px]">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br from-blue-500 to-cyan-500 text-xl shadow-[0_4px_12px_rgba(59,130,246,0.4)]">
          🎓
        </div>
        <div className="leading-tight">
          <strong className="block text-[15px] font-extrabold text-white">
            EduAI Tin 12
          </strong>
          <span className="text-[10.5px] font-medium text-[var(--edu-sidebar-text)]">
            Trợ lý Ảo Giảng dạy
          </span>
        </div>
      </div>

      {/* Nav Sections */}
      {NAV_SECTIONS.map((section) => (
        <div key={section.header} className="px-3 pb-1.5 pt-4">
          <div className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[1.3px] text-[var(--edu-sidebar-text)]/50">
            {section.header}
          </div>
          {section.items.map((item) => {
            const isActive = currentPath === item.path
            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className={cn(
                  'relative mb-px flex w-full items-center gap-2.5 rounded-[9px] px-2.5 py-[9px] text-[13.5px] font-medium text-[var(--edu-sidebar-text)] transition-all duration-150',
                  isActive
                    ? 'nav-active-indicator bg-white/[0.15] font-bold text-white'
                    : 'hover:bg-white/[0.08] hover:text-white',
                )}
              >
                <span className="w-[22px] flex-shrink-0 text-center text-[17px]">
                  {item.icon}
                </span>
                {item.label}
                {item.badge && (
                  <span className="ml-auto min-w-[20px] rounded-full bg-[var(--edu-accent)] px-[7px] py-px text-center text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ))}

      {/* Footer */}
      <div className="mt-auto border-t border-white/[0.08] p-3">
        <div className="flex items-center gap-2.5 rounded-[9px] p-2.5 transition-colors hover:bg-white/[0.07] cursor-pointer">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-red-500 text-[15px] font-extrabold text-white">
            N
          </div>
          <div className="min-w-0 flex-1">
            <strong className="block truncate text-[13px] text-white">
              Nguyễn Văn An
            </strong>
            <span className="text-[11px] text-[var(--edu-sidebar-text)]">
              GV Tin học
            </span>
          </div>
          <span className="whitespace-nowrap rounded-full bg-amber-500/25 px-[7px] py-0.5 text-[9px] font-bold text-amber-300">
            GV
          </span>
        </div>
      </div>
    </aside>
  )
}