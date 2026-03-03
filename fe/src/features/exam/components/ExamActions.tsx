interface ExamActionsProps {
  onRegenerate: () => void
}

export function ExamActions({ onRegenerate }: ExamActionsProps) {
  return (
    <div className="flex gap-2.5 border-t border-[#f1f5f9] bg-[#f8fafc] px-7 py-4">
      <ActionButton variant="primary" onClick={() => alert('Đã lưu đề thi!')}>
        💾 Lưu đề thi
      </ActionButton>
      <ActionButton variant="success" onClick={() => alert('Đang xuất file Word...')}>
        📄 Xuất Word
      </ActionButton>
      <ActionButton variant="outline" onClick={() => alert('Đang in...')}>
        🖨️ In đề
      </ActionButton>
      <ActionButton variant="outline" onClick={() => alert('Đã sao chép link chia sẻ!')}>
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
    primary: 'bg-[#1a56db] text-white border-[#1a56db] hover:bg-[#1d4ed8]',
    success: 'bg-[#10b981] text-white border-[#10b981] hover:opacity-90',
    outline: 'bg-white text-[#475569] border-[#e2e8f0] hover:border-[#1a56db] hover:text-[#1a56db]',
  }

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-[7px] rounded-[9px] border-[1.5px] px-5 py-[9px] font-['Nunito',sans-serif] text-[13px] font-bold transition-all ${styles[variant]}`}
    >
      {children}
    </button>
  )
}