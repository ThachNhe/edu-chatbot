import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'
import { SuggestedQuestions } from './SuggestedQuestions'
import type { ChatMessage } from '../types/chat.types'
import type { WsStatus } from '../hooks/useChat'
import type { ExamCreateOptions } from './CreateExamPanel'
import { Bot, Trash2, Settings2, Loader2, AlertTriangle } from 'lucide-react'

interface ChatMainProps {
  messages: ChatMessage[]
  isTyping: boolean
  wsStatus: WsStatus
  isCreatingExam: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
  onSend: (text: string) => void
  onCreateExamFromFile: (opts: ExamCreateOptions) => Promise<void>
}

export function ChatMain({ messages, isTyping, wsStatus, isCreatingExam, messagesEndRef, onSend, onCreateExamFromFile }: ChatMainProps) {
  const isDisconnected = wsStatus !== 'open'

  return (
    <div className="flex flex-col overflow-hidden bg-[#f8faff]">
      {/* Topbar */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white px-5 py-3">
        <div className="flex items-center gap-2 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-[5px] text-[12.5px] font-bold text-[#1a56db]">
          <span className={`h-[7px] w-[7px] rounded-full ${wsStatus === 'open' ? 'animate-pulse bg-[#10b981]' :
            wsStatus === 'connecting' ? 'animate-pulse bg-amber-400' :
              'bg-red-400'
            }`} />
          <Bot size={14} /> EduAI – Tin học 12
        </div>
        <div className="flex items-center gap-2">
          <TopbarBtn title="Xóa"><Trash2 size={16} /></TopbarBtn>
          <TopbarBtn title="Cài đặt"><Settings2 size={16} /></TopbarBtn>
        </div>
      </div>

      {/* Connection banner */}
      {isDisconnected && (
        <div className={`flex-shrink-0 px-5 py-2 text-center text-[12px] font-medium ${wsStatus === 'connecting' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-600'
          }`}>
          {wsStatus === 'connecting'
            ? <><Loader2 size={13} className="animate-spin inline mr-1" /> Đang kết nối tới AI...</>
            : <><AlertTriangle size={13} className="inline mr-1" /> Mất kết nối. Hãy bắt đầu cuộc trò chuyện mới để thử lại.</>}
        </div>
      )}

      {/* Messages */}
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-[#e2e8f0]">
        {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
        {(isTyping || isCreatingExam) && (
          <MessageBubble
            message={{ id: isCreatingExam ? 'creating-exam' : 'typing', role: 'ai', content: '', timestamp: new Date() }}
            isTyping
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white">
        <SuggestedQuestions onSelect={onSend} />
      </div>

      <ChatInput onSend={onSend} onCreateExamFromFile={onCreateExamFromFile} disabled={isDisconnected} isCreatingExam={isCreatingExam} />
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