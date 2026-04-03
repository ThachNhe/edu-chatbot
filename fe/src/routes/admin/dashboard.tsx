import { createFileRoute } from '@tanstack/react-router'
import { useAdminStats } from '@/features/admin'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: stats, isLoading } = useAdminStats()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bảng điều khiển</h1>
      {isLoading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 transition hover:shadow-md">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="text-gray-500 font-medium text-sm">Tổng Học sinh</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats?.total_students || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 transition hover:shadow-md">
            <div className="text-3xl mb-3">👨‍🏫</div>
            <h3 className="text-gray-500 font-medium text-sm">Tổng Giáo viên</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.total_teachers || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 transition hover:shadow-md">
            <div className="text-3xl mb-3">📄</div>
            <h3 className="text-gray-500 font-medium text-sm">Tổng Đề thi</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats?.total_exams || 0}</p>
          </div>
        </div>
      )}
    </div>
  )
}
