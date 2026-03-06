import { createFileRoute } from '@tanstack/react-router'
import { ChatLayout } from '@/features/chat'

export const Route = createFileRoute('/_authenticated/chat')({
  component: ChatPage,
})

function ChatPage() {
  return <ChatLayout />
}