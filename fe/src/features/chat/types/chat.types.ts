export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

export interface ChatConversation {
  id: string
  title: string
  meta: string
  messages: ChatMessage[]
  isActive?: boolean
}

export interface TopicItem {
  icon: string
  label: string
  bgColor: string
  textColor: string
}