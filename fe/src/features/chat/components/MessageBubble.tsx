import type { ChatMessage } from '../types/chat.types'
import { TypingIndicator } from './TypingIndicator'

interface MessageBubbleProps {
  message: ChatMessage
  isTyping?: boolean
}

export function MessageBubble({ message, isTyping }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`animate-msg-in flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className={`mt-0.5 flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] text-base ${
          isUser
            ? 'bg-gradient-to-br from-amber-500 to-red-500'
            : 'bg-gradient-to-br from-[#1a56db] to-[#0ea5e9] shadow-[0_2px_8px_rgba(26,86,219,0.3)]'
        }`}
      >
        {isUser ? 'N' : '🤖'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[68%] px-4 py-3 text-[13.5px] leading-[1.65] ${
          isUser ? 'msg-bubble-user' : 'msg-bubble-ai'
        }`}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: message.content }} />
        )}
      </div>
    </div>
  )
}