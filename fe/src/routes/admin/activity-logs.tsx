import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useActivityLogs } from '@/features/admin'

export const Route = createFileRoute('/admin/activity-logs')({
    component: ActivityLogsPage,
})

const ACTION_LABELS: Record<string, { label: string; color: string; icon: string }> = {
    login: { label: 'Đăng nhập', color: 'bg-green-100 text-green-700', icon: '🔑' },
    create_exam: { label: 'Tạo đề thi', color: 'bg-blue-100 text-blue-700', icon: '📝' },
    delete_exam: { label: 'Xóa đề thi', color: 'bg-red-100 text-red-700', icon: '🗑️' },
    create_question: { label: 'Tạo câu hỏi', color: 'bg-purple-100 text-purple-700', icon: '❓' },
    delete_question: { label: 'Xóa câu hỏi', color: 'bg-red-100 text-red-700', icon: '❌' },
    create_room: { label: 'Tạo phòng thi', color: 'bg-cyan-100 text-cyan-700', icon: '🏫' },
    create_student: { label: 'Thêm HS', color: 'bg-orange-100 text-orange-700', icon: '🎓' },
    create_instructor: { label: 'Thêm GV', color: 'bg-indigo-100 text-indigo-700', icon: '👨‍🏫' },
    lock_user: { label: 'Khóa TK', color: 'bg-red-100 text-red-700', icon: '🔒' },
    unlock_user: { label: 'Mở khóa TK', color: 'bg-yellow-100 text-yellow-700', icon: '🔓' },
}

const ACTION_OPTIONS = [
    { value: '', label: 'Tất cả hành động' },
    { value: 'login', label: '🔑 Đăng nhập' },
    { value: 'create_exam', label: '📝 Tạo đề thi' },
    { value: 'delete_exam', label: '🗑️ Xóa đề thi' },
    { value: 'create_question', label: '❓ Tạo câu hỏi' },
    { value: 'delete_question', label: '❌ Xóa câu hỏi' },
    { value: 'create_room', label: '🏫 Tạo phòng thi' },
    { value: 'create_student', label: '🎓 Thêm HS' },
    { value: 'create_instructor', label: '👨‍🏫 Thêm GV' },
]

function formatTime(isoStr: string) {
    const d = new Date(isoStr)
    return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
}

function ActivityLogsPage() {
    const [actionFilter, setActionFilter] = useState('')
    const [page, setPage] = useState(0)
    const limit = 30

    const { data: logs, isLoading } = useActivityLogs({
        action: actionFilter || undefined,
        skip: page * limit,
        limit,
    })

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-xl font-bold text-[#1e293b]">📋 Nhật ký hoạt động</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Theo dõi toàn bộ hành động trong hệ thống</p>
                </div>
                <select
                    value={actionFilter}
                    onChange={e => { setActionFilter(e.target.value); setPage(0) }}
                    className="border border-[#e2e8f0] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none cursor-pointer"
                >
                    {ACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-[#e2e8f0] text-gray-500">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Thời gian</th>
                            <th className="px-4 py-3 font-semibold">Người dùng</th>
                            <th className="px-4 py-3 font-semibold">Hành động</th>
                            <th className="px-4 py-3 font-semibold">Chi tiết</th>
                            <th className="px-4 py-3 font-semibold">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {isLoading ? (
                            [...Array(8)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(5)].map((_, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : logs?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                                    <div className="text-3xl mb-2">📭</div>
                                    <p>Chưa có bản ghi hoạt động nào</p>
                                </td>
                            </tr>
                        ) : (
                            logs?.map(log => {
                                const meta = ACTION_LABELS[log.action] ?? { label: log.action, color: 'bg-gray-100 text-gray-600', icon: '⚙️' }
                                return (
                                    <tr key={log.id} className="hover:bg-slate-50 transition">
                                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatTime(log.created_at)}</td>
                                        <td className="px-4 py-3 font-medium text-[#1e293b]">{log.user_name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${meta.color}`}>
                                                {meta.icon} {meta.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-gray-500 max-w-xs truncate">{log.detail || '—'}</td>
                                        <td className="px-4 py-3 text-xs text-gray-400 font-mono">{log.ip_address || '—'}</td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <span>Trang {page + 1}</span>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg hover:bg-slate-50 disabled:opacity-40 transition"
                    >
                        ← Trước
                    </button>
                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={!logs || logs.length < limit}
                        className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg hover:bg-slate-50 disabled:opacity-40 transition"
                    >
                        Tiếp →
                    </button>
                </div>
            </div>
        </div>
    )
}
