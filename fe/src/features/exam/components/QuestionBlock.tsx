import { cn } from '@/lib/utils'
// import type { ExamQuestion } from '../types/exam.types'
import type { ExamQuestion } from '../types/exam.type'

const LEVEL_STYLES = {
  easy: 'bg-[#d1fae5] text-[#10b981]',
  med:  'bg-[#fef3c7] text-[#d97706]',
  hard: 'bg-[#fee2e2] text-[#ef4444]',
}

const LEVEL_LABELS = {
  easy: 'Dễ',
  med:  'Trung bình',
  hard: 'Khó',
}

export function QuestionBlock({ question }: { question: ExamQuestion }) {
  return (
    /* khớp .question-block { margin-bottom:22px; padding-bottom:22px } */
    <div className="mb-[22px] border-b border-[#f1f5f9] pb-[22px] last:mb-0 last:border-b-0">

      {/* Header — khớp .q-header { gap:10px } */}
      <div className="mb-2.5 flex items-start gap-[10px]">
        {/* khớp .q-num: 28×28, rounded-lg, primary-soft bg */}
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[12px] font-extrabold text-[#1a56db]">
          {question.number}
        </div>
        {/* khớp .q-text */}
        <div
          className="flex-1 text-[14px] font-semibold leading-[1.55] text-[#1e293b]"
          dangerouslySetInnerHTML={{ __html: question.text }}
        />
        {/* khớp .q-level */}
        <span
          className={`ml-auto whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-bold ${LEVEL_STYLES[question.level]}`}
        >
          {LEVEL_LABELS[question.level]}
        </span>
      </div>

      {/* Options — khớp .options-grid { gap:8px } */}
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {question.options.map((opt) => (
          <div
            key={opt.letter}
            className={cn(
              'flex cursor-pointer items-center gap-[9px] rounded-[9px] border-[1.5px] px-[13px] py-2.5 text-[13px] transition-all',
              opt.isCorrect
                ? 'border-[#10b981] bg-[#d1fae5] font-bold text-[#065f46]'
                : 'border-[#e2e8f0] text-[#334155] hover:border-[#1a56db] hover:bg-[#eff6ff] hover:text-[#1a56db]',
            )}
          >
            {/* khớp .opt-letter */}
            <div
              className={cn(
                'flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold',
                opt.isCorrect
                  ? 'bg-[#10b981] text-white'
                  : 'bg-[#f1f5f9]',
              )}
            >
              {opt.letter}
            </div>
            <span dangerouslySetInnerHTML={{ __html: opt.text }} />
          </div>
        ))}
      </div>
    </div>
  )
}