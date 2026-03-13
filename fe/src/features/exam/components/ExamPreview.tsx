import { QuestionBlock } from './QuestionBlock'
import { ExamActions } from './ExamActions'
import type { ExamConfig, ExamDetail, ExamQuestion } from '../types/exam.type'
import { useUpdateQuestion } from '../hooks/useExam'

interface ExamPreviewProps {
  config: ExamConfig
  questions: ExamQuestion[]
  examDetail: ExamDetail | null    // đề đã lưu (có id)
  isSaving: boolean
  isCreatingRoom: boolean
  onQuestionsChange: (questions: ExamQuestion[]) => void
  onSaveDraft: () => void
  onSavePublish: () => void
  onCreateRoom: () => void
  onRegenerate: () => void
}

export function ExamPreview({
  config,
  questions,
  examDetail,
  isSaving,
  isCreatingRoom,
  onQuestionsChange,
  onSaveDraft,
  onSavePublish,
  onCreateRoom,
  onRegenerate,
}: ExamPreviewProps) {
  const { mutate: updateQuestion, isPending: isSavingQuestion } = useUpdateQuestion(examDetail?.id ?? 0)

  const handleQuestionChange = (index: number, updated: ExamQuestion) => {
    const next = [...questions]
    next[index] = updated
    onQuestionsChange(next)
  }

  const handleSaveQuestion = (index: number, updated: ExamQuestion) => {
    if (!examDetail || !updated.id) return
    updateQuestion({
      questionId: updated.id,
      payload: {
        content: updated.content,
        level: updated.level,
        options: updated.options.map((o) => ({
          id: (o as any).id,
          letter: o.letter,
          content: o.content,
          is_correct: o.is_correct,
        })),
      },
    })
  }

  const today = new Date().toLocaleDateString('vi-VN')

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] bg-white py-20 text-center">
        <div className="mb-3 text-5xl">📝</div>
        <p className="text-[15px] font-semibold text-[#475569]">Chưa có đề thi</p>
        <p className="mt-1 text-[13px] text-[#94a3b8]">Cấu hình bên trên và nhấn ✨ Tạo đề thi để bắt đầu</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a56db] to-[#0ea5e9] px-7 py-[22px] text-white">
        <div className="flex items-start justify-between">
          <h3 className="mb-1.5 text-base font-extrabold">
            📝 {examDetail?.title ?? `Đề kiểm tra Tin học 12 – ${config.topic}`}
          </h3>
          {examDetail && (
            <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${examDetail.status === 'published' ? 'bg-green-400/30 text-green-100' : 'bg-white/20 text-white/80'
              }`}>
              {examDetail.status === 'published' ? '✅ Đã xuất bản' : '📋 Nháp'}
            </span>
          )}
        </div>
        <div className="flex gap-5">
          {[
            `⏱️ Thời gian: ${config.duration} phút`,
            `📋 Số câu: ${questions.length}`,
            '🎯 Hình thức: Trắc nghiệm',
            `📅 Ngày tạo: ${today}`,
          ].map((meta) => (
            <div key={meta} className="flex items-center gap-[5px] text-[12px] opacity-85">
              {meta}
            </div>
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="px-7 py-6">
        {questions.map((q, i) => (
          <QuestionBlock
            key={q.id ?? i}
            question={q}
            index={i}
            editable={true}
            isSaving={isSavingQuestion}
            onChange={(updated) => handleQuestionChange(i, updated)}
            onSave={(updated) => handleSaveQuestion(i, updated)}
          />
        ))}
      </div>

      <ExamActions
        hasQuestions={questions.length > 0}
        isSavedToDb={examDetail !== null}
        isSaving={isSaving}
        isCreatingRoom={isCreatingRoom}
        onSaveDraft={onSaveDraft}
        onSavePublish={onSavePublish}
        onCreateRoom={onCreateRoom}
        onRegenerate={onRegenerate}
      />
    </div>
  )
}