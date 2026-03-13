import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StatsOverview {
  avg_score: number
  pass_rate: number
  need_support_count: number
  total_students: number
}

export interface ChapterScore {
  label: string
  avg: number
  pct: number
}

export interface DistributionBand {
  label: string
  color: string
  count: number
  pct: number
}

export interface ExamScoreItem {
  exam_title: string
  score: number
}

export interface StudentRankItem {
  student_id: number
  name: string
  class_name: string | null
  avatar: string
  scores: ExamScoreItem[]
  avg_score: number
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useStatsOverview() {
  return useQuery<StatsOverview>({
    queryKey: ['stats', 'overview'],
    queryFn: () => apiGet<StatsOverview>(API_ENDPOINTS.STATS.OVERVIEW),
    staleTime: 30_000,
  })
}

export function useChapterScores() {
  return useQuery<ChapterScore[]>({
    queryKey: ['stats', 'chapter-scores'],
    queryFn: () => apiGet<ChapterScore[]>(API_ENDPOINTS.STATS.CHAPTER_SCORES),
    staleTime: 30_000,
  })
}

export function useStudentDistribution() {
  return useQuery<DistributionBand[]>({
    queryKey: ['stats', 'student-distribution'],
    queryFn: () => apiGet<DistributionBand[]>(API_ENDPOINTS.STATS.STUDENT_DISTRIBUTION),
    staleTime: 30_000,
  })
}

export function useStudentRanking(className?: string) {
  return useQuery<StudentRankItem[]>({
    queryKey: ['stats', 'student-ranking', className],
    queryFn: () =>
      apiGet<StudentRankItem[]>(
        API_ENDPOINTS.STATS.STUDENT_RANKING,
        className ? { class_name: className } : undefined,
      ),
    staleTime: 30_000,
  })
}
