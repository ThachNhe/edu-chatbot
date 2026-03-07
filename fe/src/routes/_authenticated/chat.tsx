import { createFileRoute } from '@tanstack/react-router'
import { ChatLayout } from '@/features/chat'
import { z } from 'zod'

const chatSearchSchema = z.object({
  conversationId: z.number().int().positive().optional(),
})

export const Route = createFileRoute('/_authenticated/chat')({
  validateSearch: chatSearchSchema,
  component: ChatPage,
})

function ChatPage() {
  return <ChatLayout />
}