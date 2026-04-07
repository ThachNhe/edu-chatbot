import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import { useAuthStore } from '@/stores/useAuthStore'
import type { ChatMessage, ChatConversation } from '../types/chat.types'

const buildWsUrl = (token: string, conversationId?: number): string => {
  const apiUrl = import.meta.env.VITE_API_URL
  let wsBase: string
  if (apiUrl) {
    wsBase = apiUrl.replace(/^https?/, (s: string) => (s === 'https' ? 'wss' : 'ws'))
  } else {
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
    wsBase = `${proto}://${window.location.host}`
  }
  const params = new URLSearchParams({ token })
  if (conversationId !== undefined) {
    params.set('conversation_id', String(conversationId))
  }
  return `${wsBase}/api/ws/chat?${params.toString()}`
}

const AI_GREETING: ChatMessage = {
  id: 'greeting',
  role: 'ai',
  content: 'Xin chào thầy/cô! Tôi là **EduAI** – trợ lý giảng dạy Tin học 12...',
  timestamp: new Date(),
}

let msgIdCounter = 0
const genId = () => `msg-${Date.now()}-${++msgIdCounter}`

export type WsStatus = 'connecting' | 'open' | 'closed' | 'error'

export function useChat() {
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()

  // Đọc conversationId từ URL search params
  const { conversationId: urlConversationId } = useSearch({ from: '/_authenticated/chat' })

  const [messages, setMessages] = useState<ChatMessage[]>([AI_GREETING])
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<number | undefined>(urlConversationId)
  const [isTyping, setIsTyping] = useState(false)
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const activeConvIdRef = useRef<number | undefined>(urlConversationId)

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  // Cập nhật URL khi conversationId thay đổi
  const updateUrlConversationId = useCallback(
    (id: number | undefined) => {
      navigate({
        to: '/chat',
        search: id ? { conversationId: id } : {},
        replace: true,
      })
    },
    [navigate],
  )

  const refreshConversations = useCallback(() => {
    api
      .get<ChatConversation[]>(API_ENDPOINTS.CONVERSATIONS.LIST)
      .then((res) => setConversations(res.data))
      .catch(() => { })
  }, [])

  useEffect(() => {
    refreshConversations()
  }, [token, refreshConversations])

  const connectWs = useCallback(
    (conversationId?: number) => {
      if (!token) return

      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }

      setWsStatus('connecting')
      const ws = new WebSocket(buildWsUrl(token, conversationId))
      wsRef.current = ws

      ws.onopen = () => setWsStatus('open')

      ws.onmessage = (event) => {
        let data: { reply?: string; is_answerable?: boolean; conversation_id?: number }
        try {
          data = JSON.parse(event.data as string)
        } catch {
          setIsTyping(false)
          return
        }

        // Backend gửi conversation_id khi auto-tạo conversation mới
        if (data.conversation_id !== undefined) {
          activeConvIdRef.current = data.conversation_id
          setActiveConversationId(data.conversation_id)
          updateUrlConversationId(data.conversation_id) // ← cập nhật URL
          setConversations((prev) =>
            prev.map((c) => ({ ...c, isActive: c.id === data.conversation_id })),
          )
          refreshConversations()
          return
        }

        if (data.reply !== undefined) {
          setMessages((prev) => [
            ...prev,
            { id: genId(), role: 'ai', content: data.reply!, timestamp: new Date() },
          ])
          setIsTyping(false)
          scrollToBottom()
        }
      }

      ws.onerror = () => setWsStatus('error')
      ws.onclose = (event) => {
        setWsStatus('closed')
        // code 4001 = auth error, không reconnect
        if (event.code !== 4001) {
          // có thể reconnect sau vài giây nếu cần
        }
      }
    },
    [token, scrollToBottom, refreshConversations, updateUrlConversationId],
  )

  // Nếu có conversationId trên URL khi mount → load conversation đó
  useEffect(() => {
    if (urlConversationId) {
      api
        .get<{ messages: Array<{ id: number; role: string; content: string; created_at: string }> }>(
          API_ENDPOINTS.CONVERSATIONS.MESSAGES(urlConversationId),
        )
        .then((res) => {
          const loaded: ChatMessage[] = res.data.messages.map((m) => ({
            id: String(m.id),
            role: m.role as 'user' | 'ai',
            content: m.content,
            timestamp: new Date(m.created_at),
          }))
          setMessages([AI_GREETING, ...loaded])
          scrollToBottom()
        })
        .catch(() => { })

      connectWs(urlConversationId)
    } else {
      connectWs()
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // chỉ chạy 1 lần khi mount

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

  const startNewChat = useCallback(() => {
    setMessages([AI_GREETING])
    setIsTyping(false)
    setActiveConversationId(undefined)
    activeConvIdRef.current = undefined
    updateUrlConversationId(undefined) // xóa conversationId khỏi URL
    setConversations((prev) => prev.map((c) => ({ ...c, isActive: false })))
    connectWs()
  }, [connectWs, updateUrlConversationId])

  const selectConversation = useCallback(
    async (id: number) => {
      if (id === activeConvIdRef.current) return

      activeConvIdRef.current = id
      setActiveConversationId(id)
      updateUrlConversationId(id) // ← cập nhật URL
      setConversations((prev) => prev.map((c) => ({ ...c, isActive: c.id === id })))

      try {
        const res = await api.get<{
          messages: Array<{ id: number; role: string; content: string; created_at: string }>
        }>(API_ENDPOINTS.CONVERSATIONS.MESSAGES(id))

        const loaded: ChatMessage[] = res.data.messages.map((m) => ({
          id: String(m.id),
          role: m.role as 'user' | 'ai',
          content: m.content,
          timestamp: new Date(m.created_at),
        }))
        setMessages([AI_GREETING, ...loaded])
        scrollToBottom()
      } catch {
        // keep current messages
      }

      connectWs(id)
    },
    [connectWs, scrollToBottom, updateUrlConversationId],
  )

  return {
    messages,
    conversations,
    activeConversationId,
    isTyping,
    wsStatus,
    messagesEndRef,
    sendMessage,
    startNewChat,
    selectConversation,
  }
}