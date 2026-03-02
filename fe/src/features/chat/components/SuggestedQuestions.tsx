interface SuggestedQuestionsProps {
  onSelect: (text: string) => void
}

const SUGGESTIONS = [
  { icon: '💡', label: 'Vòng lặp WHILE–DO' },
  { icon: '🔁', label: 'REPEAT–UNTIL' },
  { icon: '📋', label: 'Bài tập mảng' },
  { icon: '📝', label: 'Tạo đề thi chủ đề này' },
]

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-[7px] px-5 pt-3">
      {SUGGESTIONS.map((s) => (
        <button
          key={s.label}
          onClick={() => onSelect(`Giải thích về ${s.label}`)}
          className="flex items-center gap-1.5 rounded-full border-[1.5px] border-[var(--edu-gray-200)] bg-white px-[13px] py-[7px] text-xs font-semibold text-[var(--edu-gray-600)] transition-all hover:border-[var(--edu-primary)] hover:bg-[var(--edu-primary-soft)] hover:text-[var(--edu-primary)]"
        >
          {s.icon} {s.label}
        </button>
      ))}
    </div>
  )
}