import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api'
import { API_ENDPOINTS } from '@/services/endpoints'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardSummary {
  user_name: string
  lesson_count: number
  lesson_goal: number
  exam_count: number
  exam_goal: number
  student_count: number
  ai_query_count: number
  ai_query_goal: number
  pending_questions: number
}

export interface ActivityItem {
  icon: string
  icon_bg: string
  title: string
  meta: string
}

export interface ScheduleItem {
  day: string
  title: string
  desc: string
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => apiGet<DashboardSummary>(API_ENDPOINTS.DASHBOARD.SUMMARY),
    staleTime: 30_000,
  })
}

export function useRecentActivity() {
  return useQuery<ActivityItem[]>({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: () => apiGet<ActivityItem[]>(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITY),
    staleTime: 30_000,
  })
}

export function useWeekSchedule() {
  return useQuery<ScheduleItem[]>({
    queryKey: ['dashboard', 'week-schedule'],
    queryFn: () => apiGet<ScheduleItem[]>(API_ENDPOINTS.DASHBOARD.WEEK_SCHEDULE),
    staleTime: 60_000,
  })
}
