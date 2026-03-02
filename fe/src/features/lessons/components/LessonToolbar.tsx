export function LessonToolbar() {
  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex w-[260px] items-center gap-[9px] rounded-[10px] border-[1.5px] border-[var(--edu-gray-200)] bg-white px-3.5 py-[9px] transition-colors focus-within:border-[var(--edu-primary)]">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Tìm bài học..."
          className="w-full border-none bg-transparent text-[13px] text-[var(--edu-gray-700)] outline-none placeholder:text-[var(--edu-gray-400)]"
        />
      </div>

      <div className="flex gap-2.5">
        <select className="rounded-lg border-[1.5px] border-[var(--edu-gray-200)] bg-[var(--edu-gray-50)] px-3 py-2 text-[13px] text-[var(--edu-gray-700)] outline-none focus:border-[var(--edu-primary)]">
          <option>Tất cả chương</option>
          <option>Chương 1: Kiểu dữ liệu</option>
          <option>Chương 2: Cấu trúc lặp</option>
          <option>Chương 3: Chương trình con</option>
          <option>Chương 4: Kiểu có cấu trúc</option>
          <option>Chương 5: Tệp và CSDL</option>
        </select>
        <select className="rounded-lg border-[1.5px] border-[var(--edu-gray-200)] bg-[var(--edu-gray-50)] px-3 py-2 text-[13px] text-[var(--edu-gray-700)] outline-none focus:border-[var(--edu-primary)]">
          <option>Tất cả trạng thái</option>
          <option>Đã hoàn thành</option>
          <option>Đang soạn</option>
          <option>Chưa làm</option>
        </select>
        <button className="flex items-center gap-[7px] rounded-[9px] bg-[var(--edu-primary)] px-[22px] py-[9px] text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(26,86,219,0.25)] transition-all hover:-translate-y-px hover:bg-[#1d4ed8]">
          ＋ Thêm bài học
        </button>
      </div>
    </div>
  )
}