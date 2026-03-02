import { cn } from '@/lib/utils'
import type { ChatConversation } from '../types/chat.types'

interface ChatSidebarProps {
  conversations: ChatConversation[]
  onNewChat: () => void
  onSelectConversation: (id: string) => void
}

export function ChatSidebar({
  conversations,
  onNewChat,
  onSelectConversation,
}: ChatSidebarProps) {
  const today = conversations.slice(0, 3)
  const yesterday = conversations.slice(3)

  return (
    <div className="flex flex-col overflow-hidden border-r border-[var(--edu-gray-200)] bg-white">
      {/* Header */}
      <div className="border-b border-[var(--edu-gray-200)] p-3.5">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-[7px] rounded-[9px] bg-[var(--edu-primary)] px-3.5 py-[9px] text-[13px] font-bold text-white transition-all hover:-translate-y-px hover:bg-[#1d4ed8]"
        >
          ＋ Cuộc trò chuyện mới
        </button>
      </div>

      {/* Today */}
      <SectionLabel>Hôm nay</SectionLabel>
      <div className="overflow-y-auto px-2 pb-3">
        {today.map((c) => (
          <ConversationItem
            key={c.id}
            conversation={c}
            onSelect={onSelectConversation}
          />
        ))}
      </div>

      {/* Yesterday */}
      <SectionLabel>Hôm qua</SectionLabel>
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {yesterday.map((c) => (
          <ConversationItem
            key={c.id}
            conversation={c}
            onSelect={onSelectConversation}
          />
        ))}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3.5 pb-1.5 pt-3 text-[10px] font-bold uppercase tracking-[1px] text-[var(--edu-gray-400)]">
      {children}
    </div>
  )
}

function ConversationItem({
  conversation: c,
  onSelect,
}: {
  conversation: ChatConversation
  onSelect: (id: string) => void
}) {
  return (
    <button
      onClick={() => onSelect(c.id)}
      className={cn(
        'mb-0.5 w-full cursor-pointer rounded-lg px-2 py-[9px] text-left transition-colors hover:bg-[var(--edu-gray-100)]',
        c.isActive && 'bg-[var(--edu-primary-soft)]',
      )}
    >
      <div
        className={cn(
          'truncate text-[12.5px] font-semibold text-[var(--edu-gray-700)]',
          c.isActive && 'text-[var(--edu-primary)]',
        )}
      >
        {c.title}
      </div>
      <div className="mt-0.5 text-[11px] text-[var(--edu-gray-400)]">
        {c.meta}
      </div>
    </button>
  )
}