import type { Lesson, LessonStatus } from '../types/lesson.types'

const STATUS_CONFIG: Record<LessonStatus, { label: string; className: string }> = {
  done: { label: '✅ Hoàn thành', className: 'bg-[var(--edu-success-soft)] text-[var(--edu-success)]' },
  wip: { label: '⚡ Đang soạn', className: 'bg-[var(--edu-accent-soft)] text-[#d97706]' },
  todo: { label: '⏳ Chưa làm', className: 'bg-[var(--edu-gray-100)] text-[var(--edu-gray-500)]' },
}

const LESSONS: Lesson[] = [
  { number: '01', name: 'Kiểu dữ liệu cơ bản', desc: 'Integer, Real, Char, Boolean, String', icon: '💡', iconBg: '#eff6ff', chapter: 'Chương 1', status: 'done', questionCount: 24 },
  { number: '02', name: 'Cấu trúc lặp FOR–DO', desc: 'Vòng lặp xác định số lần lặp', icon: '🔁', iconBg: '#d1fae5', chapter: 'Chương 2', status: 'done', questionCount: 31 },
  { number: '03', name: 'Cấu trúc lặp WHILE–DO', desc: 'Vòng lặp kiểm tra điều kiện trước', icon: '🔄', iconBg: '#d1fae5', chapter: 'Chương 2', status: 'done', questionCount: 28 },
  { number: '04', name: 'Chương trình con – Procedure', desc: 'Khai báo và gọi thủ tục', icon: '🔧', iconBg: '#fef3c7', chapter: 'Chương 3', status: 'wip', questionCount: 15 },
  { number: '05', name: 'Chương trình con – Function', desc: 'Hàm có giá trị trả về', icon: '⚙️', iconBg: '#ede9fe', chapter: 'Chương 3', status: 'wip', questionCount: 12 },
  { number: '06', name: 'Mảng một chiều', desc: 'Khai báo, khởi tạo và xử lý mảng', icon: '📊', iconBg: '#fee2e2', chapter: 'Chương 4', status: 'done', questionCount: 36 },
  { number: '07', name: 'Xử lý tệp văn bản', desc: 'Đọc và ghi dữ liệu vào file', icon: '💾', iconBg: '#f0fdf4', chapter: 'Chương 5', status: 'todo', questionCount: 0 },
  { number: '08', name: 'Cơ sở dữ liệu – Khái niệm', desc: 'Bảng, trường, bản ghi, khoá', icon: '🗄️', iconBg: '#fdf2f8', chapter: 'Chương 5', status: 'todo', questionCount: 0 },
]

export function LessonTable() {
  return (
    <div className="overflow-hidden rounded-[var(--edu-radius)] border border-[var(--edu-gray-200)] bg-white shadow-[var(--edu-shadow-sm)]">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_140px_110px_90px_100px] border-b border-[var(--edu-gray-200)] bg-[var(--edu-gray-50)] px-5 py-3 text-[11.5px] font-bold uppercase tracking-[0.8px] text-[var(--edu-gray-400)]">
        <div>#</div>
        <div>Tên bài học</div>
        <div>Chương</div>
        <div>Trạng thái</div>
        <div>Số câu hỏi</div>
        <div>Thao tác</div>
      </div>

      {/* Rows */}
      {LESSONS.map((lesson) => {
        const status = STATUS_CONFIG[lesson.status]
        return (
          <div
            key={lesson.number}
            className="grid cursor-pointer grid-cols-[40px_1fr_140px_110px_90px_100px] items-center border-b border-[var(--edu-gray-100)] px-5 py-3.5 transition-colors last:border-b-0 hover:bg-[var(--edu-gray-50)]"
          >
            <div className="text-[12.5px] font-bold text-[var(--edu-gray-400)]">
              {lesson.number}
            </div>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] text-[17px]"
                style={{ background: lesson.iconBg }}
              >
                {lesson.icon}
              </div>
              <div>
                <div className="text-[13.5px] font-bold text-[var(--edu-gray-800)]">
                  {lesson.name}
                </div>
                <div className="mt-px text-[11.5px] text-[var(--edu-gray-400)]">
                  {lesson.desc}
                </div>
              </div>
            </div>
            <div className="text-xs font-semibold text-[var(--edu-gray-600)]">
              {lesson.chapter}
            </div>
            <div>
              <span
                className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <div className="text-[13px] font-bold text-[var(--edu-gray-700)]">
              {lesson.questionCount}
            </div>
            <div className="flex gap-[5px]">
              <RowButton title="Xem">👁️</RowButton>
              <RowButton title="Sửa">✏️</RowButton>
              <RowButton title="Xóa">🗑️</RowButton>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RowButton({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      title={title}
      className="flex h-[30px] w-[30px] items-center justify-center rounded-[7px] border border-[var(--edu-gray-200)] bg-transparent text-sm transition-all hover:border-[var(--edu-primary)] hover:bg-[var(--edu-primary-soft)]"
    >
      {children}
    </button>
  )
}