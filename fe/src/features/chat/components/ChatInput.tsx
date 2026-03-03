import { useState, useRef, useCallback } from 'react'

interface ChatInputProps {
  onSend: (text: string) => void
}

function ToolButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      title={label}
      className="flex items-center gap-[5px] rounded-[7px] border border-[#e2e8f0] bg-white px-[11px] py-[5px] font-['Nunito',sans-serif] text-[12px] font-semibold text-[#64748b] transition-all hover:border-[#1a56db] hover:text-[#1a56db]"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }, [])

  return (
    <div className="border-t border-[#e2e8f0] bg-white px-5 pb-4 pt-3.5">
      {/* Input box wrapper */}
      <div
        className="overflow-hidden rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] transition-[border-color,box-shadow] focus-within:border-[#1a56db] focus-within:shadow-[0_0_0_3px_rgba(26,86,219,0.08)]"
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi cho trợ lý AI... (Shift+Enter để xuống dòng)"
          rows={1}
          className="min-h-[46px] max-h-[140px] w-full resize-none border-none bg-transparent px-3.5 pb-2 pt-3 font-['Nunito',sans-serif] text-[13.5px] leading-[1.6] text-[#1e293b] outline-none placeholder:text-[#94a3b8]"
        />

        {/* Footer toolbar */}
        <div className="flex items-center justify-between px-3 pb-[9px] pt-[7px]">
          {/* Tool buttons */}
          <div className="flex items-center gap-[5px]">
            <ToolButton icon="📎" label="Đính kèm" />
            <ToolButton icon="🖼️" label="Hình ảnh" />
            <ToolButton icon="📄" label="Tài liệu" />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!value.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#1a56db] text-white shadow-[0_2px_8px_rgba(26,86,219,0.3)] transition-all hover:scale-[1.05] hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:shadow-none"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}