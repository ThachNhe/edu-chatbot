import { createFileRoute } from '@tanstack/react-router'
import { WelcomeBanner } from '@/features/dashboard/components/WelcomeBanner'
import { StatsGrid } from '@/features/dashboard/components/StatsGrid'
import { QuickAccess } from '@/features/dashboard/components/QuickAccess'
import { RecentActivity } from '@/features/dashboard/components/RecentActivity'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="custom-scrollbar h-full overflow-y-auto">
      <div className="mx-auto max-w-[1200px] p-6 animate-fade-in">
        <WelcomeBanner />
        <StatsGrid />
        <div className="grid grid-cols-[1fr_300px] gap-5">
          <div>
            <QuickAccess />
            <RecentActivity />
          </div>
          <WeeklySchedule />
        </div>
      </div>
    </div>
  )
}

function WeeklySchedule() {
  const events = [
    { day: 'T2', color: '#1a56db', bg: '#eff6ff', title: 'Lớp 12A1 – Tiết 3,4', sub: 'Bài 15: Thao tác với tệp' },
    { day: 'T4', color: '#f59e0b', bg: '#fef3c7', title: 'Lớp 12A3 – Tiết 1,2', sub: 'Kiểm tra 15 phút Chương 3' },
    { day: 'T6', color: '#10b981', bg: '#d1fae5', title: 'Lớp 12A3 – Tiết 5,6', sub: 'Ôn tập cuối chương' },
  ]
  return (
    <div className="space-y-5">
      {/* Schedule */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-[13px] font-extrabold text-gray-700">
          📅 Lịch tuần này
        </h3>
        <div className="space-y-2.5">
          {events.map((e) => (
            <div key={e.day} className="flex items-center gap-3 rounded-xl p-3"
              style={{ background: e.bg }}>
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold text-white"
                style={{ background: e.color }}>
                {e.day}
              </div>
              <div>
                <div className="text-[12px] font-bold text-gray-700">{e.title}</div>
                <div className="text-[11px] text-gray-500">{e.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}