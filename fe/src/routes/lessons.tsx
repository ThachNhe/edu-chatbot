import { createFileRoute } from '@tanstack/react-router'
import { LessonToolbar, LessonTable } from '@/features/lessons'

export const Route = createFileRoute('/lessons')({
  component: LessonsPage,
})

function LessonsPage() {
  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto p-6 animate-fade-in">
      <LessonToolbar />
      <LessonTable />
    </div>
  )
}