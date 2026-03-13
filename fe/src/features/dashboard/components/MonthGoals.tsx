import { useDashboardSummary } from '../hooks/useDashboardData'

export function MonthGoals() {
  const { data, isLoading } = useDashboardSummary()

  const goals = data
    ? [
        { label: 'Bài học hoàn thành', current: data.lesson_count, target: data.lesson_goal, color: 'var(--edu-primary)' },
        { label: 'Đề thi đã tạo', current: data.exam_count, target: data.exam_goal, color: 'var(--edu-success)' },
        { label: 'Câu hỏi AI xử lý', current: data.ai_query_count, target: data.ai_query_goal, color: 'var(--edu-purple)' },
      ]
    : [
        { label: 'Bài học hoàn thành', current: 0, target: 30, color: 'var(--edu-primary)' },
        { label: 'Đề thi đã tạo', current: 0, target: 20, color: 'var(--edu-success)' },
        { label: 'Câu hỏi AI xử lý', current: 0, target: 1000, color: 'var(--edu-purple)' },
      ]

  return (
    <div className="rounded-[var(--edu-radius)] border border-[var(--edu-gray-100)] bg-white shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-100)] px-5 py-4">
        <div className="flex items-center gap-[7px] text-sm font-extrabold text-[var(--edu-gray-800)]">
          🎯 Mục tiêu tháng
        </div>
      </div>
      <div className="px-5 py-4">
        {goals.map((g, i) => {
          const pct = g.target > 0 ? Math.min(Math.round((g.current / g.target) * 100), 100) : 0
          return (
            <div key={g.label} className={i < goals.length - 1 ? 'mb-2.5' : ''}>
              <div className="mb-[5px] flex justify-between text-xs font-semibold">
                <span>{g.label}</span>
                <span className="text-[var(--edu-gray-400)]">
                  {isLoading ? '...' : `${g.current}/${g.target}`}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: isLoading ? '0%' : `${pct}%`,
                    background: g.color,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}