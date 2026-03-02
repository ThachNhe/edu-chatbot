interface ChatRightPanelProps {
  onTopicClick: (topic: string) => void
}

const TOPICS = [
  { icon: '📦', label: 'Kiểu dữ liệu cơ bản', bg: 'bg-[#eff6ff]', text: 'text-[#1a56db]' },
  { icon: '🔁', label: 'Cấu trúc lặp', bg: 'bg-[#d1fae5]', text: 'text-[#065f46]' },
  { icon: '📊', label: 'Mảng 1D & 2D', bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  { icon: '🔧', label: 'Chương trình con', bg: 'bg-[#ede9fe]', text: 'text-[#4c1d95]' },
  { icon: '🗂️', label: 'Record & Set', bg: 'bg-[#fee2e2]', text: 'text-[#7f1d1d]' },
  { icon: '💾', label: 'Xử lý tệp', bg: 'bg-[#f0fdf4]', text: 'text-[#166534]' },
]

const PROGRESS = [
  { label: 'Lập trình cơ bản', pct: 42, color: '#1a56db' },
  { label: 'Cấu trúc dữ liệu', pct: 28, color: '#10b981' },
  { label: 'Cơ sở dữ liệu', pct: 18, color: '#f59e0b' },
  { label: 'Thuật toán', pct: 12, color: '#7c3aed' },
]

const QUICK_STATS = [
  { label: 'Câu hỏi hôm nay', value: '847', color: 'text-[var(--edu-primary)]' },
  { label: 'Thời gian TB/câu', value: '1.2s', color: 'text-[var(--edu-success)]' },
  { label: 'Độ hài lòng', value: '⭐ 4.8/5', color: 'text-[var(--edu-accent)]' },
]

export function ChatRightPanel({ onTopicClick }: ChatRightPanelProps) {
  return (
    <div className="flex flex-col overflow-hidden border-l border-[var(--edu-gray-200)] bg-white">
      <div className="border-b border-[var(--edu-gray-200)] px-4 pb-3 pt-4 text-[13px] font-extrabold">
        📌 Chủ đề nhanh
      </div>
      <div className="flex-1 overflow-y-auto p-3.5">
        {/* Topics */}
        <Section title="Chương trình học">
          {TOPICS.map((t) => (
            <button
              key={t.label}
              onClick={() => onTopicClick(t.label)}
              className={`mb-1.5 flex w-full items-center gap-1.5 rounded-lg ${t.bg} ${t.text} px-[11px] py-1.5 text-xs font-semibold transition-opacity hover:opacity-85`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </Section>

        {/* Progress */}
        <Section title="Tiến độ hỏi hôm nay">
          {PROGRESS.map((p) => (
            <div key={p.label} className="mb-2.5">
              <div className="mb-1 flex justify-between text-xs font-semibold">
                <span>{p.label}</span>
                <span className="text-[var(--edu-gray-400)]">{p.pct}%</span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${p.pct}%`, background: p.color }}
                />
              </div>
            </div>
          ))}
        </Section>

        {/* Quick Stats */}
        <Section title="Thống kê nhanh">
          <div className="flex flex-col gap-[7px]">
            {QUICK_STATS.map((s) => (
              <div
                key={s.label}
                className="flex justify-between rounded-lg bg-[var(--edu-gray-50)] px-2.5 py-[7px] text-xs"
              >
                <span className="font-semibold text-[var(--edu-gray-600)]">
                  {s.label}
                </span>
                <span className={`font-extrabold ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-[18px]">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1px] text-[var(--edu-gray-400)]">
        {title}
      </div>
      {children}
    </div>
  )
}