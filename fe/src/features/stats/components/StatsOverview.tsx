import { useStatsOverview } from '../hooks/useStatsData'

export function StatsOverview() {
  const { data, isLoading } = useStatsOverview()

  const stats = data
    ? [
        {
          icon: '🎓',
          iconBg: '#eff6ff',
          trend: `${data.avg_score >= 7 ? '↑' : '↓'} ${data.avg_score}`,
          trendType: data.avg_score >= 7 ? ('up' as const) : ('down' as const),
          value: data.avg_score.toFixed(1),
          valueColor: '#1a56db',
          label: 'Điểm TB toàn trường',
        },
        {
          icon: '✅',
          iconBg: '#d1fae5',
          trend: `${data.pass_rate >= 70 ? '↑' : '↓'} ${data.pass_rate}%`,
          trendType: data.pass_rate >= 70 ? ('up' as const) : ('down' as const),
          value: `${data.pass_rate}%`,
          valueColor: '#10b981',
          label: 'Tỉ lệ đạt yêu cầu',
        },
        {
          icon: '❗',
          iconBg: '#fee2e2',
          trend: `${data.need_support_count > 0 ? '↑' : '↓'} ${data.need_support_count}`,
          trendType: data.need_support_count > 0 ? ('down' as const) : ('up' as const),
          value: String(data.need_support_count),
          valueColor: '#ef4444',
          label: 'Học sinh cần hỗ trợ',
        },
      ]
    : []

  return (
    <div className="mb-5 grid grid-cols-3 gap-4">
      {isLoading
        ? [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-[#f1f5f9] bg-white p-5 shadow-sm">
              <div className="mb-4 flex justify-between">
                <div className="h-[42px] w-[42px] rounded-[11px] bg-gray-100" />
                <div className="h-6 w-14 rounded-full bg-gray-100" />
              </div>
              <div className="mb-1 h-8 w-20 rounded bg-gray-100" />
              <div className="h-3 w-32 rounded bg-gray-100" />
            </div>
          ))
        : stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#f1f5f9] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]"
            >
              <div className="mb-[14px] flex items-center justify-between">
                <div
                  className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] text-xl"
                  style={{ background: stat.iconBg }}
                >
                  {stat.icon}
                </div>
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
              <div className="mb-[3px] text-[28px] font-black leading-none" style={{ color: stat.valueColor }}>
                {stat.value}
              </div>
              <div className="text-[12px] font-semibold text-[#64748b]">{stat.label}</div>
            </div>
          ))}
    </div>
  )
}