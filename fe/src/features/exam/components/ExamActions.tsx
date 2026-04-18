import { Upload, Rocket, RotateCcw, Loader2 } from 'lucide-react'

interface ExamActionsProps {
  hasQuestions: boolean
  isSavedToDb: boolean       // true = đề đã lưu, có examId
  isSaving: boolean
  isCreatingRoom: boolean
  onSaveDraft: () => void
  onSavePublish: () => void
  onCreateRoom: () => void
  onRegenerate: () => void
}

export function ExamActions({
  hasQuestions,
  isSavedToDb,
  isSaving,
  isCreatingRoom,
  onSaveDraft,
  onSavePublish,
  onCreateRoom,
  onRegenerate,
}: ExamActionsProps) {
  return (
    <div className="flex flex-wrap gap-2.5 border-t border-[#f1f5f9] bg-[#f8fafc] px-7 py-4">
      {/* <ActionButton
        variant="primary"
        disabled={!hasQuestions || isSaving}
        onClick={onSaveDraft}
      >
        {isSaving ? '⏳ Đang lưu...' : '💾 Lưu nháp'}
      </ActionButton> */}

      <ActionButton
        variant="success"
        disabled={!hasQuestions || isSaving}
        onClick={onSavePublish}
      >
        📤 Lưu & Xuất bản
      </ActionButton>

      <ActionButton
        variant="violet"
        disabled={!isSavedToDb || isCreatingRoom}
        onClick={onCreateRoom}
      >
        {isCreatingRoom ? '⏳ Đang tạo...' : '🚀 Tạo phòng thi'}
      </ActionButton>

      <div className="flex-1" />

      <ActionButton variant="outline" onClick={onRegenerate}>
        🔄 Tạo lại
      </ActionButton>
    </div>
  )
}

function ActionButton({
  children,
  variant,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  variant: 'primary' | 'success' | 'outline' | 'violet'
  disabled?: boolean
  onClick?: () => void
}) {
  const styles = {
    primary: 'bg-[#1a56db] text-white border-[#1a56db] hover:bg-[#1d4ed8]',
    success: 'bg-[#10b981] text-white border-[#10b981] hover:opacity-90',
    violet: 'bg-[#7c3aed] text-white border-[#7c3aed] hover:opacity-90',
    outline: 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#1a56db] hover:text-[#1a56db]',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-[7px] rounded-[9px] border-[1.5px] px-5 py-[9px] font-['Nunito',sans-serif] text-[13px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {children}
    </button>
  )
}