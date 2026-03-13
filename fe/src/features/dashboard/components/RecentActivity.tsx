import { useRecentActivity } from '../hooks/useDashboardData'

export function RecentActivity() {
  const { data: activities, isLoading } = useRecentActivity()

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[13px] font-extrabold text-gray-700">
          🕐 Hoạt động gần đây
        </h3>
        <button className="text-[11.5px] font-semibold text-blue-500 hover:text-blue-700 transition-colors">
          Xem tất cả →
        </button>
      </div>
      <div className="space-y-1">
        {isLoading && (
          <>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl px-3 py-2.5">
                <div className="mt-0.5 h-8 w-8 flex-shrink-0 animate-pulse rounded-lg bg-gray-100" />
                <div className="flex-1 space-y-1.5 py-1">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </>
        )}
        {!isLoading && activities?.length === 0 && (
          <p className="py-4 text-center text-[12px] text-gray-400">Chưa có hoạt động nào</p>
        )}
        {!isLoading &&
          activities?.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50 cursor-pointer"
            >
              <div
                className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[14px]"
                style={{ background: a.icon_bg }}
              >
                {a.icon}
              </div>
              <div className="min-w-0">
                <div className="text-[12.5px] font-semibold text-gray-700 leading-snug">{a.title}</div>
                <div className="mt-0.5 text-[11px] text-gray-400">{a.meta}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}