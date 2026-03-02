const STATS = [
  { icon: '🎓', iconBg: '#eff6ff', trend: '↑ 4.2%', trendType: 'up' as const, value: '7.4', valueColor: '#1a56db', label: 'Điểm TB toàn trường' },
  { icon: '✅', iconBg: '#d1fae5', trend: '↑ 6%', trendType: 'up' as const, value: '78%', valueColor: '#10b981', label: 'Tỉ lệ đạt yêu cầu' },
  { icon: '❗', iconBg: '#fee2e2', trend: '↓ 2%', trendType: 'down' as const, value: '8', valueColor: '#ef4444', label: 'Học sinh cần hỗ trợ' },
]

export function StatsOverview() {
  return (
    <div className="mb-5 grid grid-cols-3 gap-4">
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