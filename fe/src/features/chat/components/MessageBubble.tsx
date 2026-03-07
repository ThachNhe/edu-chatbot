import { useAuthStore } from '@/stores/useAuthStore'
import { TypingIndicator } from './TypingIndicator'
import type { ChatMessage } from '../types/chat.types'

/**
 * Converts AI markdown response to safe HTML.
 * HTML-escapes the input first to prevent XSS, then applies markdown rules.
 */
function markdownToHtml(raw: string): string {
  // 1. Escape HTML entities (bảo vệ XSS)
  let s = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 2. Tách code blocks ra trước để không bị ảnh hưởng bởi transforms
  const codeBlocks: string[] = []
  s = s.replace(/```(?:\w*)\n?([\s\S]*?)```/g, (_, code) => {
    const i = codeBlocks.length
    codeBlocks.push(`<pre class="my-2 rounded bg-[#1e293b] p-3 text-[12px] text-green-300 overflow-x-auto"><code>${code.trimEnd()}</code></pre>`)
    return `\x00BLOCK${i}\x00`
  })

  // 3. Inline code
  s = s.replace(/`([^`\n]+)`/g, '<code class="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-[12px] text-[#e11d48]">$1</code>')

  // 4. Bold
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  // 5. Italic
  s = s.replace(/\*(?!\s)(.+?)(?<!\s)\*/g, '<em>$1</em>')

  // 6. Headers → bold block
  s = s.replace(/^#{1,6} (.+)$/gm, '<strong class="block mt-1 text-[14px]">$1</strong>')

  // 7. Unordered list items
  s = s.replace(/^[-*] (.+)$/gm, '• $1')

  // 8. Newlines → <br>
  s = s.replace(/\n/g, '<br>')

  // 9. Trả lại code blocks
  s = s.replace(/\x00BLOCK(\d+)\x00/g, (_, i) => codeBlocks[Number(i)])

  return s
}

interface MessageBubbleProps {
  message: ChatMessage
  isTyping?: boolean
}

export function MessageBubble({ message, isTyping }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const user = useAuthStore((s) => s.user)
  const avatarLetter = user?.name?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className={`flex gap-2.5 animate-[msgIn_0.3s_ease] ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`mt-0.5 flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[10px] text-base overflow-hidden ${isUser
          ? 'bg-gradient-to-br from-amber-500 to-red-500 font-extrabold text-white'
          : 'bg-gradient-to-br from-[#1a56db] to-[#0ea5e9] text-white shadow-[0_2px_8px_rgba(26,86,219,0.3)]'
          }`}
      >
        {isUser
          ? user?.avatar
            ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            : avatarLetter
          : '🤖'}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`max-w-[68%] px-4 py-3 text-[13.5px] leading-[1.65] shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${isUser
            ? 'rounded-[14px_14px_4px_14px] border border-[#1a56db] bg-[#1a56db] text-white shadow-[0_2px_10px_rgba(26,86,219,0.25)]'
            : 'rounded-[14px_14px_14px_4px] border border-[#e2e8f0] bg-white text-[#1e293b]'
            }`}
        >
          {isTyping ? (
            <TypingIndicator />
          ) : isUser ? (
            // User messages: plain text, không render HTML
            <span className="whitespace-pre-wrap">{message.content}</span>
          ) : (
            // AI messages: markdown → safe HTML
            <span dangerouslySetInnerHTML={{ __html: markdownToHtml(message.content) }} />
          )}
        </div>
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