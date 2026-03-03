import { TypingIndicator } from './TypingIndicator'
import type { ChatMessage } from '../types/chat.types'

interface MessageBubbleProps {
  message: ChatMessage
  isTyping?: boolean
}

export function MessageBubble({ message, isTyping }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex gap-2.5 animate-[msgIn_0.3s_ease] ${
        isUser ? 'flex-row-reverse' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`mt-0.5 flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] text-base ${
          isUser
            ? 'bg-gradient-to-br from-amber-500 to-red-500 font-extrabold text-white'
            : 'bg-gradient-to-br from-[#1a56db] to-[#0ea5e9] text-white shadow-[0_2px_8px_rgba(26,86,219,0.3)]'
        }`}
      >
        {isUser ? 'N' : '🤖'}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`max-w-[68%] px-4 py-3 text-[13.5px] leading-[1.65] shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${
            isUser
              ? 'rounded-[14px_14px_4px_14px] border border-[#1a56db] bg-[#1a56db] text-white shadow-[0_2px_10px_rgba(26,86,219,0.25)]'
              : 'rounded-[14px_14px_14px_4px] border border-[#e2e8f0] bg-white text-[#1e293b]'
          }`}
        >
          {isTyping ? (
            <TypingIndicator />
          ) : (
            <span dangerouslySetInnerHTML={{ __html: message.content }} />
          )}
        </div>

        {/* Timestamp */}
        {!isTyping && (
          <span className="px-1 text-[11px] text-[#94a3b8]">
            {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>
    </div>
  )
}