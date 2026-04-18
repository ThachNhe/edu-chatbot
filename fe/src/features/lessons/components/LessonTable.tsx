import type { Lesson, LessonStatus } from '../types/lesson.types'
import { CheckCircle2, Zap, Clock, Lightbulb, Repeat2, RefreshCw, Wrench, Cog, BarChart2, Save, Database, Eye, Pencil, Trash2 } from 'lucide-react'

const STATUS_CONFIG: Record<LessonStatus, { label: string; className: string }> = {
  done: { label: 'Hoàn thành', className: 'bg-[#d1fae5] text-[#10b981]' },
  wip: { label: 'Đang soạn', className: 'bg-[#fef3c7] text-[#d97706]' },
  todo: { label: 'Chưa làm', className: 'bg-[#f1f5f9] text-[#64748b]' },
}

const LESSONS: Lesson[] = [
  { number: '01', name: 'Kiểu dữ liệu cơ bản', desc: 'Integer, Real, Char, Boolean, String', icon: Lightbulb, iconBg: '#eff6ff', chapter: 'Chương 1', status: 'done', questionCount: 24 },
  { number: '02', name: 'Cấu trúc lặp FOR–DO', desc: 'Vòng lặp xác định số lần lặp', icon: Repeat2, iconBg: '#d1fae5', chapter: 'Chương 2', status: 'done', questionCount: 31 },
  { number: '03', name: 'Cấu trúc lặp WHILE–DO', desc: 'Vòng lặp kiểm tra điều kiện trước', icon: RefreshCw, iconBg: '#d1fae5', chapter: 'Chương 2', status: 'done', questionCount: 28 },
  { number: '04', name: 'Chương trình con – Procedure', desc: 'Khai báo và gọi thủ tục', icon: Wrench, iconBg: '#fef3c7', chapter: 'Chương 3', status: 'wip', questionCount: 15 },
  { number: '05', name: 'Chương trình con – Function', desc: 'Hàm có giá trị trả về', icon: Cog, iconBg: '#ede9fe', chapter: 'Chương 3', status: 'wip', questionCount: 12 },
  { number: '06', name: 'Mảng một chiều', desc: 'Khai báo, khởi tạo và xử lý mảng', icon: BarChart2, iconBg: '#fee2e2', chapter: 'Chương 4', status: 'done', questionCount: 36 },
  { number: '07', name: 'Xử lý tệp văn bản', desc: 'Đọc và ghi dữ liệu vào file', icon: Save, iconBg: '#f0fdf4', chapter: 'Chương 5', status: 'todo', questionCount: 0 },
  { number: '08', name: 'Cơ sở dữ liệu – Khái niệm', desc: 'Bảng, trường, bản ghi, khoá', icon: Database, iconBg: '#fdf2f8', chapter: 'Chương 5', status: 'todo', questionCount: 0 },
]

export function LessonTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
      {/* Header — khớp .table-header */}
      <div className="grid grid-cols-[40px_1fr_140px_110px_90px_100px] border-b border-[#e2e8f0] bg-[#f8fafc] px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.8px] text-[#94a3b8]">
        <div>#</div>
        <div>Tên bài học</div>
        <div>Chương</div>
        <div>Trạng thái</div>
        <div>Số câu hỏi</div>
        <div>Thao tác</div>
      </div>

      {/* Rows — khớp .table-row */}
      {LESSONS.map((lesson) => {
        const status = STATUS_CONFIG[lesson.status]
        return (
          <div
            key={lesson.number}
            className="grid cursor-pointer grid-cols-[40px_1fr_140px_110px_90px_100px] items-center border-b border-[#f1f5f9] px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[#f8fafc]"
          >
            {/* khớp .lesson-num */}
            <div className="text-[12.5px] font-bold text-[#94a3b8]">
              {lesson.number}
            </div>

            {/* khớp .lesson-name-cell */}
            <div className="flex items-center gap-[10px]">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px]"
                style={{ background: lesson.iconBg }}
              >
                <lesson.icon size={17} />
              </div>
              <div>
                {/* khớp .lesson-name */}
                <div className="text-[13.5px] font-bold text-[#1e293b]">
                  {lesson.name}
                </div>
                {/* khớp .lesson-desc */}
                <div className="mt-px text-[11.5px] text-[#94a3b8]">
                  {lesson.desc}
                </div>
              </div>
            </div>

            {/* chapter */}
            <div className="text-[12px] font-semibold text-[#475569]">
              {lesson.chapter}
            </div>

            {/* khớp .status-badge */}
            <div>
              <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold ${status.className}`}>
                {status.label}
              </span>
            </div>

            {/* question count */}
            <div className="text-[13px] font-bold text-[#334155]">
              {lesson.questionCount}
            </div>

            {/* khớp .row-actions */}
            <div className="flex gap-[5px]">
              <RowButton title="Xem"><Eye size={14} /></RowButton>
              <RowButton title="Sửa"><Pencil size={14} /></RowButton>
              <RowButton title="Xóa"><Trash2 size={14} /></RowButton>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RowButton({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button
      title={title}
      className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[#e2e8f0] bg-transparent text-sm transition-all hover:border-[#1a56db] hover:bg-[#eff6ff]"
    >
      {children}
    </button>
  )
}