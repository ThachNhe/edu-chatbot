const GOALS = [
  { label: 'Bài học hoàn thành', current: 24, target: 30, color: 'var(--edu-primary)' },
  { label: 'Đề thi đã tạo', current: 18, target: 20, color: 'var(--edu-success)' },
  { label: 'Câu hỏi AI xử lý', current: 847, target: 1000, color: 'var(--edu-purple)' },
]

export function MonthGoals() {
  return (
    <div className="rounded-[var(--edu-radius)] border border-[var(--edu-gray-100)] bg-white shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-100)] px-5 py-4">
        <div className="flex items-center gap-[7px] text-sm font-extrabold text-[var(--edu-gray-800)]">
          🎯 Mục tiêu tháng
        </div>
      </div>
      <div className="px-5 py-4">
        {GOALS.map((g, i) => {
          const pct = Math.round((g.current / g.target) * 100)
          return (
            <div
              key={g.label}
              className={i < GOALS.length - 1 ? 'mb-2.5' : ''}
            >
              <div className="mb-[5px] flex justify-between text-xs font-semibold">
                <span>{g.label}</span>
                <span className="text-[var(--edu-gray-400)]">
                  {g.current}/{g.target}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${pct}%`, background: g.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}