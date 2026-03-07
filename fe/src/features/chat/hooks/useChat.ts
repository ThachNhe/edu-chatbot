import { useState, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage, ChatConversation } from '../types/chat.types'

// Derive ws:// từ VITE_API_URL (http→ws, https→wss)
const WS_URL = (() => {
  const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8765'
  return apiUrl.replace(/^https?/, (s: any) => (s === 'https' ? 'wss' : 'ws')) + '/ws/chat'
})()

const AI_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'ai',
  content: 'Xin chào thầy/cô! Tôi là **EduAI** – trợ lý giảng dạy Tin học 12. Tôi có thể giúp:\n\n- Giải thích các khái niệm lập trình Pascal\n- Soạn câu hỏi và đề thi tự động\n- Gợi ý phương pháp dạy học hiệu quả\n\nHôm nay thầy/cô cần hỗ trợ gì?',
  timestamp: new Date(),
}

let msgIdCounter = 0
const genId = () => `msg-${Date.now()}-${++msgIdCounter}`

export type WsStatus = 'connecting' | 'open' | 'closed' | 'error'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([AI_GREETING])
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  const connectWs = useCallback(() => {
    // Đóng connection cũ mà không trigger status handler
    if (wsRef.current) {
      wsRef.current.onclose = null
      wsRef.current.close()
    }

    setWsStatus('connecting')
    const ws = new WebSocket(WS_URL)
    wsRef.current = ws

    ws.onopen = () => setWsStatus('open')

    ws.onmessage = (event) => {
      let data: { reply: string; is_answerable: boolean }
      try {
        data = JSON.parse(event.data as string)
      } catch {
        setIsTyping(false)
        return
      }
      setMessages((prev) => [
        ...prev,
        { id: genId(), role: 'ai', content: data.reply, timestamp: new Date() },
      ])
      setIsTyping(false)
      scrollToBottom()
    }

    ws.onerror = () => setWsStatus('error')
    ws.onclose = () => setWsStatus('closed')
  }, [scrollToBottom])

  useEffect(() => {
    connectWs()
    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
  }, [connectWs])

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return

      setMessages((prev) => [
        ...prev,
        { id: genId(), role: 'user', content: trimmed, timestamp: new Date() },
      ])
      setIsTyping(true)
      scrollToBottom()

      wsRef.current.send(JSON.stringify({ message: trimmed }))
    },
    [scrollToBottom],
  )

  // Tạo chat mới = reconnect WS (reset history phía server)
  const startNewChat = useCallback(() => {
    setMessages([AI_GREETING])
    setIsTyping(false)
    connectWs()
  }, [connectWs])

  const selectConversation = useCallback((id: string) => {
    setConversations((prev) => prev.map((c) => ({ ...c, isActive: c.id === id })))
  }, [])

  return {
    messages,
    conversations,
    isTyping,
    wsStatus,
    messagesEndRef,
    sendMessage,
    startNewChat,
    selectConversation,
  }
}