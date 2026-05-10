import { ChatSidebar } from './ChatSidebar'
import { ChatMain } from './ChatMain'
import { ChatRightPanel } from './ChatRightPanel'
import { useChat } from '../hooks/useChat'

export function ChatLayout() {
  const {
    messages,
    conversations,
    isTyping,
    isCreatingExam,
    messagesEndRef,
    sendMessage,
    wsStatus,
    startNewChat,
    selectConversation,
    createExamFromFile,
  } = useChat()

  const handleTopicClick = (topic: string) => {
    sendMessage(`Hãy giải thích về: ${topic}`)
  }

  return (
    <div className="grid h-[calc(100vh-58px)] grid-cols-[240px_1fr_260px] overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        onNewChat={startNewChat}
        onSelectConversation={selectConversation}
      />
      <ChatMain
        messages={messages}
        isTyping={isTyping}
        isCreatingExam={isCreatingExam}
        messagesEndRef={messagesEndRef}
        onSend={sendMessage}
        onCreateExamFromFile={createExamFromFile}
        wsStatus={wsStatus}
      />
      <ChatRightPanel onTopicClick={handleTopicClick} />
    </div>
  )
}