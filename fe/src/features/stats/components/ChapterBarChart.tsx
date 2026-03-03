const CHAPTERS = [
  { label: 'Chương 1', pct: 82, color: '#1a56db', value: '8.2' },
  { label: 'Chương 2', pct: 74, color: '#0ea5e9', value: '7.4' },
  { label: 'Chương 3', pct: 68, color: '#10b981', value: '6.8' },
  { label: 'Chương 4', pct: 71, color: '#f59e0b', value: '7.1' },
  { label: 'Chương 5', pct: 76, color: '#7c3aed', value: '7.6' },
]

export function ChapterBarChart() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
      {/* khớp .card-header */}
      <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
        <div className="flex items-center gap-[7px] text-[14px] font-extrabold text-[#1e293b]">
          📊 Điểm TB theo chương
        </div>
        <span className="cursor-pointer text-[12px] font-bold text-[#1a56db] hover:underline">
          Xuất báo cáo
        </span>
      </div>

      {/* khớp .bar-chart { gap:10px; padding:16px 20px } */}
      <div className="flex flex-col gap-[10px] px-5 py-4">
        {CHAPTERS.map((ch) => (
          // khớp .bar-item { gap:12px }
          <div key={ch.label} className="flex items-center gap-3">
            {/* khớp .bar-label { width:100px } */}
            <div className="w-[100px] flex-shrink-0 truncate text-[12px] font-semibold text-[#475569]">
              {ch.label}
            </div>
            {/* khớp .bar-track { height:10px; background:var(--gray-100) } */}
            <div className="h-[10px] flex-1 overflow-hidden rounded-full bg-[#f1f5f9]">
              <div
                className="h-full rounded-full"
                style={{ width: `${ch.pct}%`, background: ch.color }}
              />
            </div>
            {/* khớp .bar-val { width:32px } */}
            <div className="w-8 flex-shrink-0 text-right text-[12px] font-bold text-[#334155]">
              {ch.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}