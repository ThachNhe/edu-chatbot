const CHAPTERS = [
  { label: 'Chương 1', pct: 82, color: '#1a56db', value: '8.2' },
  { label: 'Chương 2', pct: 74, color: '#0ea5e9', value: '7.4' },
  { label: 'Chương 3', pct: 68, color: '#10b981', value: '6.8' },
  { label: 'Chương 4', pct: 71, color: '#f59e0b', value: '7.1' },
  { label: 'Chương 5', pct: 76, color: '#7c3aed', value: '7.6' },
]

export function ChapterBarChart() {
  return (
    <div className="overflow-hidden rounded-[var(--edu-radius)] border border-[var(--edu-gray-200)] bg-white shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-100)] px-5 py-4">
        <div className="flex items-center gap-[7px] text-sm font-extrabold text-[var(--edu-gray-800)]">
          📊 Điểm TB theo chương
        </div>
        <span className="cursor-pointer text-xs font-bold text-[var(--edu-primary)] hover:underline">
          Xuất báo cáo
        </span>
      </div>
      <div className="flex flex-col gap-2.5 px-5 py-4">
        {CHAPTERS.map((ch) => (
          <div key={ch.label} className="flex items-center gap-3">
            <div className="w-[100px] flex-shrink-0 truncate text-xs font-semibold text-[var(--edu-gray-600)]">
              {ch.label}
            </div>
            <div className="bar-track flex-1">
              <div
                className="bar-fill"
                style={{ width: `${ch.pct}%`, background: ch.color }}
              />
            </div>
            <div className="w-8 flex-shrink-0 text-right text-xs font-bold text-[var(--edu-gray-700)]">
              {ch.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}