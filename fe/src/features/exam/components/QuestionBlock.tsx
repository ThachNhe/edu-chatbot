import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ExamQuestion, ExamOption } from '../types/exam.type'

const LEVEL_STYLES = {
  easy: 'bg-[#d1fae5] text-[#10b981]',
  med: 'bg-[#fef3c7] text-[#d97706]',
  hard: 'bg-[#fee2e2] text-[#ef4444]',
}
const LEVEL_LABELS = { easy: 'Dễ', med: 'Trung bình', hard: 'Khó' }
const LEVELS = ['easy', 'med', 'hard'] as const

interface QuestionBlockProps {
  question: ExamQuestion
  index: number
  editable?: boolean
  isSaving?: boolean
  onChange?: (updated: ExamQuestion) => void
  onSave?: (updated: ExamQuestion) => void
}

export function QuestionBlock({
  question,
  index,
  editable = false,
  isSaving = false,
  onChange,
  onSave,
}: QuestionBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<ExamQuestion>(question)

  const handleStartEdit = () => {
    setDraft(question)
    setIsEditing(true)
  }

  const handleCancel = () => setIsEditing(false)

  const handleSave = () => {
    onChange?.(draft)
    onSave?.(draft)
    setIsEditing(false)
  }

  const updateOption = (letter: string, field: keyof ExamOption, value: string | boolean) => {
    setDraft((prev) => ({
      ...prev,
      options: prev.options.map((o) =>
        o.letter === letter ? { ...o, [field]: value } : o,
      ),
    }))
  }

  const setCorrectOption = (letter: string) => {
    setDraft((prev) => ({
      ...prev,
      options: prev.options.map((o) => ({ ...o, is_correct: o.letter === letter })),
    }))
  }

  return (
    <div className="mb-[22px] border-b border-[#f1f5f9] pb-[22px] last:mb-0 last:border-b-0">
      {/* Header */}
      <div className="mb-2.5 flex items-start gap-[10px]">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[12px] font-extrabold text-[#1a56db]">
          {index + 1}
        </div>

        {isEditing ? (
          <textarea
            value={draft.content}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            rows={2}
            className="flex-1 rounded-lg border-[1.5px] border-[#1a56db] bg-[#f8fafc] px-3 py-2 text-[14px] font-semibold leading-[1.55] text-[#1e293b] outline-none resize-none"
          />
        ) : (
          <div
            className="flex-1 text-[14px] font-semibold leading-[1.55] text-[#1e293b]"
            dangerouslySetInnerHTML={{ __html: question.content }}
          />
        )}

        <div className="flex items-center gap-2">
          {isEditing ? (
            <select
              value={draft.level}
              onChange={(e) => setDraft({ ...draft, level: e.target.value as 'easy' | 'med' | 'hard' })}
              className="rounded-full border border-[#e2e8f0] px-2 py-0.5 text-[10.5px] font-bold outline-none"
            >
              {LEVELS.map((l) => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
            </select>
          ) : (
            <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-bold ${LEVEL_STYLES[question.level]}`}>
              {LEVEL_LABELS[question.level]}
            </span>
          )}

          {editable && !isEditing && (
            <button
              onClick={handleStartEdit}
              className="rounded-md px-2 py-1 text-[11px] font-bold text-[#475569] hover:bg-[#f1f5f9] hover:text-[#1a56db] transition-colors"
            >
              ✏️
            </button>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="mt-2.5 grid grid-cols-2 gap-2">
        {(isEditing ? draft : question).options.map((opt) => (
          <div
            key={opt.letter}
            className={cn(
              'flex items-center gap-[9px] rounded-[9px] border-[1.5px] px-[13px] py-2.5 text-[13px] transition-all',
              opt.is_correct
                ? 'border-[#10b981] bg-[#d1fae5] font-bold text-[#065f46]'
                : 'border-[#e2e8f0] text-[#334155]',
              isEditing && 'cursor-pointer',
            )}
            onClick={() => isEditing && setCorrectOption(opt.letter)}
          >
            <div
              className={cn(
                'flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold',
                opt.is_correct ? 'bg-[#10b981] text-white' : 'bg-[#f1f5f9]',
              )}
            >
              {opt.letter}
            </div>
            {isEditing ? (
              <input
                value={opt.content}
                onChange={(e) => updateOption(opt.letter, 'content', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 bg-transparent outline-none text-[13px]"
              />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: opt.content }} />
            )}
          </div>
        ))}
      </div>

      {/* Edit action row */}
      {isEditing && (
        <div className="mt-3 flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="rounded-lg border border-[#e2e8f0] bg-white px-4 py-1.5 text-[12px] font-bold text-[#475569] hover:border-[#1a56db] hover:text-[#1a56db] transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-[#1a56db] px-4 py-1.5 text-[12px] font-bold text-white hover:bg-[#1d4ed8] disabled:opacity-60 transition-colors"
          >
            {isSaving ? 'Đang lưu...' : '✓ Lưu câu hỏi'}
          </button>
        </div>
      )}
    </div>
  )
}