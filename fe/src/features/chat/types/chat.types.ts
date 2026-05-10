import type { ExamDetail } from '@/features/exam/types/exam.type'

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  examDetail?: ExamDetail
}

export interface ChatConversation {
  id: number
  title: string
  created_at: string
  isActive?: boolean
}

export interface TopicItem {
  icon: string
  label: string
  bgColor: string
  textColor: string
}