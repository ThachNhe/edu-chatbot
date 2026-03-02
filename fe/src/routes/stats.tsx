import { createFileRoute } from '@tanstack/react-router'
import {
  StatsOverview,
  ChapterBarChart,
  StudentDonutChart,
  StudentRankingTable,
} from '@/features/stats'

export const Route = createFileRoute('/stats')({
  component: StatsPage,
})

function StatsPage() {
  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto p-6 animate-fade-in">
      <StatsOverview />
      <div className="grid grid-cols-2 gap-4">
        <ChapterBarChart />
        <StudentDonutChart />
        <StudentRankingTable />
      </div>
    </div>
  )
}