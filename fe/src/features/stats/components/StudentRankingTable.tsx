import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useStudentRanking } from '../hooks/useStatsData'

// helper for colors
const mapColor = (avg: number) => {
  if (avg >= 8) return { level: 'high', color: 'text-[#10b981]' }
  if (avg >= 6.5) return { level: 'high', color: 'text-[#1a56db]' }
  if (avg >= 5) return { level: 'mid', color: 'text-[#d97706]' }
  return { level: 'low', color: 'text-[#ef4444]' }
}

const BADGES = [
  { test: (avg: number) => avg >= 9, icon: '⭐' },
  { test: (avg: number) => avg < 5, icon: '⚠️' },
]

export function StudentRankingTable() {
  const [filterClass, setFilterClass] = useState<string>('')
  const { data: students, isLoading } = useStudentRanking(filterClass || undefined)

  // Get unique columns (exam titles) from students' scores
  const columns = Array.from(
    new Set(students?.flatMap(s => s.scores.map(sc => sc.exam_title)) || [])
  )

  return (
    <div className="col-span-2 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
        <div className="flex items-center gap-[7px] text-[14px] font-extrabold text-[#1e293b]">
          🏆 Bảng điểm học sinh
        </div>
        <div className="flex gap-2">
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-[5px] font-['Nunito',sans-serif] text-[12px] text-[#334155] outline-none focus:border-[#1a56db]"
          >
            <option value="">Tất cả các lớp</option>
            <option value="12A1">Lớp 12A1</option>
            <option value="12A2">Lớp 12A2</option>
            <option value="12A3">Lớp 12A3</option>
          </select>
          <button className="flex items-center gap-[7px] rounded-[9px] border-[1.5px] border-[#e2e8f0] bg-white px-3.5 py-[5px] font-['Nunito',sans-serif] text-[12px] font-bold text-[#475569] transition-all hover:border-[#1a56db] hover:text-[#1a56db]">
            📥 Xuất Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid items-center bg-[#f8fafc] px-5 py-[11px] text-[11px] font-bold uppercase tracking-[0.8px] text-[#94a3b8]"
          style={{ gridTemplateColumns: `36px 1fr repeat(${columns.length}, 80px) 80px` }}
        >
          <div />
          <div>Học sinh</div>
          {columns.map(col => (
            <div key={col} className="text-center truncate px-1" title={col}>
              {col}
            </div>
          ))}
          <div className="text-center">Điểm TB</div>
        </div>

        {isLoading ? (
          <div className="divide-y divide-[#f1f5f9]">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="grid items-center px-5 py-[11px] text-[13px]"
                style={{ gridTemplateColumns: `36px 1fr repeat(${columns.length || 3}, 80px) 80px` }}
              >
                <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-200" />
                <div className="mr-4 h-4 animate-pulse rounded bg-gray-100" />
                {[...Array((columns.length || 3) + 1)].map((_, j) => (
                  <div key={j} className="h-4 w-8 justify-self-center animate-pulse rounded bg-gray-100" />
                ))}
              </div>
            ))}
          </div>
        ) : !students || students.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-gray-500">
            Không tìm thấy học sinh nào
          </div>
        ) : (
          <div className="divide-y divide-[#f1f5f9]">
            {students.map((s) => {
              const avgColor = mapColor(s.avg_score)
              const badge = BADGES.find(b => b.test(s.avg_score))?.icon
              
              // We just use a static gradient palette based on the char code
              const bgIndex = s.avatar.charCodeAt(0) % 5
              const gradients = [
                'from-amber-500 to-red-500',
                'from-[#1a56db] to-[#0ea5e9]',
                'from-[#10b981] to-[#06b6d4]',
                'from-[#7c3aed] to-[#ec4899]',
                'from-[#ef4444] to-[#f97316]'
              ]
              
              return (
                <div
                  key={s.student_id}
                  className="grid items-center px-5 py-[11px] text-[13px] hover:bg-gray-50 transition-colors"
                  style={{ gridTemplateColumns: `36px 1fr repeat(${columns.length}, 80px) 80px` }}
                >
                  <div
                    className={cn(
                      'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[13px] font-bold text-white',
                      gradients[bgIndex],
                    )}
                  >
                    {s.avatar}
                  </div>

                  <div className="min-w-0 pr-4">
                    <div className="truncate font-bold text-[#1e293b]">{s.name}</div>
                    <div className="text-[11px] text-gray-400">{s.class_name || '—'}</div>
                  </div>

                  {columns.map(col => {
                    const score = s.scores.find(sc => sc.exam_title === col)?.score
                    if (score === undefined) return <div key={col} className="text-center text-gray-300">—</div>
                    const scColor = mapColor(score)
                    return (
                      <div key={col} className={cn('text-center font-bold', scColor.color)}>
                        {score}
                      </div>
                    )
                  })}

                  <div className={cn('text-center font-bold', avgColor.color)}>
                    {s.avg_score} {badge}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}