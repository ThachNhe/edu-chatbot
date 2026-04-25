import { Package, Repeat2, BarChart2, Wrench, FolderOpen, Save, Pin, ClipboardList, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

interface ChatRightPanelProps {
  onTopicClick: (topic: string) => void
}

const TOPICS: { icon: LucideIcon; label: string; bg: string; text: string }[] = [
  { icon: Package, label: 'Kiểu dữ liệu cơ bản', bg: 'bg-[#eff6ff]', text: 'text-[#1a56db]' },
  { icon: Repeat2, label: 'Cấu trúc lặp', bg: 'bg-[#d1fae5]', text: 'text-[#065f46]' },
  { icon: BarChart2, label: 'Mảng 1D & 2D', bg: 'bg-[#fef3c7]', text: 'text-[#92400e]' },
  { icon: Wrench, label: 'Chương trình con', bg: 'bg-[#ede9fe]', text: 'text-[#4c1d95]' },
  { icon: FolderOpen, label: 'Record & Set', bg: 'bg-[#fee2e2]', text: 'text-[#7f1d1d]' },
  { icon: Save, label: 'Xử lý tệp', bg: 'bg-[#f0fdf4]', text: 'text-[#166534]' },
]

const PROGRESS = [
  { label: 'Lập trình cơ bản', pct: 42, color: '#1a56db' },
  { label: 'Cấu trúc dữ liệu', pct: 28, color: '#10b981' },
  { label: 'Cơ sở dữ liệu', pct: 18, color: '#f59e0b' },
  { label: 'Thuật toán', pct: 12, color: '#7c3aed' },
]

const QUICK_STATS = [
  { label: 'Câu hỏi hôm nay', value: '847', valueColor: 'text-[#1a56db]' },
  { label: 'Thời gian TB/câu', value: '1.2s', valueColor: 'text-[#10b981]' },
  { label: 'Độ hài lòng', value: '⭐ 4.8/5', valueColor: 'text-[#f59e0b]' },
]

export function ChatRightPanel({ onTopicClick }: ChatRightPanelProps) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col overflow-hidden border-l border-[#e2e8f0] bg-white">
      {/* Header — khớp .rp-header */}
      <div className="flex-shrink-0 border-b border-[#e2e8f0] px-4 pb-3 pt-4 text-[13px] font-extrabold text-[#1e293b] flex items-center gap-1.5">
        <Pin size={14} /> Chủ đề nhanh
      </div>

      {/* Body — khớp .rp-body */}
      <div className="flex-1 overflow-y-auto p-3.5">

        {/* Quick navigation */}
        <Section title="Truy cập nhanh">
          <button
            onClick={() => navigate({ to: '/exam' })}
            className="mb-1.5 flex w-full items-center gap-1.5 rounded-lg px-[11px] py-[7px] text-[12px] font-semibold bg-[#eff6ff] text-[#1a56db] transition-opacity hover:opacity-85"
          >
            <ClipboardList size={13} />
            Tạo đề thi
          </button>
          <button
            onClick={() => navigate({ to: '/questions' })}
            className="mb-1.5 flex w-full items-center gap-1.5 rounded-lg px-[11px] py-[7px] text-[12px] font-semibold bg-[#d1fae5] text-[#065f46] transition-opacity hover:opacity-85"
          >
            <BookOpen size={13} />
            Ngân hàng câu hỏi
          </button>
        </Section>

        {/* Topics — khớp .topic-pill */}
        <Section title="Chương trình học">
          {TOPICS.map((t) => (
            <button
              key={t.label}
              onClick={() => onTopicClick(t.label)}
              className={`mb-1.5 flex w-full items-center gap-1.5 rounded-lg px-[11px] py-[6px] text-[12px] font-semibold transition-opacity hover:opacity-85 ${t.bg} ${t.text}`}
            >
              <t.icon size={13} />
              {t.label}
            </button>
          ))}
        </Section>

        {/* <Section title="Tiến độ hỏi hôm nay">
          {PROGRESS.map((p) => (
            <div key={p.label} className="mb-2.5">
              <div className="mb-[5px] flex justify-between text-[12px] font-semibold">
                <span className="text-[#334155]">{p.label}</span>
                <span className="text-[#94a3b8]">{p.pct}%</span>
              </div>
              <div className="h-[7px] w-full overflow-hidden rounded-full bg-[#f1f5f9]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${p.pct}%`, background: p.color }}
                />
              </div>
            </div>
          ))}
        </Section> */}

        {/* Quick Stats — khớp inline style trong .rp-body */}
        {/* <Section title="Thống kê nhanh">
          {QUICK_STATS.map((s) => (
            <div
              key={s.label}
              className="mb-1.5 flex items-center justify-between rounded-lg bg-[#f8fafc] px-2.5 py-[7px] text-[12px]"
            >
              <span className="font-semibold text-[#475569]">{s.label}</span>
              <span className={`font-extrabold ${s.valueColor}`}>{s.value}</span>
            </div>
          ))}
        </Section> */}

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-[18px]">
      {/* khớp .rp-section-title */}
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[1px] text-[#94a3b8]">
        {title}
      </div>
      {children}
    </div>
  )
}