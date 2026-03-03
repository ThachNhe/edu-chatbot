export type DifficultyLevel = 'easy' | 'med' | 'hard'

export interface ExamOption {
  letter: string
  text: string
  isCorrect?: boolean
}

export interface ExamQuestion {
  number: number
  text: string
  level: DifficultyLevel
  options: ExamOption[]
}

export interface ExamConfig {
  topic: string
  questionCount: number
  difficulty: string
  duration: string
}