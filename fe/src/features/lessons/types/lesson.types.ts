export type LessonStatus = 'done' | 'wip' | 'todo'

export interface Lesson {
  number: string
  name: string
  desc: string
  icon: string
  iconBg: string
  chapter: string
  status: LessonStatus
  questionCount: number
}