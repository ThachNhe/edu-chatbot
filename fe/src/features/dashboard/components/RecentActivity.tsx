interface ActivityItem {
  icon: string
  iconBg: string
  title: string
  meta: string
}

const ACTIVITIES: ActivityItem[] = [
  { icon: '📝', iconBg: '#eff6ff', title: 'Đề kiểm tra 15 phút – Chương 3: Cơ sở dữ liệu', meta: 'Vừa tạo • 10 câu hỏi • Lớp 12A1' },
  { icon: '✅', iconBg: '#d1fae5', title: 'Soạn xong bài 14: Kiểu dữ liệu có cấu trúc', meta: '2 giờ trước • Đã xuất bản' },
  { icon: '💬', iconBg: '#fef3c7', title: 'Học sinh Trần Thị B hỏi về vòng lặp FOR–DO', meta: '3 giờ trước • AI đã trả lời' },
  { icon: '📊', iconBg: '#ede9fe', title: 'Báo cáo kết quả thi giữa kỳ đã được xuất', meta: 'Hôm qua • 156 học sinh • TB: 7.4' },
  { icon: '🔔', iconBg: '#fee2e2', title: '3 câu hỏi mới từ học sinh chờ duyệt', meta: 'Hôm nay • Cần xem xét' },
]

export function RecentActivity() {
  return (
    <div className="rounded-[var(--edu-radius)] border border-[var(--edu-gray-100)] bg-white shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-100)] px-5 py-4">
        <div className="flex items-center gap-[7px] text-sm font-extrabold text-[var(--edu-gray-800)]">
          🕐 Hoạt động gần đây
        </div>
        <span className="cursor-pointer text-xs font-bold text-[var(--edu-primary)] hover:underline">
          Xem tất cả
        </span>
      </div>
      <div className="px-5 py-4">
        {ACTIVITIES.map((a, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 py-2.5 ${
              i < ACTIVITIES.length - 1
                ? 'border-b border-[var(--edu-gray-100)]'
                : ''
            }`}
          >
            <div
              className="mt-px flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] text-[15px]"
              style={{ background: a.iconBg }}
            >
              {a.icon}
            </div>
            <div>
              <p className="mb-0.5 text-[13px] font-semibold text-[var(--edu-gray-700)]">
                {a.title}
              </p>
              <span className="text-[11.5px] text-[var(--edu-gray-400)]">
                {a.meta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}