import { createFileRoute } from '@tanstack/react-router'
import {
  WelcomeBanner,
  StatsGrid,
  QuickAccess,
  RecentActivity,
  WeekSchedule,
  MonthGoals,
} from '@/features/dashboard'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto p-6 animate-fade-in">
      <WelcomeBanner />
      <StatsGrid />
      <QuickAccess />
      <div className="grid grid-cols-[1fr_340px] gap-5">
        <RecentActivity />
        <div className="flex flex-col gap-4">
          <WeekSchedule />
          <MonthGoals />
        </div>
      </div>
    </div>
  )
}