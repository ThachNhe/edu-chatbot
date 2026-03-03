const STATS = [
  { icon: '🎓', iconBg: '#eff6ff', trend: '↑ 4.2%', trendType: 'up' as const, value: '7.4', valueColor: '#1a56db', label: 'Điểm TB toàn trường' },
  { icon: '✅', iconBg: '#d1fae5', trend: '↑ 6%',   trendType: 'up' as const, value: '78%', valueColor: '#10b981', label: 'Tỉ lệ đạt yêu cầu' },
  { icon: '❗', iconBg: '#fee2e2', trend: '↓ 2%',   trendType: 'down' as const, value: '8', valueColor: '#ef4444', label: 'Học sinh cần hỗ trợ' },
]

export function StatsOverview() {
  return (
    <div className="mb-5 grid grid-cols-3 gap-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-[#f1f5f9] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]"
        >
          {/* khớp .stat-top { margin-bottom:14px } */}
          <div className="mb-[14px] flex items-center justify-between">
            {/* khớp .stat-icon { width:42px; height:42px; border-radius:11px } */}
            <div
              className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] text-xl"
              style={{ background: stat.iconBg }}
            >
              {stat.icon}
            </div>
            {/* khớp .stat-trend */}
            <span
              className={`rounded-full px-2 py-[3px] text-[11.5px] font-bold ${
                stat.trendType === 'up'
                  ? 'bg-[#d1fae5] text-[#10b981]'
                  : 'bg-[#fee2e2] text-[#ef4444]'
              }`}
            >
              {stat.trend}
            </span>
          </div>
          {/* khớp .stat-value { font-size:28px; font-weight:900 } */}
          <div
            className="mb-[3px] text-[28px] font-black leading-none"
            style={{ color: stat.valueColor }}
          >
            {stat.value}
          </div>
          {/* khớp .stat-label { font-size:12px } */}
          <div className="text-[12px] font-semibold text-[#64748b]">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}