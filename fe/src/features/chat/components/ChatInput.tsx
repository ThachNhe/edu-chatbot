import { useState, useRef, useCallback } from 'react'
import { Sparkles } from 'lucide-react'
import { CreateExamPanel, type ExamCreateOptions } from './CreateExamPanel'

const SLASH_COMMANDS = [
  {
    command: '/taodethi',
    label: 'Tạo đề thi',
    description: 'Tạo đề thi từ file tài liệu bằng AI',
    icon: <Sparkles size={13} className="text-[#1a56db]" />,
  },
]

interface ChatInputProps {
  onSend: (text: string) => void
  onCreateExamFromFile: (opts: ExamCreateOptions) => Promise<void>
  disabled?: boolean
  isCreatingExam?: boolean
}

function ToolButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex items-center gap-[5px] rounded-[7px] border border-[#e2e8f0] bg-white px-[11px] py-[5px] font-['Nunito',sans-serif] text-[12px] font-semibold text-[#64748b] transition-all hover:border-[#1a56db] hover:text-[#1a56db] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[#e2e8f0] disabled:hover:text-[#64748b]"
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

export function ChatInput({ onSend, onCreateExamFromFile, disabled, isCreatingExam }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [showExamPanel, setShowExamPanel] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const [slashSuggestions, setSlashSuggestions] = useState<typeof SLASH_COMMANDS>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const docFileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = useCallback(() => {
    const text = value.trim()
    if (!text) return
    onSend(text)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, onSend])

  const handleSlashSelect = useCallback((cmd: typeof SLASH_COMMANDS[number]) => {
    setSlashSuggestions([])
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    if (cmd.command === '/taodethi') {
      setShowExamPanel(true)
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab or Enter while suggestion is visible → select first suggestion
      if (slashSuggestions.length > 0 && (e.key === 'Tab' || e.key === 'Enter')) {
        e.preventDefault()
        handleSlashSelect(slashSuggestions[0])
        return
      }
      if (e.key === 'Escape' && slashSuggestions.length > 0) {
        e.preventDefault()
        setSlashSuggestions([])
        return
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend, slashSuggestions, handleSlashSelect],
  )

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`

    // Detect /taodethi command (full match → auto trigger)
    if (newValue.trimStart().startsWith('/taodethi')) {
      setSlashSuggestions([])
      setShowExamPanel(true)
      setValue('')
      if (textareaRef.current) textareaRef.current.style.height = 'auto'
      return
    }

    // Show slash suggestions when user types "/" or partial "/taodethi"
    const trimmed = newValue.trimStart()
    if (trimmed.startsWith('/') && trimmed.length > 0) {
      const query = trimmed.toLowerCase()
      const matched = SLASH_COMMANDS.filter((c) => c.command.startsWith(query))
      setSlashSuggestions(matched)
    } else {
      setSlashSuggestions([])
    }
  }, [])

  const handleDocFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length === 0) return
    setAttachedFiles((prev) => [...prev, ...selected].slice(0, 3))
    setShowExamPanel(true)
    if (docFileInputRef.current) docFileInputRef.current.value = ''
  }, [])

  const handleExamSubmit = useCallback(
    async (opts: ExamCreateOptions) => {
      setShowExamPanel(false)
      setAttachedFiles([])
      await onCreateExamFromFile(opts)
    },
    [onCreateExamFromFile],
  )

  const handleExamCancel = useCallback(() => {
    setShowExamPanel(false)
  }, [])

  const isInputDisabled = disabled || isCreatingExam

  return (
    <div className="relative border-t border-[#e2e8f0] bg-white px-5 pb-4 pt-3.5">
      {/* Exam creation panel - floats above input */}
      {showExamPanel && (
        <div className="absolute bottom-full left-0 right-0 z-20 max-h-[calc(100vh-160px)] overflow-y-auto shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <CreateExamPanel
            attachedFiles={attachedFiles}
            onSubmit={handleExamSubmit}
            onCancel={handleExamCancel}
            onFilesChange={setAttachedFiles}
            isLoading={isCreatingExam ?? false}
          />
        </div>
      )}

      {/* Slash command suggestions */}
      {slashSuggestions.length > 0 && (
        <div className="mb-1.5 overflow-hidden rounded-xl border border-[#bfdbfe] bg-white shadow-[0_4px_16px_rgba(26,86,219,0.12)]">
          <div className="px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wide text-[#94a3b8]">
            Lệnh nhanh
          </div>
          {slashSuggestions.map((cmd) => (
            <button
              key={cmd.command}
              onMouseDown={(e) => { e.preventDefault(); handleSlashSelect(cmd) }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition hover:bg-[#eff6ff]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eff6ff]">
                {cmd.icon}
              </span>
              <span>
                <span className="block text-[12.5px] font-bold text-[#1e293b]">
                  {cmd.command}
                  <span className="ml-2 text-[11.5px] font-semibold text-[#1a56db]">{cmd.label}</span>
                </span>
                <span className="text-[11.5px] text-[#64748b]">{cmd.description}</span>
              </span>
              <span className="ml-auto shrink-0 rounded-md border border-[#e2e8f0] bg-[#f8fafc] px-1.5 py-0.5 text-[10px] font-semibold text-[#94a3b8]">
                Tab
              </span>
            </button>
          ))}
        </div>
      )}

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
          placeholder="Nhập câu hỏi... hoặc gõ /taodethi để tạo đề từ tài liệu (Shift+Enter xuống dòng)"
          rows={1}
          disabled={isInputDisabled}
          className="min-h-[46px] max-h-[140px] w-full resize-none border-none bg-transparent px-3.5 pb-2 pt-3 font-['Nunito',sans-serif] text-[13.5px] leading-[1.6] text-[#1e293b] outline-none placeholder:text-[#94a3b8]"
        />

        {/* Footer toolbar */}
        <div className="flex items-center justify-between px-3 pb-[9px] pt-[7px]">
          {/* Tool buttons */}
          <div className="flex items-center gap-[5px]">
            {/* <ToolButton disabled={true} icon={<Paperclip size={13} />} label="Đính kèm" />
            <ToolButton disabled={true} icon={<Image size={13} />} label="Hình ảnh" /> */}
            {/* <ToolButton
              icon={<FileText size={13} />}
              label="Tài liệu"
              disabled={isInputDisabled}
              onClick={() => docFileInputRef.current?.click()}
            /> */}
            <ToolButton
              icon={<Sparkles size={13} />}
              label="Tạo đề thi"
              disabled={isInputDisabled}
              onClick={() => setShowExamPanel(true)}
            />
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!value.trim() || isInputDisabled}
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

      {/* Hidden file input for document upload */}
      <input
        ref={docFileInputRef}
        type="file"
        accept=".txt,.pdf,.doc,.docx"
        className="hidden"
        onChange={handleDocFileSelect}
      />
    </div>
  )
}
