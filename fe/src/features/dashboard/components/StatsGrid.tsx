import { useDashboardSummary } from '../hooks/useDashboardData'

const ICON_CONFIG = [
  { icon: '📚', iconBg: 'linear-gradient(135deg,#dbeafe,#eff6ff)', valueColor: '#1a56db', label: 'Bài học đã soạn', key: 'lesson' as const },
  { icon: '📝', iconBg: 'linear-gradient(135deg,#d1fae5,#ecfdf5)', valueColor: '#10b981', label: 'Đề thi đã tạo', key: 'exam' as const },
  { icon: '🎓', iconBg: 'linear-gradient(135deg,#fef3c7,#fffbeb)', valueColor: '#f59e0b', label: 'Học sinh đang học', key: 'student' as const },
  { icon: '🤖', iconBg: 'linear-gradient(135deg,#ede9fe,#f5f3ff)', valueColor: '#7c3aed', label: 'Lượt hỏi AI hôm nay', key: 'ai' as const },
]

export function StatsGrid() {
  const { data, isLoading } = useDashboardSummary()

  const values = data
    ? {
        lesson: data.lesson_count,
        exam: data.exam_count,
        student: data.student_count,
        ai: data.ai_query_count,
      }
    : { lesson: 0, exam: 0, student: 0, ai: 0 }

  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {ICON_CONFIG.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-white bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-3 flex items-center justify-between">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl text-xl shadow-sm"
              style={{ background: stat.iconBg }}
            >
              {stat.icon}
            </div>
          </div>
          <div
            className="text-[26px] font-extrabold leading-none"
            style={{ color: stat.valueColor }}
          >
            {isLoading ? (
              <span className="inline-block h-7 w-12 animate-pulse rounded bg-gray-100" />
            ) : (
              values[stat.key]
            )}
          </div>
          <div className="mt-1 text-[12px] font-medium text-gray-400">{stat.label}</div>
          <div
            className="absolute bottom-0 left-0 h-[3px] w-full rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: stat.valueColor }}
          />
        </div>
      ))}
    </div>
  )
}