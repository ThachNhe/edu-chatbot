interface ExamToolbarProps {
  onGenerate: () => void
}

export function ExamToolbar({ onGenerate }: ExamToolbarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-5 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
      <label className="text-[12.5px] font-bold text-[#475569]">Chủ đề:</label>
      <SelectField>
        <option>Cấu trúc lặp (FOR, WHILE, REPEAT)</option>
        <option>Mảng một chiều</option>
        <option>Mảng hai chiều</option>
        <option>Chương trình con</option>
        <option>Kiểu Record</option>
        <option>Xử lý tệp</option>
        <option>Cơ sở dữ liệu</option>
      </SelectField>

      <label className="text-[12.5px] font-bold text-[#475569]">Số câu:</label>
      <input
        type="number"
        defaultValue={10}
        min={5}
        max={40}
        className="w-[70px] rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 font-['Nunito',sans-serif] text-[13px] text-[#334155] outline-none transition-colors focus:border-[#1a56db]"
      />

      <label className="text-[12.5px] font-bold text-[#475569]">Mức độ:</label>
      <SelectField>
        <option>Hỗn hợp</option>
        <option>Dễ</option>
        <option>Trung bình</option>
        <option>Khó</option>
      </SelectField>

      <label className="text-[12.5px] font-bold text-[#475569]">Thời gian:</label>
      <SelectField>
        <option>15 phút</option>
        <option>45 phút</option>
        <option>60 phút</option>
        <option>90 phút</option>
      </SelectField>

      {/* khớp .gen-btn */}
      <button
        onClick={onGenerate}
        className="ml-auto flex items-center gap-[7px] rounded-[9px] bg-[#1a56db] px-[22px] py-[9px] font-['Nunito',sans-serif] text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(26,86,219,0.25)] transition-all hover:-translate-y-px hover:bg-[#1d4ed8]"
      >
        ✨ Tạo đề thi
      </button>
    </div>
  )
}

function SelectField({ children }: { children: React.ReactNode }) {
  return (
    <select className="rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 font-['Nunito',sans-serif] text-[13px] text-[#334155] outline-none transition-colors focus:border-[#1a56db]">
      {children}
    </select>
  )
}