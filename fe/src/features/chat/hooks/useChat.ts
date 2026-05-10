import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { api } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'
import type { ChatMessage, ChatConversation } from '../types/chat.types'
import type { ExamDetail } from '@/features/exam/types/exam.type'
import type { ExamCreateOptions } from '../components/CreateExamPanel'

const buildWsUrl = (conversationId?: number): string => {
  const apiUrl = import.meta.env.VITE_API_URL
  let wsBase: string
  if (apiUrl) {
    wsBase = apiUrl.replace(/^https?/, (s: string) => (s === 'https' ? 'wss' : 'ws'))
  } else {
    const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
    wsBase = `${proto}://${window.location.host}`
  }
  const params = new URLSearchParams()
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
  const navigate = useNavigate()

  // Đọc conversationId từ URL search params
  const { conversationId: urlConversationId } = useSearch({ from: '/_authenticated/chat' })

  const [messages, setMessages] = useState<ChatMessage[]>([AI_GREETING])
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [activeConversationId, setActiveConversationId] = useState<number | undefined>(urlConversationId)
  const [isTyping, setIsTyping] = useState(false)
  const [wsStatus, setWsStatus] = useState<WsStatus>('connecting')
  const [isCreatingExam, setIsCreatingExam] = useState(false)

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
  }, [refreshConversations])

  const connectWs = useCallback(
    (conversationId?: number) => {
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }

      setWsStatus('connecting')
      const ws = new WebSocket(buildWsUrl(conversationId))
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
    [scrollToBottom, refreshConversations, updateUrlConversationId],
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

  // ─── Create exam from file ────────────────────────────────────────────────

  const difficultyLabel: Record<string, string> = {
    easy: 'Dễ',
    med: 'Trung bình',
    hard: 'Khó',
    mixed: 'Hỗn hợp',
  }

  const createExamFromFile = useCallback(
    async (opts: ExamCreateOptions) => {
      const userMsg: ChatMessage = {
        id: genId(),
        role: 'user',
        content: `📄 Tạo đề thi từ **"${opts.files.map((f) => f.name).join('", "')}"**\n- Tên đề: ${opts.title}\n- Số câu: ${opts.questionCount}\n- Mức độ: ${difficultyLabel[opts.difficulty] ?? opts.difficulty}\n- Thời gian: ${opts.duration} phút`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMsg])
      setIsCreatingExam(true)
      scrollToBottom()

      try {
        const formData = new FormData()
        formData.append('file', opts.files[0])
        formData.append('title', opts.title)
        formData.append('question_count', String(opts.questionCount))
        formData.append('difficulty', opts.difficulty)
        formData.append('duration', opts.duration)

        const res = await api.post<ExamDetail>(
          API_ENDPOINTS.EXAMS.GENERATE_FROM_FILE,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        )
        const exam = res.data

        const aiMsg: ChatMessage = {
          id: genId(),
          role: 'ai',
          content: `✅ Đã tạo đề thi **"${exam.title}"** thành công với ${exam.questions.length} câu hỏi.`,
          timestamp: new Date(),
          examDetail: exam,
        }
        setMessages((prev) => [...prev, aiMsg])
        scrollToBottom()

        // Lưu conversation vào DB để không mất khi F5
        try {
          const convRes = await api.post<{ id: number; title: string; created_at: string }>(
            API_ENDPOINTS.CONVERSATIONS.SAVE_WITH_MESSAGES,
            {
              title: `Tạo đề thi: ${exam.title}`,
              messages: [
                { role: 'user', content: userMsg.content },
                { role: 'ai', content: aiMsg.content },
              ],
            },
          )
          const newConvId = convRes.data.id
          activeConvIdRef.current = newConvId
          setActiveConversationId(newConvId)
          updateUrlConversationId(newConvId)
          refreshConversations()
          // Kết nối WS vào conversation mới để tiếp tục chat
          connectWs(newConvId)
        } catch {
          // Không ảnh hưởng UX nếu lưu thất bại
        }
      } catch (err: unknown) {
        const detail =
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ??
          'Tạo đề thi thất bại. Vui lòng thử lại.'
        const errMsg: ChatMessage = {
          id: genId(),
          role: 'ai',
          content: `❌ ${detail}`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errMsg])
        scrollToBottom()
      } finally {
        setIsCreatingExam(false)
      }
    },
    [scrollToBottom],
  )

  return {
    messages,
    conversations,
    activeConversationId,
    isTyping,
    isCreatingExam,
    wsStatus,
    messagesEndRef,
    sendMessage,
    startNewChat,
    selectConversation,
    createExamFromFile,
  }
}