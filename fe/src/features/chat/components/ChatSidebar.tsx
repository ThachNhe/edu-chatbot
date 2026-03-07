import { cn } from '@/lib/utils'
import type { ChatConversation } from '../types/chat.types'

interface ChatSidebarProps {
  conversations: ChatConversation[]
  onNewChat: () => void
  onSelectConversation: (id: number) => void
}

export function ChatSidebar({ conversations, onNewChat, onSelectConversation }: ChatSidebarProps) {
  const todayStr = new Date().toDateString()
  const today = conversations.filter((c) => new Date(c.created_at).toDateString() === todayStr)
  const older = conversations.filter((c) => new Date(c.created_at).toDateString() !== todayStr)

  return (
    <div className="flex flex-col overflow-hidden border-r border-[#e2e8f0] bg-white">
      <div className="flex-shrink-0 border-b border-[#e2e8f0] px-3.5 py-4">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-[7px] rounded-[9px] bg-[#1a56db] px-4 py-[9px] font-['Nunito',sans-serif] text-[13px] font-bold text-white shadow-none transition-all hover:-translate-y-px hover:bg-[#1d4ed8]"
        >
          <span>＋</span> Cuộc trò chuyện mới
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {today.length > 0 && (
          <>
            <SectionLabel>Hôm nay</SectionLabel>
            <div className="px-2 pb-3">
              {today.map((c) => (
                <ConversationItem key={c.id} conversation={c} onSelect={onSelectConversation} />
              ))}
            </div>
          </>
        )}
        {older.length > 0 && (
          <>
            <SectionLabel>Trước đó</SectionLabel>
            <div className="px-2 pb-3">
              {older.map((c) => (
                <ConversationItem key={c.id} conversation={c} onSelect={onSelectConversation} />
              ))}
            </div>
          </>
        )}
        {conversations.length === 0 && (
          <p className="px-4 py-6 text-center text-[12px] text-[#94a3b8]">
            Chưa có cuộc trò chuyện nào
          </p>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3.5 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[1px] text-[#94a3b8]">
      {children}
    </div>
  )
}

function ConversationItem({
  conversation: c,
  onSelect,
}: {
  conversation: ChatConversation
  onSelect: (id: number) => void
}) {
  const dateLabel = new Date(c.created_at).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <button
      onClick={() => onSelect(c.id)}
      className={cn(
        'mb-0.5 w-full cursor-pointer rounded-lg px-2 py-[9px] text-left transition-colors hover:bg-[#f1f5f9]',
        c.isActive && 'bg-[#eff6ff] hover:bg-[#eff6ff]',
      )}
    >
      <div
        className={cn(
          'truncate text-[12.5px] font-semibold leading-tight',
          c.isActive ? 'text-[#1a56db]' : 'text-[#334155]',
        )}
      >
        {c.title}
      </div>
      <div className="mt-0.5 text-[11px] text-[#94a3b8]">{dateLabel}</div>
    </button>
  )
}