// ─── Config (giáo viên cấu hình khi tạo) ──────────────────────────────────

export type DifficultyLevel = 'easy' | 'med' | 'hard' | 'mixed'

export interface ExamConfig {
  topic: string
  questionCount: number
  difficulty: DifficultyLevel
  duration: string
}

// ─── Generated: AI trả về, chưa lưu DB ────────────────────────────────────

export interface ExamOption {
  letter: string
  content: string
  is_correct: boolean
}

export interface ExamQuestion {
  number?: number
  id?: number
  content: string
  level: 'easy' | 'med' | 'hard'
  options: ExamOption[]
}

// ─── API Response types ────────────────────────────────────────────────────

export interface OptionOut {
  id: number
  letter: string
  content: string
  is_correct: boolean
}

export interface QuestionOut {
  id: number
  content: string
  level: 'easy' | 'med' | 'hard'
  options: OptionOut[]
}

export interface ExamOut {
  id: number
  title: string
  topic: string | null
  duration: string
  level_mix: string
  status: 'draft' | 'published'
  created_at: string
}

export interface ExamDetail extends ExamOut {
  questions: QuestionOut[]
}

export interface RoomOut {
  id: number
  access_code: string
  is_active: boolean
  expires_at: string | null
  created_at: string
}

// ─── Student view (no answers) ─────────────────────────────────────────────

export interface StudentOption {
  id: number
  letter: string
  content: string
}

export interface StudentQuestion {
  id: number
  content: string
  level: 'easy' | 'med' | 'hard'
  options: StudentOption[]
}

export interface StudentExam {
  id: number
  title: string
  topic: string | null
  duration: string
  questions: StudentQuestion[]
}

export interface SubmitResult {
  score: number
  total: number
  correct: number
  student_id: number
}


export interface ScoreWithStudent {
  id: number
  student_name: string
  student_class: string | null
  student_code: string | null
  student_email: string | null
  score: number
  taken_at: string
}