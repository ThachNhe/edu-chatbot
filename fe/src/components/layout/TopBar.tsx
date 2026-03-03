import { useAppStore } from '@/stores/useAppStore'

export function TopBar() {
  const pageInfo = useAppStore((s) => s.pageInfo)

  return (
    <header
      className="flex h-[58px] flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-sm"
      style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}
    >
      <div>
        <h1 className="text-[15px] font-extrabold text-gray-800 leading-tight">
          {pageInfo.title}
        </h1>
        {pageInfo.subtitle && (
          <p className="text-[11.5px] text-gray-400 leading-none mt-0.5">
            {pageInfo.subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-sm">
          🔍
        </button>
        {/* Bell */}
        <div className="relative">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-sm">
            🔔
          </button>
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            3
          </span>
        </div>
        {/* Theme */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors text-sm">
          🌙
        </button>
      </div>
    </header>
  )
}