const LEGEND = [
  { label: 'Giỏi (≥8): 35%',    color: '#10b981' },
  { label: 'Khá (6.5–8): 32%',  color: '#1a56db' },
  { label: 'TB (5–6.5): 25%',   color: '#f59e0b' },
  { label: 'Yếu (<5): 8%',      color: '#ef4444' },
]

export function StudentDonutChart() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
      {/* khớp .card-header */}
      <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
        <div className="flex items-center gap-[7px] text-[14px] font-extrabold text-[#1e293b]">
          🍩 Phân loại học sinh
        </div>
      </div>

      {/* khớp .donut-wrap { gap:24px; padding:20px } */}
      <div className="flex items-center justify-center gap-6 p-5">
        <svg className="flex-shrink-0" width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="45" fill="none" stroke="#e2e8f0" strokeWidth="18" />
          <circle cx="60" cy="60" r="45" fill="none" stroke="#10b981" strokeWidth="18"
            strokeDasharray="99 183" strokeDashoffset="0" transform="rotate(-90 60 60)" />
          <circle cx="60" cy="60" r="45" fill="none" stroke="#1a56db" strokeWidth="18"
            strokeDasharray="71.6 210" strokeDashoffset="-99" transform="rotate(-90 60 60)" />
          <circle cx="60" cy="60" r="45" fill="none" stroke="#f59e0b" strokeWidth="18"
            strokeDasharray="56.5 226" strokeDashoffset="-170.6" transform="rotate(-90 60 60)" />
          <circle cx="60" cy="60" r="45" fill="none" stroke="#ef4444" strokeWidth="18"
            strokeDasharray="56.5 226" strokeDashoffset="-227.1" transform="rotate(-90 60 60)" />
          <text x="60" y="56" textAnchor="middle" fontSize="14" fontWeight="800" fill="#1e293b">
            156
          </text>
          <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#94a3b8">
            học sinh
          </text>
        </svg>

        {/* khớp .donut-legend { gap:8px } */}
        <div className="flex flex-col gap-2">
          {LEGEND.map((item) => (
            // khớp .legend-item { gap:8px; font-size:12px }
            <div
              key={item.label}
              className="flex items-center gap-2 text-[12px] font-semibold text-[#334155]"
            >
              {/* khớp .legend-dot { width:10px; height:10px; border-radius:3px } */}
              <div
                className="h-[10px] w-[10px] flex-shrink-0 rounded-[3px]"
                style={{ background: item.color }}
              />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}