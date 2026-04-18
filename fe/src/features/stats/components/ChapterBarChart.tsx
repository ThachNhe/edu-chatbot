import { useChapterScores } from '../hooks/useStatsData'
import { BarChart2 } from 'lucide-react'

export function ChapterBarChart() {
  const { data: chapters, isLoading } = useChapterScores()

  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
        <div className="flex items-center gap-[7px] text-[14px] font-extrabold text-[#1e293b]">
          <BarChart2 size={16} /> Điểm TB theo chuyên đề
        </div>
        <span className="cursor-pointer text-[12px] font-bold text-[#1a56db] hover:underline">
          Xuất báo cáo
        </span>
      </div>

      <div className="flex flex-col gap-[10px] px-5 py-4">
        {isLoading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-[100px] animate-pulse rounded bg-gray-100" />
                <div className="h-[10px] flex-1 animate-pulse rounded-full bg-gray-100" />
                <div className="h-4 w-8 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!chapters || chapters.length === 0) && (
          <p className="py-4 text-center text-[12px] text-gray-400">Chưa có dữ liệu bài thi</p>
        )}

        {!isLoading &&
          chapters?.map((ch, i) => {
            // Pick a color from a predefined palette based on index
            const colors = ['#1a56db', '#0ea5e9', '#10b981', '#f59e0b', '#7c3aed', '#ec4899', '#f43f5e']
            const color = colors[i % colors.length]

            return (
              <div key={ch.label} className="flex items-center gap-3">
                <div className="w-[100px] flex-shrink-0 truncate text-[12px] font-semibold text-[#475569]" title={ch.label}>
                  {ch.label}
                </div>
                <div className="h-[10px] flex-1 overflow-hidden rounded-full bg-[#f1f5f9]">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${ch.pct}%`, background: color }}
                  />
                </div>
                <div className="w-8 flex-shrink-0 text-right text-[12px] font-bold text-[#334155]">
                  {ch.avg.toFixed(1)}
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}