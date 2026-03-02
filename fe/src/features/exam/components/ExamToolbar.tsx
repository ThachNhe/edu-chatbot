interface ExamToolbarProps {
  onGenerate: () => void
}

export function ExamToolbar({ onGenerate }: ExamToolbarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-[var(--edu-radius)] border border-[var(--edu-gray-200)] bg-white px-5 py-3.5 shadow-[var(--edu-shadow-sm)]">
      <label className="text-[12.5px] font-bold text-[var(--edu-gray-600)]">
        Chủ đề:
      </label>
      <SelectField>
        <option>Cấu trúc lặp (FOR, WHILE, REPEAT)</option>
        <option>Mảng một chiều</option>
        <option>Mảng hai chiều</option>
        <option>Chương trình con</option>
        <option>Kiểu Record</option>
        <option>Xử lý tệp</option>
        <option>Cơ sở dữ liệu</option>
      </SelectField>

      <label className="text-[12.5px] font-bold text-[var(--edu-gray-600)]">
        Số câu:
      </label>
      <input
        type="number"
        defaultValue={10}
        min={5}
        max={40}
        className="w-[70px] rounded-lg border-[1.5px] border-[var(--edu-gray-200)] bg-[var(--edu-gray-50)] px-3 py-2 text-[13px] text-[var(--edu-gray-700)] outline-none transition-colors focus:border-[var(--edu-primary)]"
      />

      <label className="text-[12.5px] font-bold text-[var(--edu-gray-600)]">
        Mức độ:
      </label>
      <SelectField>
        <option>Hỗn hợp</option>
        <option>Dễ</option>
        <option>Trung bình</option>
        <option>Khó</option>
      </SelectField>

      <label className="text-[12.5px] font-bold text-[var(--edu-gray-600)]">
        Thời gian:
      </label>
      <SelectField>
        <option>15 phút</option>
        <option>45 phút</option>
        <option>60 phút</option>
        <option>90 phút</option>
      </SelectField>

      <button
        onClick={onGenerate}
        className="ml-auto flex items-center gap-[7px] rounded-[9px] bg-[var(--edu-primary)] px-[22px] py-[9px] text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(26,86,219,0.25)] transition-all hover:-translate-y-px hover:bg-[#1d4ed8]"
      >
        ✨ Tạo đề thi
      </button>
    </div>
  )
}

function SelectField({ children }: { children: React.ReactNode }) {
  return (
    <select className="rounded-lg border-[1.5px] border-[var(--edu-gray-200)] bg-[var(--edu-gray-50)] px-3 py-2 text-[13px] text-[var(--edu-gray-700)] outline-none transition-colors focus:border-[var(--edu-primary)]">
      {children}
    </select>
  )
}