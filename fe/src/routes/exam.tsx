import { createFileRoute } from '@tanstack/react-router'
import { ExamToolbar, ExamPreview } from '@/features/exam'

export const Route = createFileRoute('/exam')({
  component: ExamPage,
})

function ExamPage() {
  return (
    <div className="custom-scrollbar flex-1 overflow-y-auto p-6 animate-fade-in">
      <ExamToolbar onGenerate={() => {}} />
      <ExamPreview />
    </div>
  )
}