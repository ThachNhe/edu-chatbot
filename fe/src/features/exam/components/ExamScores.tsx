import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useExamScores } from '../hooks/useExam'
import type { ExamOut, ScoreWithStudent } from '../types/exam.type'

interface ExamScoresProps {
    exam: ExamOut | null
    onClose: () => void
}

export function ExamScores({ exam, onClose }: ExamScoresProps) {
    const { data: scores, isLoading } = useExamScores(exam?.id ?? null)

    const avg = scores?.length
        ? (scores.reduce((s, r) => s + r.score, 0) / scores.length).toFixed(2)
        : '-'
    const passed = scores?.filter((s) => s.score >= 5).length ?? 0
    const highest = scores?.length ? Math.max(...scores.map((s) => s.score)) : 0
    const lowest = scores?.length ? Math.min(...scores.map((s) => s.score)) : 0

    const scoreColor = (score: number) => {
        if (score >= 8) return 'text-[#10b981] font-extrabold'
        if (score >= 5) return 'text-[#d97706] font-bold'
        return 'text-[#ef4444] font-bold'
    }

    return (
        <Dialog open={exam !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle>📊 Thống kê bài thi</DialogTitle>
                    {exam && (
                        <p className="text-[12px] text-[#94a3b8] mt-0.5">{exam.title}</p>
                    )}
                </DialogHeader>

                {isLoading ? (
                    <div className="flex items-center justify-center py-10 text-[14px] text-[#94a3b8]">
                        ⏳ Đang tải...
                    </div>
                ) : !scores?.length ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <div className="text-5xl mb-3">📭</div>
                        <p className="text-[14px] font-semibold text-[#475569]">Chưa có học sinh nào làm bài</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 overflow-hidden">
                        {/* Summary stats */}
                        <div className="grid grid-cols-4 gap-3">
                            {[
                                { label: 'Số lượt thi', value: scores.length, icon: '👥', color: 'text-[#1a56db]' },
                                { label: 'Điểm TB', value: avg, icon: '📈', color: 'text-[#d97706]' },
                                { label: 'Đạt (≥5)', value: `${passed}/${scores.length}`, icon: '✅', color: 'text-[#10b981]' },
                                { label: 'Cao nhất', value: highest.toFixed(1), icon: '🏆', color: 'text-[#7c3aed]' },
                            ].map((stat) => (
                                <div key={stat.label} className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-3 text-center">
                                    <div className="text-xl mb-1">{stat.icon}</div>
                                    <div className={`text-[20px] font-extrabold ${stat.color}`}>{stat.value}</div>
                                    <div className="text-[11px] text-[#94a3b8] mt-0.5">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Score distribution bar */}
                        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
                            <p className="text-[12px] font-bold text-[#475569] mb-3">Phân bổ điểm số</p>
                            <div className="flex items-end gap-1 h-12">
                                {[
                                    { range: '0-2', color: 'bg-[#fee2e2]', border: 'border-[#ef4444]' },
                                    { range: '2-4', color: 'bg-[#ffedd5]', border: 'border-[#f97316]' },
                                    { range: '4-6', color: 'bg-[#fef3c7]', border: 'border-[#d97706]' },
                                    { range: '6-8', color: 'bg-[#d1fae5]', border: 'border-[#10b981]' },
                                    { range: '8-10', color: 'bg-[#dbeafe]', border: 'border-[#1a56db]' },
                                ].map((bucket) => {
                                    const [lo, hi] = bucket.range.split('-').map(Number)
                                    const count = scores.filter((s) => s.score >= lo && s.score < hi + (hi === 10 ? 0.01 : 0)).length
                                    const pct = scores.length ? (count / scores.length) * 100 : 0
                                    return (
                                        <div key={bucket.range} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-[10px] text-[#94a3b8]">{count}</span>
                                            <div
                                                className={`w-full rounded-t border ${bucket.color} ${bucket.border} transition-all`}
                                                style={{ height: `${Math.max(pct, 3)}%` }}
                                            />
                                            <span className="text-[9px] text-[#94a3b8]">{bucket.range}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-y-auto rounded-xl border border-[#e2e8f0]">
                            <table className="w-full text-[13px]">
                                <thead>
                                    <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] text-left">
                                        <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">#</th>
                                        <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Họ tên</th>
                                        <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Mã HS</th>
                                        <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Lớp</th>
                                        <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Điểm</th>
                                        <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-[#94a3b8]">Thời gian nộp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {scores.map((s, i) => (
                                        <tr key={s.id} className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc]">
                                            <td className="px-4 py-2.5 text-[#94a3b8]">{i + 1}</td>
                                            <td className="px-4 py-2.5 font-semibold text-[#1e293b]">{s.student_name}</td>
                                            <td className="px-4 py-2.5 font-mono text-[#475569]">{s.student_code ?? '-'}</td>
                                            <td className="px-4 py-2.5 text-[#475569]">{s.student_class ?? '-'}</td>
                                            <td className={`px-4 py-2.5 text-[15px] ${scoreColor(s.score)}`}>
                                                {s.score.toFixed(1)}
                                            </td>
                                            <td className="px-4 py-2.5 text-[#94a3b8]">
                                                {new Date(s.taken_at).toLocaleString('vi-VN')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}