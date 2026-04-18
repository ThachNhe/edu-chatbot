import type { LucideIcon } from 'lucide-react'

export type LessonStatus = 'done' | 'wip' | 'todo'

export interface Lesson {
  number: string
  name: string
  desc: string
  icon: LucideIcon
  iconBg: string
  chapter: string
  status: LessonStatus
  questionCount: number
}