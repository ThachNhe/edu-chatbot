import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { SuggestedQuestions } from './SuggestedQuestions'
import type { ChatMessage } from '../types/chat.types'

interface ChatMainProps {
  messages: ChatMessage[]
  isTyping: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
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
      {/* Topbar — khớp .chat-topbar */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white px-5 py-3">
        {/* Subject tag — khớp .chat-subject-tag */}
        <div className="flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-[5px] text-[12.5px] font-bold text-[#1a56db]">
          <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#10b981]" />
          🤖 EduAI – Tin học 12
        </div>

        <div className="flex items-center gap-2">
          <TopbarBtn title="Xóa">🗑️</TopbarBtn>
          <TopbarBtn title="Cài đặt">⚙️</TopbarBtn>
        </div>
      </div>

      {/* Messages area — khớp .messages-area */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-[#e2e8f0]">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isTyping && (
          <MessageBubble
            message={{ id: 'typing', role: 'ai', content: '', timestamp: new Date() }}
            isTyping
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions — khớp .suggested-questions */}
      <div className="bg-white">
        <SuggestedQuestions onSelect={onSend} />
      </div>

      {/* Chat input — khớp .chat-input-area */}
      <ChatInput onSend={onSend} />
    </div>
  )
}

function TopbarBtn({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      title={title}
      className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#f1f5f9] text-base text-[#64748b] transition-all hover:bg-[#eff6ff] hover:text-[#1a56db]"
    >
      {children}
    </button>
  )
}