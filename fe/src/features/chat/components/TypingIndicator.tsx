export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-0.5">
      <span className="typing-dot h-[7px] w-[7px] rounded-full bg-[var(--edu-gray-300)]" />
      <span className="typing-dot h-[7px] w-[7px] rounded-full bg-[var(--edu-gray-300)]" />
      <span className="typing-dot h-[7px] w-[7px] rounded-full bg-[var(--edu-gray-300)]" />
    </div>
  )
}