import { Lightbulb, Repeat2, ClipboardList, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface SuggestedQuestionsProps {
  onSelect: (text: string) => void
}

const SUGGESTIONS: { icon: LucideIcon; label: string }[] = [
  { icon: Lightbulb, label: 'Vòng lặp WHILE–DO' },
  { icon: Repeat2, label: 'REPEAT–UNTIL' },
  { icon: ClipboardList, label: 'Bài tập mảng' },
]

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-[7px] px-5 pt-3">
      {SUGGESTIONS.map((s) => (
        <button
          key={s.label}
          onClick={() => onSelect(`Giải thích về ${s.label}`)}
          className="flex items-center gap-[6px] rounded-full border-[1.5px] border-[#e2e8f0] bg-white px-[13px] py-[7px] text-[12px] font-semibold text-[#475569] transition-all hover:border-[#1a56db] hover:bg-[#eff6ff] hover:text-[#1a56db]"
        >
          <s.icon size={13} /> {s.label}
        </button>
      ))}
    </div>
  )
}