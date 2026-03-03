interface StatItem {
  icon: string
  iconBg: string
  trend: string
  trendType: 'up' | 'down'
  value: number | string
  valueColor: string
  label: string
}

const STATS: StatItem[] = [
  { icon: '📚', iconBg: 'linear-gradient(135deg,#dbeafe,#eff6ff)', trend: '↑ 2 tuần', trendType: 'up', value: 24, valueColor: '#1a56db', label: 'Bài học đã soạn' },
  { icon: '📝', iconBg: 'linear-gradient(135deg,#d1fae5,#ecfdf5)', trend: '↑ 5 đề', trendType: 'up', value: 18, valueColor: '#10b981', label: 'Đề thi đã tạo' },
  { icon: '🎓', iconBg: 'linear-gradient(135deg,#fef3c7,#fffbeb)', trend: '↑ 3', trendType: 'up', value: 156, valueColor: '#f59e0b', label: 'Học sinh đang học' },
  { icon: '🤖', iconBg: 'linear-gradient(135deg,#ede9fe,#f5f3ff)', trend: '↑ 12%', trendType: 'up', value: 847, valueColor: '#7c3aed', label: 'Lượt hỏi AI hôm nay' },
]

export function StatsGrid() {
  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-white bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-3 flex items-center justify-between">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xl shadow-sm"
              style={{ background: stat.iconBg }}
            >
              {stat.icon}
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${
              stat.trendType === 'up'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-500'
            }`}>
              {stat.trend}
            </span>
          </div>
          <div className="text-[26px] font-extrabold leading-none" style={{ color: stat.valueColor }}>
            {stat.value}
          </div>
          <div className="mt-1 text-[12px] font-medium text-gray-400">{stat.label}</div>
          {/* subtle bottom accent */}
          <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: stat.valueColor }} />
        </div>
      ))}
    </div>
  )
}