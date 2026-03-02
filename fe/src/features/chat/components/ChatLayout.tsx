import { ChatSidebar } from './ChatSidebar'
import { ChatMain } from './ChatMain'
import { ChatRightPanel } from './ChatRightPanel'
import { useChat } from '../hooks/useChat'

export function ChatLayout() {
  const {
    messages,
    conversations,
    isTyping,
    messagesEndRef,
    sendMessage,
    startNewChat,
    selectConversation,
  } = useChat()

  const handleTopicClick = (topic: string) => {
    sendMessage(`Hãy giải thích về: ${topic}`)
  }

  return (
    <div className="grid h-[calc(100vh-58px)] grid-cols-[220px_1fr_240px] overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        onNewChat={startNewChat}
        onSelectConversation={selectConversation}
      />
      <ChatMain
        messages={messages}
        isTyping={isTyping}
        messagesEndRef={messagesEndRef}
        onSend={sendMessage}
      />
      <ChatRightPanel onTopicClick={handleTopicClick} />
    </div>
  )
}