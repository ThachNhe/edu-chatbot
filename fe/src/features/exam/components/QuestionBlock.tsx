import { cn } from '@/lib/utils'
import type { ExamQuestion } from '../types/exam.types'

const LEVEL_STYLES = {
  easy: 'bg-[var(--edu-success-soft)] text-[var(--edu-success)]',
  med: 'bg-[var(--edu-accent-soft)] text-[#d97706]',
  hard: 'bg-[var(--edu-danger-soft)] text-[var(--edu-danger)]',
}

const LEVEL_LABELS = {
  easy: 'Dễ',
  med: 'Trung bình',
  hard: 'Khó',
}

export function QuestionBlock({ question }: { question: ExamQuestion }) {
  return (
    <div className="mb-[22px] border-b border-[var(--edu-gray-100)] pb-[22px] last:mb-0 last:border-b-0">
      {/* Header */}
      <div className="mb-2.5 flex items-start gap-2.5">
        <div className="flex h-7 min-w-[28px] flex-shrink-0 items-center justify-center rounded-lg bg-[var(--edu-primary-soft)] text-xs font-extrabold text-[var(--edu-primary)]">
          {question.number}
        </div>
        <div
          className="flex-1 text-sm font-semibold leading-[1.55] text-[var(--edu-gray-800)]"
          dangerouslySetInnerHTML={{ __html: question.text }}
        />
        <span
          className={`ml-auto whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-bold ${LEVEL_STYLES[question.level]}`}
        >
          {LEVEL_LABELS[question.level]}
        </span>
      </div>

      {/* Options */}
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {question.options.map((opt) => (
          <div
            key={opt.letter}
            className={cn(
              'flex cursor-pointer items-center gap-[9px] rounded-[9px] border-[1.5px] px-[13px] py-2.5 text-[13px] transition-all',
              opt.isCorrect
                ? 'border-[var(--edu-success)] bg-[var(--edu-success-soft)] font-bold text-[#065f46]'
                : 'border-[var(--edu-gray-200)] text-[var(--edu-gray-700)] hover:border-[var(--edu-primary)] hover:bg-[var(--edu-primary-soft)] hover:text-[var(--edu-primary)]',
            )}
          >
            <div
              className={cn(
                'flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold',
                opt.isCorrect
                  ? 'bg-[var(--edu-success)] text-white'
                  : 'bg-[var(--edu-gray-100)]',
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