interface StatItem {
  icon: string
  iconBg: string
  trend: string
  trendType: 'up' | 'down'
  value: string | number
  valueColor: string
  label: string
}

const STATS: StatItem[] = [
  { icon: '📚', iconBg: '#eff6ff', trend: '↑ 2 tuần', trendType: 'up', value: 24, valueColor: '#1a56db', label: 'Bài học đã soạn' },
  { icon: '📝', iconBg: '#d1fae5', trend: '↑ 5 đề', trendType: 'up', value: 18, valueColor: '#10b981', label: 'Đề thi đã tạo' },
  { icon: '🎓', iconBg: '#fef3c7', trend: '↑ 3', trendType: 'up', value: 156, valueColor: '#f59e0b', label: 'Học sinh đang học' },
  { icon: '🤖', iconBg: '#ede9fe', trend: '↑ 12%', trendType: 'up', value: 847, valueColor: '#7c3aed', label: 'Lượt hỏi AI hôm nay' },
]

export function StatsGrid() {
  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[var(--edu-radius)] border border-[var(--edu-gray-100)] bg-white p-5 shadow-[var(--edu-shadow-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--edu-shadow)]"
        >
          <div className="mb-3.5 flex items-center justify-between">
            <div
              className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] text-xl"
              style={{ background: stat.iconBg }}
            >
              {stat.icon}
            </div>
            <span
              className={`rounded-full px-2 py-[3px] text-[11.5px] font-bold ${
                stat.trendType === 'up'
                  ? 'bg-[var(--edu-success-soft)] text-[var(--edu-success)]'
                  : 'bg-[var(--edu-danger-soft)] text-[var(--edu-danger)]'
              }`}
            >
              {stat.trend}
            </span>
          </div>
          <div
            className="mb-[3px] text-[28px] font-black"
            style={{ color: stat.valueColor }}
          >
            {stat.value}
          </div>
          <div className="text-xs font-semibold text-[var(--edu-gray-500)]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}