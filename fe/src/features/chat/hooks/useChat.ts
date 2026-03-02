import { useState, useCallback, useRef } from 'react'
import type { ChatMessage, ChatConversation } from '../types/chat.types'

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  { id: '1', title: 'Vòng lặp FOR–DO trong Pascal', meta: '10 phút trước', messages: [], isActive: true },
  { id: '2', title: 'Giải thích con trỏ file', meta: '1 giờ trước', messages: [] },
  { id: '3', title: 'Bài tập mảng 2 chiều', meta: '3 giờ trước', messages: [] },
  { id: '4', title: 'Kiểu dữ liệu Record', meta: 'Hôm qua 15:30', messages: [] },
  { id: '5', title: 'Soạn đề kiểm tra chương 2', meta: 'Hôm qua 09:15', messages: [] },
  { id: '6', title: 'Thuật toán sắp xếp nổi bọt', meta: 'Hôm qua 08:00', messages: [] },
]

const AI_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'ai',
  content: `Xin chào thầy/cô! Tôi là <strong>EduAI</strong> – trợ lý giảng dạy Tin học 12. Tôi có thể giúp thầy/cô:<br><br>• Giải thích các khái niệm lập trình Pascal<br>• Soạn câu hỏi và đề thi tự động<br>• Gợi ý phương pháp dạy học hiệu quả<br>• Phân tích bài tập, code mẫu cho học sinh<br><br>Hôm nay thầy/cô cần hỗ trợ gì?`,
  timestamp: new Date(),
}

function escHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function getAIReply(q: string): string {
  const lower = q.toLowerCase()
  if (lower.includes('for') || lower.includes('vòng lặp'))
    return 'Vòng lặp <code>FOR–DO</code> trong Pascal dùng khi <strong>biết trước số lần lặp</strong>. Cú pháp:<br><code>for &lt;biến&gt; := &lt;đầu&gt; to &lt;cuối&gt; do &lt;câu lệnh&gt;;</code><br>Biến đếm tự tăng 1 sau mỗi vòng. Nếu muốn giảm, dùng <code>downto</code>.'
  if (lower.includes('mảng') || lower.includes('array'))
    return 'Khai báo mảng trong Pascal:<br><code>var a : array[1..100] of Integer;</code><br>Truy cập phần tử: <code>a[i]</code>. Cần nhớ chỉ số bắt đầu từ giá trị khai báo, thường là 1.'
  if (lower.includes('record'))
    return '<strong>Kiểu Record</strong> cho phép nhóm các trường có kiểu khác nhau:<br><code>type SinhVien = record<br>&nbsp;&nbsp;Ten: String;<br>&nbsp;&nbsp;Diem: Real;<br>end;</code>'
  return `Câu hỏi của thầy/cô: "<em>${escHtml(q)}</em>"<br><br>Đây là một chủ đề thú vị trong Tin học 12. Tôi đề nghị thầy/cô tham khảo thêm phần lý thuyết trong sách giáo khoa trang 45–52. Thầy/cô có muốn tôi tạo bài tập thực hành về chủ đề này không?`
}

let msgIdCounter = 0
function genId(): string {
  return `msg-${Date.now()}-${++msgIdCounter}`
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([AI_GREETING])
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return

      const userMsg: ChatMessage = {
        id: genId(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsTyping(true)
      scrollToBottom()

      // Simulate AI response
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: genId(),
          role: 'ai',
          content: getAIReply(text),
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMsg])
        setIsTyping(false)
        scrollToBottom()
      }, 1200)
    },
    [scrollToBottom],
  )

  const startNewChat = useCallback(() => {
    const newGreeting: ChatMessage = {
      id: genId(),
      role: 'ai',
      content:
        'Cuộc trò chuyện mới bắt đầu! Thầy/cô muốn hỏi về chủ đề gì trong Tin học 12?',
      timestamp: new Date(),
    }
    setMessages([newGreeting])
  }, [])

  const selectConversation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => ({ ...c, isActive: c.id === id })),
    )
  }, [])

  return {
    messages,
    conversations,
    isTyping,
    messagesEndRef,
    sendMessage,
    startNewChat,
    selectConversation,
  }
}