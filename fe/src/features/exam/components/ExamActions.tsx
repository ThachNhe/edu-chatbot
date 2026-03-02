interface ExamActionsProps {
  onRegenerate: () => void
}

export function ExamActions({ onRegenerate }: ExamActionsProps) {
  return (
    <div className="flex gap-2.5 border-t border-[var(--edu-gray-100)] bg-[var(--edu-gray-50)] px-7 py-4">
      <ActionButton variant="primary" onClick={() => alert('Đã lưu đề thi!')}>
        💾 Lưu đề thi
      </ActionButton>
      <ActionButton
        variant="success"
        onClick={() => alert('Đang xuất file Word...')}
      >
        📄 Xuất Word
      </ActionButton>
      <ActionButton variant="outline" onClick={() => alert('Đang in...')}>
        🖨️ In đề
      </ActionButton>
      <ActionButton
        variant="outline"
        onClick={() => alert('Đã sao chép link chia sẻ!')}
      >
        🔗 Chia sẻ
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
  onClick,
}: {
  children: React.ReactNode
  variant: 'primary' | 'success' | 'outline'
  onClick?: () => void
}) {
  const styles = {
    primary:
      'bg-[var(--edu-primary)] text-white border-[var(--edu-primary)] hover:bg-[#1d4ed8]',
    success:
      'bg-[var(--edu-success)] text-white border-[var(--edu-success)] hover:opacity-90',
    outline:
      'bg-white text-[var(--edu-gray-600)] border-[var(--edu-gray-200)] hover:border-[var(--edu-primary)] hover:text-[var(--edu-primary)]',
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[7px] rounded-[9px] border-[1.5px] px-5 py-[9px] text-[13px] font-bold transition-all ${styles[variant]}`}
    >
      {children}
    </button>
  )
}