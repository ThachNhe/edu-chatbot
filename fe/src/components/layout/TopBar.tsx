import { useRouterState } from '@tanstack/react-router'

const PAGE_INFO: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Trang chủ', subtitle: 'Xin chào, hôm nay bạn muốn làm gì?' },
  '/chat': { title: 'Trợ lý AI Chat', subtitle: 'Hỏi bất kỳ điều gì về Tin học 12' },
  '/exam': { title: 'Tạo đề thi / Bài tập', subtitle: 'Sinh đề thi tự động bằng AI' },
  '/lessons': {
    title: 'Quản lý Bài học',
    subtitle: '24 bài học • 2 đang soạn • 6 chưa làm',
  },
  '/stats': {
    title: 'Thống kê & Báo cáo',
    subtitle: '156 học sinh • HK1 2025–2026',
  },
}

export function Topbar() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const info = PAGE_INFO[currentPath] ?? { title: '', subtitle: '' }

  return (
    <div className="flex h-[58px] flex-shrink-0 items-center justify-between border-b border-[var(--edu-gray-200)] bg-white px-7 shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-[17px] font-extrabold text-[var(--edu-gray-800)]">
            {info.title}
          </div>
          <div className="text-xs font-medium text-[var(--edu-gray-400)]">
            {info.subtitle}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <IconButton title="Thông báo" hasNotif>
          🔔
        </IconButton>
        <IconButton title="Tìm kiếm">🔍</IconButton>
        <IconButton title="Hỗ trợ">💬</IconButton>
      </div>
    </div>
  )
}

function IconButton({
  children,
  title,
  hasNotif,
}: {
  children: React.ReactNode
  title: string
  hasNotif?: boolean
}) {
  return (
    <button
      className="relative flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--edu-gray-100)] text-base text-[var(--edu-gray-500)] transition-all hover:bg-[var(--edu-primary-soft)] hover:text-[var(--edu-primary)]"
      title={title}
    >
      {children}
      {hasNotif && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-[var(--edu-danger)]" />
      )}
    </button>
  )
}