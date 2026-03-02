import { MessageBubble } from './MessageBubble'
import { SuggestedQuestions } from './SuggestedQuestions'
import { ChatInput } from './ChatInput'
import type { ChatMessage } from '../types/chat.types'

interface ChatMainProps {
  messages: ChatMessage[]
  isTyping: boolean
  messagesEndRef: React.RefObject<HTMLDivElement | null>
  onSend: (text: string) => void
}

export function ChatMain({
  messages,
  isTyping,
  messagesEndRef,
  onSend,
}: ChatMainProps) {
  return (
    <div className="flex flex-col overflow-hidden bg-[#f8faff]">
      {/* Topbar */}
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-200)] bg-white px-5 py-3">
        <div className="flex items-center gap-2 rounded-full border border-[var(--edu-primary-border)] bg-[var(--edu-primary-soft)] px-3 py-[5px] text-[12.5px] font-bold text-[var(--edu-primary)]">
          <div className="animate-pulse-dot h-[7px] w-[7px] rounded-full bg-[var(--edu-success)]" />
          🤖 EduAI – Tin học 12
        </div>
        <div className="flex gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--edu-gray-100)] text-base text-[var(--edu-gray-500)] hover:bg-[var(--edu-primary-soft)] hover:text-[var(--edu-primary)]">
            🗑️
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[var(--edu-gray-100)] text-base text-[var(--edu-gray-500)] hover:bg-[var(--edu-primary-soft)] hover:text-[var(--edu-primary)]">
            ⚙️
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto p-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <MessageBubble
            message={{
              id: 'typing',
              role: 'ai',
              content: '',
              timestamp: new Date(),
            }}
            isTyping
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions + Input */}
      <SuggestedQuestions onSelect={onSend} />
      <ChatInput onSend={onSend} />
    </div>
  )
}