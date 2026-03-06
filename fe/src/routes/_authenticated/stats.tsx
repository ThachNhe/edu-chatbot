import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  StatsOverview,
  ChapterBarChart,
  StudentDonutChart,
  StudentRankingTable,
} from '@/features/stats'
import { useAppStore } from '@/stores/useAppStore'

export const Route = createFileRoute('/_authenticated/stats')({
  component: StatsPage,
})

function StatsPage() {
  const setCurrentPage = useAppStore((s) => s.setCurrentPage)

  useEffect(() => {
    setCurrentPage('stats')
  }, [setCurrentPage])

  return (
    <div className="custom-scrollbar h-full overflow-y-auto">
      <div className="mx-auto max-w-[1200px] p-6 animate-fade-in">
        {/* Stats Cards */}
        <StatsOverview />

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <ChapterBarChart />
          <StudentDonutChart />
        </div>

        {/* Ranking Table full width */}
        <StudentRankingTable />
      </div>
    </div>
  )
}