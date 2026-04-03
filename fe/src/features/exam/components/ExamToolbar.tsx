import type { ExamConfig, DifficultyLevel } from '../types/exam.type'

interface ExamToolbarProps {
  config: ExamConfig
  isGenerating: boolean
  onChange: (config: ExamConfig) => void
  onGenerate: () => void
}

const TOPICS = [
  'Cấu trúc lặp (FOR, WHILE, REPEAT)',
  'Mảng một chiều',
  'Mảng hai chiều',
  'Chương trình con',
  'Kiểu Record',
  'Xử lý tệp',
  'Cơ sở dữ liệu',
]

const DURATIONS = ['15', '30', '45', '60', '90']
const DIFFICULTIES: { value: DifficultyLevel; label: string }[] = [
  { value: 'mixed', label: 'Hỗn hợp' },
  { value: 'easy', label: 'Dễ' },
  { value: 'med', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
]

export function ExamToolbar({ config, isGenerating, onChange, onGenerate }: ExamToolbarProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-[#e2e8f0] bg-white px-5 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <label className="text-[12.5px] font-bold text-[#475569]">Chủ đề:</label>
      <div className="relative">
        <input
          list="topic-options"
          value={config.topic}
          onChange={(e) => onChange({ ...config, topic: e.target.value })}
          placeholder="Chọn hoặc nhập..."
          className="w-[180px] rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 font-['Nunito',sans-serif] text-[13px] text-[#334155] outline-none transition-colors focus:border-[#1a56db]"
        />
        <datalist id="topic-options">
          {TOPICS.map((t) => <option key={t} value={t} />)}
        </datalist>
      </div>

      <label className="text-[12.5px] font-bold text-[#475569]">Số câu:</label>
      <input
        type="number"
        value={config.questionCount}
        min={5}
        max={40}
        onChange={(e) => onChange({ ...config, questionCount: Number(e.target.value) })}
        className="w-[70px] rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 font-['Nunito',sans-serif] text-[13px] text-[#334155] outline-none transition-colors focus:border-[#1a56db]"
      />

      <label className="text-[12.5px] font-bold text-[#475569]">Mức độ:</label>
      <SelectField
        value={config.difficulty}
        onChange={(v) => onChange({ ...config, difficulty: v as DifficultyLevel })}
      >
        {DIFFICULTIES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
      </SelectField>

      <label className="text-[12.5px] font-bold text-[#475569]">Thời gian:</label>
      <SelectField
        value={config.duration}
        onChange={(v) => onChange({ ...config, duration: v })}
      >
        {DURATIONS.map((d) => <option key={d} value={d}>{d} phút</option>)}
      </SelectField>

      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="ml-auto flex items-center gap-[7px] rounded-[9px] bg-[#1a56db] px-[22px] py-[9px] font-['Nunito',sans-serif] text-[13px] font-bold text-white shadow-[0_2px_8px_rgba(26,86,219,0.25)] transition-all hover:-translate-y-px hover:bg-[#1d4ed8] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isGenerating ? '⏳ Đang tạo...' : '✨ Tạo đề thi'}
      </button>
    </div>
  )
}

function SelectField({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode
  value: string
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 font-['Nunito',sans-serif] text-[13px] text-[#334155] outline-none transition-colors focus:border-[#1a56db]"
    >
      {children}
    </select>
  )
}