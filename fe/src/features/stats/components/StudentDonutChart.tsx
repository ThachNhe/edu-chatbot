const LEGEND = [
  { label: 'Giỏi (≥8): 35%', color: '#10b981' },
  { label: 'Khá (6.5–8): 32%', color: '#1a56db' },
  { label: 'TB (5–6.5): 25%', color: '#f59e0b' },
  { label: 'Yếu (<5): 8%', color: '#ef4444' },
]

export function StudentDonutChart() {
  return (
    <div className="overflow-hidden rounded-[var(--edu-radius)] border border-[var(--edu-gray-200)] bg-white shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-100)] px-5 py-4">
        <div className="flex items-center gap-[7px] text-sm font-extrabold text-[var(--edu-gray-800)]">
          🍩 Phân loại học sinh
        </div>
      </div>
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
        <div className="flex flex-col gap-2">
          {LEGEND.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-xs font-semibold text-[var(--edu-gray-700)]"
            >
              <div
                className="h-2.5 w-2.5 flex-shrink-0 rounded-[3px]"
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