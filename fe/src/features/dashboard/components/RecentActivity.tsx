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
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[13px] font-extrabold text-gray-700">
          🕐 Hoạt động gần đây
        </h3>
        <button className="text-[11.5px] font-semibold text-blue-500 hover:text-blue-700 transition-colors">
          Xem tất cả →
        </button>
      </div>
      <div className="space-y-1">
        {ACTIVITIES.map((a, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50 cursor-pointer"
          >
            <div
              className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[14px]"
              style={{ background: a.iconBg }}
            >
              {a.icon}
            </div>
            <div className="min-w-0">
              <div className="text-[12.5px] font-semibold text-gray-700 leading-snug">{a.title}</div>
              <div className="mt-0.5 text-[11px] text-gray-400">{a.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}