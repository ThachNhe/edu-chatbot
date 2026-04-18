import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useStudents, useStudentDetail } from '@/features/students'
import type { StudentOut } from '@/features/students'

export const Route = createFileRoute('/_authenticated/students')({
    component: StudentsPage,
})

function scoreColor(score: number) {
    if (score >= 8) return 'text-green-600'
    if (score >= 6.5) return 'text-yellow-600'
    return 'text-red-500'
}

function StudentHistoryPanel({ student, onClose }: { student: StudentOut; onClose: () => void }) {
    const { data, isLoading } = useStudentDetail(student.id)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#f1f5f9]">
                    <div>
                        <h2 className="font-bold text-[#1e293b] text-lg">{student.name}</h2>
                        <p className="text-sm text-gray-500">
                            {student.class_name && `Lớp ${student.class_name}`}
                            {student.student_code && ` • Mã: ${student.student_code}`}
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold transition">✕</button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Lịch sử thi</p>
                    {isLoading ? (
                        <div className="space-y-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : !data?.exam_history?.length ? (
                        <div className="text-center py-10 text-gray-400">
                            <div className="text-3xl mb-2">📭</div>
                            <p>Chưa có lượt thi nào</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {data.exam_history.map(h => (
                                <div key={h.score_id} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-[#e2e8f0]">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#1e293b] truncate">{h.exam_title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(h.taken_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <span className={`text-lg font-extrabold ml-4 ${scoreColor(h.score)}`}>
                                        {h.score.toFixed(1)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Stats footer */}
                {data?.exam_history && data.exam_history.length > 0 && (
                    <div className="px-5 py-3 border-t border-[#f1f5f9] bg-slate-50 grid grid-cols-3 gap-3 text-center text-sm">
                        <div>
                            <div className="font-bold text-[#1e293b] text-lg">{data.exam_history.length}</div>
                            <div className="text-xs text-gray-400">Lượt thi</div>
                        </div>
                        <div>
                            <div className={`font-bold text-lg ${scoreColor(data.exam_history.reduce((s, h) => s + h.score, 0) / data.exam_history.length)}`}>
                                {(data.exam_history.reduce((s, h) => s + h.score, 0) / data.exam_history.length).toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-400">Trung bình</div>
                        </div>
                        <div>
                            <div className={`font-bold text-lg ${scoreColor(Math.max(...data.exam_history.map(h => h.score)))}`}>
                                {Math.max(...data.exam_history.map(h => h.score)).toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-400">Điểm cao nhất</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function StudentsPage() {
    const [search, setSearch] = useState('')
    const [selectedStudent, setSelectedStudent] = useState<StudentOut | null>(null)

    const { data: students, isLoading } = useStudents({ search: search || undefined })

    return (
        <div className="flex-1 p-6 animate-fade-in">
            {selectedStudent && (
                <StudentHistoryPanel student={selectedStudent} onClose={() => setSelectedStudent(null)} />
            )}

            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl font-bold text-[#1e293b]">🎓 Quản lý Học sinh</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                    Học sinh đã tham gia kỳ thi của bạn
                    {students ? ` • ${students.length} học sinh` : ''}
                </p>
            </div>

            {/* Search */}
            <div className="mb-5">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="🔍 Tìm theo tên học sinh..."
                    className="w-full max-w-sm border border-[#e2e8f0] rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-gray-500 border-b border-[#e2e8f0]">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Mã HS</th>
                            <th className="px-4 py-3 font-semibold">Họ và Tên</th>
                            <th className="px-4 py-3 font-semibold">Lớp</th>
                            <th className="px-4 py-3 font-semibold">Email</th>
                            <th className="px-4 py-3 font-semibold text-center">Lịch sử thi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <tr key={i}>
                                    {[...Array(5)].map((_, j) => (
                                        <td key={j} className="px-4 py-3">
                                            <div className="h-4 bg-gray-100 rounded animate-pulse" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : students?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                                    <div className="text-3xl mb-2">🎓</div>
                                    <p>Chưa có học sinh nào tham gia kỳ thi của bạn</p>
                                </td>
                            </tr>
                        ) : (
                            students?.map(s => (
                                <tr key={s.id} className="hover:bg-slate-50 transition">
                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.student_code || '—'}</td>
                                    <td className="px-4 py-3 font-medium text-[#1e293b]">{s.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{s.class_name || '—'}</td>
                                    <td className="px-4 py-3 text-gray-500 text-xs">{s.email || '—'}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => setSelectedStudent(s)}
                                            className="text-xs text-[#1a56db] border border-blue-200 hover:border-blue-400 hover:bg-blue-50 px-3 py-1 rounded-lg font-medium transition"
                                        >
                                            Xem lịch sử
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
