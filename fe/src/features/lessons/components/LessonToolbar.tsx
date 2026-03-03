export function LessonToolbar() {
  return (
    <div className="mb-5 flex items-center justify-between">
      {/* khớp .search-box */}
      <div className="flex w-[260px] items-center gap-[9px] rounded-[10px] border-[1.5px] border-[#e2e8f0] bg-white px-3.5 py-[9px] transition-colors focus-within:border-[#1a56db]">
        <span className="text-[#94a3b8]">🔍</span>
        <input
          type="text"
          placeholder="Tìm bài học..."
          className="w-full border-none bg-transparent font-['Nunito',sans-serif] text-[13px] text-[#334155] outline-none placeholder:text-[#94a3b8]"
        />
      </div>

      <div className="flex gap-2.5">
        {/* khớp .exam-select */}
        <select className="rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 font-['Nunito',sans-serif] text-[13px] text-[#334155] outline-none transition-colors focus:border-[#1a56db]">
          <option>Tất cả chương</option>
          <option>Chương 1: Kiểu dữ liệu</option>
          <option>Chương 2: Cấu trúc lặp</option>
          <option>Chương 3: Chương trình con</option>
          <option>Chương 4: Kiểu có cấu trúc</option>
          <option>Chương 5: Tệp và CSDL</option>
        </select>
        <select className="rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 font-['Nunito',sans-serif] text-[13px] text-[#334155] outline-none transition-colors focus:border-[#1a56db]">
          <option>Tất cả trạng thái</option>
          <option>Đã hoàn thành</option>
          <option>Đang soạn</option>
          <option>Chưa làm</option>
        </select>

        {/* khớp .gen-btn */}
        <button className="flex items-center gap-[7px] rounded-[9px] bg-[#1a56db] px-[22px] py-[9px] font-['Nunito',sans-serif] text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(26,86,219,0.25)] transition-all hover:-translate-y-px hover:bg-[#1d4ed8]">
          ＋ Thêm bài học
        </button>
      </div>
    </div>
  )
}