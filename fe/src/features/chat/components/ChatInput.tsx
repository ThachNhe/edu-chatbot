import { useState, useRef, useCallback, type KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (text: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleAutoResize = useCallback(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`
    }
  }, [])

  const handleSend = useCallback(() => {
    if (!value.trim()) return
    onSend(value)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, onSend])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  return (
    <div className="border-t border-[var(--edu-gray-200)] bg-white px-5 pb-4 pt-3.5">
      <div className="overflow-hidden rounded-[var(--edu-radius)] border-[1.5px] border-[var(--edu-gray-200)] bg-[var(--edu-gray-50)] transition-all focus-within:border-[var(--edu-primary)] focus-within:shadow-[0_0_0_3px_rgba(26,86,219,0.08)]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            handleAutoResize()
          }}
          onKeyDown={handleKeyDown}
          placeholder="Nhập câu hỏi cho trợ lý AI... (Shift+Enter để xuống dòng)"
          rows={1}
          className="max-h-[140px] min-h-[46px] w-full resize-none border-none bg-transparent px-3.5 pb-2 pt-3 text-[13.5px] leading-relaxed text-[var(--edu-gray-800)] outline-none placeholder:text-[var(--edu-gray-400)]"
        />
        <div className="flex items-center justify-between px-3 pb-2.5 pt-[7px]">
          <div className="flex gap-1.5">
            <ToolButton icon="📎" label="Đính kèm" />
            <ToolButton icon="🖼️" label="Hình ảnh" />
            <ToolButton icon="📄" label="Tài liệu" />
          </div>
          <button
            onClick={handleSend}
            className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--edu-primary)] text-base text-white shadow-[0_2px_8px_rgba(26,86,219,0.3)] transition-all hover:scale-105 hover:bg-[#1d4ed8]"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}

function ToolButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="flex items-center gap-[5px] rounded-[7px] border border-[var(--edu-gray-200)] bg-white px-[11px] py-[5px] text-xs font-semibold text-[var(--edu-gray-500)] transition-all hover:border-[var(--edu-primary)] hover:text-[var(--edu-primary)]">
      {icon} {label}
    </button>
  )
}