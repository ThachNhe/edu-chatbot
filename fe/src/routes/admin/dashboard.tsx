import { createFileRoute } from '@tanstack/react-router'
import { useAdminStats, useAdminTrends, useTopTeachers } from '@/features/admin'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
})

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-md transition">
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className={`text-3xl font-extrabold mt-1 ${color}`}>{value}</p>
    </div>
  )
}

function TrendChart({ data }: { data: { date: string; exams: number; submissions: number }[] }) {
  const maxVal = Math.max(...data.flatMap(d => [d.exams, d.submissions]), 1)
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-[#1e293b] text-sm">📈 Hoạt động 7 ngày gần đây</h3>
        <div className="flex gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full bg-blue-500" />Đề thi</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-full bg-emerald-400" />Lượt nộp</span>
        </div>
      </div>
      <div className="flex items-end gap-3 h-36">
        {data.map(d => (
          <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-1 items-end" style={{ height: 100 }}>
              <div
                className="flex-1 bg-blue-500 rounded-t-md opacity-80 transition-all"
                style={{ height: `${(d.exams / maxVal) * 100}%`, minHeight: d.exams > 0 ? 4 : 0 }}
                title={`Đề thi: ${d.exams}`}
              />
              <div
                className="flex-1 bg-emerald-400 rounded-t-md opacity-80 transition-all"
                style={{ height: `${(d.submissions / maxVal) * 100}%`, minHeight: d.submissions > 0 ? 4 : 0 }}
                title={`Nộp bài: ${d.submissions}`}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{d.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TopTeachersCard({ data }: { data: { id: number; name: string; exam_count: number; student_count: number; question_count: number }[] }) {
  const maxExams = Math.max(...data.map(t => t.exam_count), 1)
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] p-5">
      <h3 className="font-bold text-[#1e293b] text-sm mb-4">🏆 Top giáo viên tích cực</h3>
      <div className="space-y-4">
        {data.map((t, i) => (
          <div key={t.id} className="flex items-center gap-3">
            <span className={`text-sm font-extrabold w-6 text-center ${i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-gray-300'}`}>
              #{i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[#1e293b] truncate">{t.name}</span>
                <div className="flex gap-3 text-[11px] text-gray-400 shrink-0 ml-2">
                  <span>📝 {t.exam_count}</span>
                  <span>🎓 {t.student_count}</span>
                  <span>❓ {t.question_count}</span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all"
                  style={{ width: `${(t.exam_count / maxExams) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-sm text-gray-400 text-center py-4">Chưa có dữ liệu</p>}
      </div>
    </div>
  )
}

function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: trends, isLoading: trendsLoading } = useAdminTrends(7)
  const { data: topTeachers, isLoading: teachersLoading } = useTopTeachers(5)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1e293b]">Bảng điều khiển</h1>
        <span className="text-xs text-gray-400">Cập nhật theo thời gian thực</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 animate-pulse h-28" />
          ))
        ) : (
          <>
            <StatCard icon="🎓" label="Tổng Học sinh" value={stats?.total_students ?? 0} color="text-blue-600" />
            <StatCard icon="👨‍🏫" label="Giáo viên" value={stats?.total_teachers ?? 0} color="text-purple-600" />
            <StatCard icon="📄" label="Đề thi" value={stats?.total_exams ?? 0} color="text-green-600" />
            <StatCard icon="❓" label="Câu hỏi" value={stats?.total_questions ?? 0} color="text-orange-500" />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {trendsLoading ? (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] h-52 animate-pulse" />
        ) : (
          <TrendChart data={trends ?? []} />
        )}

        {teachersLoading ? (
          <div className="bg-white rounded-2xl border border-[#e2e8f0] h-52 animate-pulse" />
        ) : (
          <TopTeachersCard data={topTeachers ?? []} />
        )}
      </div>
    </div>
  )
}

