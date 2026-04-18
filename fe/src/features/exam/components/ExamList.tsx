import { useState } from 'react'
import { useExamList, useDeleteExam, useExamDetail, useCreateRoom, useToggleRoom } from '../hooks/useExam'
import type { ExamOut, RoomOut } from '../types/exam.type'
import { CreateRoomModal } from './CreateRoomModal'
import { ExamScores } from './ExamScores'
import { QUERY_KEYS } from '@/lib/constants'
import { examService } from '../services/exam.service'
import { useQuery } from '@tanstack/react-query'
import { ClipboardList, CheckCircle2, Pin, Clock, Target, Calendar, BarChart2, Loader2, Rocket, Trash2, Lock, LockOpen, Eye, ChevronUp, DoorOpen, Check, Inbox } from 'lucide-react'

const LEVEL_LABELS: Record<string, string> = {
    mixed: 'Hỗn hợp', easy: 'Dễ', med: 'Trung bình', hard: 'Khó',
}

export function ExamList() {
    const { data: exams, isLoading } = useExamList()
    const { mutate: deleteExam } = useDeleteExam()
    const [previewId, setPreviewId] = useState<number | null>(null)
    const [createdRoom, setCreatedRoom] = useState<RoomOut | null>(null)
    const [roomExamId, setRoomExamId] = useState<number | null>(null)
    const [statsExam, setStatsExam] = useState<ExamOut | null>(null)

    const { data: previewExam } = useExamDetail(previewId)
    const { mutate: createRoom, isPending: isCreatingRoom } = useCreateRoom(roomExamId ?? 0)
    const { mutate: toggleRoom } = useToggleRoom(roomExamId ?? 0)

    const handleCreateRoom = (exam: ExamOut) => {
        setRoomExamId(exam.id)
        createRoom(undefined, {
            onSuccess: (room) => setCreatedRoom(room),
        })
    }

    const handleToggleRoom = (exam: ExamOut, roomId: number) => {
        setRoomExamId(exam.id)
        toggleRoom(roomId)
    }

    const handleDelete = (exam: ExamOut) => {
        if (confirm(`Xóa đề thi "${exam.title}"?`)) deleteExam(exam.id)
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="flex items-center gap-2 text-[14px] text-[#94a3b8]"><Loader2 size={16} className="animate-spin" /> Đang tải...</div>
            </div>
        )
    }

    if (!exams?.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e2e8f0] bg-white py-20 text-center">
                <Inbox size={48} className="mb-3 text-[#94a3b8]" />
                <p className="text-[15px] font-semibold text-[#475569]">Chưa có đề thi nào</p>
                <p className="mt-1 text-[13px] text-[#94a3b8]">Chuyển sang tab "Tạo đề thi" để bắt đầu</p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-3">
                {exams.map((exam) => (
                    <ExamCard
                        key={exam.id}
                        exam={exam}
                        isPreviewOpen={previewId === exam.id}
                        previewExam={previewId === exam.id ? previewExam : undefined}
                        isCreatingRoom={isCreatingRoom && roomExamId === exam.id}
                        onTogglePreview={() => setPreviewId(previewId === exam.id ? null : exam.id)}
                        onCreateRoom={() => handleCreateRoom(exam)}
                        onToggleRoom={(roomId) => handleToggleRoom(exam, roomId)}
                        onViewStats={() => setStatsExam(exam)}
                        onDelete={() => handleDelete(exam)}
                    />
                ))}
            </div>

            <CreateRoomModal room={createdRoom} onClose={() => setCreatedRoom(null)} />
            <ExamScores exam={statsExam} onClose={() => setStatsExam(null)} />
        </>
    )
}

// ─── ExamCard ──────────────────────────────────────────────────────────────

function ExamCard({
    exam, isPreviewOpen, previewExam, isCreatingRoom,
    onTogglePreview, onCreateRoom, onToggleRoom, onViewStats, onDelete,
}: {
    exam: ExamOut
    isPreviewOpen: boolean
    previewExam: any
    isCreatingRoom: boolean
    onTogglePreview: () => void
    onCreateRoom: () => void
    onToggleRoom: (roomId: number) => void
    onViewStats: () => void
    onDelete: () => void
}) {
    const [showRooms, setShowRooms] = useState(false)
    const { data: rooms } = useQueryRooms(showRooms ? exam.id : null)

    return (
        <div className="rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            {/* Main row */}
            <div className="flex items-start gap-4 p-5">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-[14px] font-bold text-[#1e293b]">{exam.title}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${exam.status === 'published' ? 'bg-[#d1fae5] text-[#10b981]' : 'bg-[#f1f5f9] text-[#94a3b8]'
                            }`}>
                            {exam.status === 'published' ? <><CheckCircle2 size={11} className="inline mr-0.5" /> Xuất bản</> : <><ClipboardList size={11} className="inline mr-0.5" /> Nháp</>}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-[12px] text-[#94a3b8]">
                        {exam.topic && <span className="flex items-center gap-1"><Pin size={11} /> {exam.topic}</span>}
                        <span className="flex items-center gap-1"><Clock size={11} /> {exam.duration} phút</span>
                        <span className="flex items-center gap-1"><Target size={11} /> {LEVEL_LABELS[exam.level_mix]}</span>
                        <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(exam.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2">
                    <button
                        onClick={onTogglePreview}
                        className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] font-bold text-[#475569] hover:border-[#1a56db] hover:text-[#1a56db] transition-colors"
                    >
                        {isPreviewOpen ? <><ChevronUp size={13} className="inline" /> Ẩn</> : <><Eye size={13} className="inline" /> Xem trước</>}
                    </button>
                    <button
                        onClick={() => setShowRooms((v) => !v)}
                        className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] font-bold text-[#475569] hover:border-[#1a56db] hover:text-[#1a56db] transition-colors flex items-center gap-1"
                    >
                        <DoorOpen size={13} /> Phòng thi
                    </button>
                    <button
                        onClick={onViewStats}
                        className="rounded-lg border border-[#e2e8f0] px-3 py-1.5 text-[12px] font-bold text-[#475569] hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors flex items-center gap-1"
                    >
                        <BarChart2 size={13} /> Thống kê
                    </button>
                    <button
                        onClick={onCreateRoom}
                        disabled={isCreatingRoom}
                        className="rounded-lg bg-[#1a56db] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#1d4ed8] disabled:opacity-60 transition-colors"
                    >
                        {isCreatingRoom ? '⏳' : '🚀 Tạo phòng mới'}
                    </button>
                    <button
                        onClick={onDelete}
                        className="rounded-lg border border-[#fee2e2] px-3 py-1.5 text-[12px] font-bold text-[#ef4444] hover:bg-[#fee2e2] transition-colors"
                    >
                        🗑️
                    </button>
                </div>
            </div>

            {/* Rooms panel */}
            {showRooms && (
                <div className="border-t border-[#f1f5f9] px-5 py-4">
                    <p className="mb-3 text-[12px] font-bold text-[#475569] flex items-center gap-1"><DoorOpen size={13} /> Danh sách phòng thi</p>
                    {!rooms?.length ? (
                        <p className="text-[12px] text-[#94a3b8]">Chưa có phòng thi nào. Nhấn "Tạo phòng mới" để tạo.</p>
                    ) : (
                        <div className="space-y-2">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="flex items-center gap-3 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5"
                                >
                                    <span className={`h-2 w-2 rounded-full flex-shrink-0 ${room.is_active ? 'bg-[#10b981]' : 'bg-[#94a3b8]'}`} />
                                    <div className="flex-1">
                                        <p className="font-mono text-[12px] text-[#1a56db] break-all">
                                            {window.location.origin}/room/{room.access_code}
                                        </p>
                                        <p className="text-[11px] text-[#94a3b8] mt-0.5">
                                            {room.is_active ? 'Đang mở' : 'Đã khóa'}
                                            {room.expires_at && ` · Hết hạn ${new Date(room.expires_at).toLocaleString('vi-VN')}`}
                                            {' · '}Tạo lúc {new Date(room.created_at).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onToggleRoom(room.id)}
                                        className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-colors ${room.is_active
                                            ? 'bg-[#fee2e2] text-[#ef4444] hover:bg-[#fecaca]'
                                            : 'bg-[#d1fae5] text-[#10b981] hover:bg-[#a7f3d0]'
                                            }`}
                                    >
                                        {room.is_active ? <><Lock size={12} /> Khóa</> : <><LockOpen size={12} /> Mở</>}
                                    </button>
                                    <CopyButton code={room.access_code} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Preview panel */}
            {isPreviewOpen && previewExam && (
                <div className="border-t border-[#f1f5f9] px-5 py-4 space-y-3">
                    {previewExam.questions.map((q: any, i: number) => (
                        <div key={q.id} className="text-[13px]">
                            <p className="font-semibold text-[#1e293b]">
                                <span className="mr-2 inline-flex h-5 w-5 items-center justify-center rounded bg-[#eff6ff] text-[11px] font-extrabold text-[#1a56db]">
                                    {i + 1}
                                </span>
                                {q.content}
                            </p>
                            <div className="mt-1.5 grid grid-cols-2 gap-1.5 pl-7">
                                {q.options.map((o: any) => (
                                    <div
                                        key={o.letter}
                                        className={`rounded-lg px-3 py-1.5 text-[12px] ${o.is_correct ? 'bg-[#d1fae5] font-bold text-[#065f46]' : 'bg-[#f8fafc] text-[#334155]'
                                            }`}
                                    >
                                        <span className="font-bold mr-1">{o.letter}.</span>{o.content}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function CopyButton({ code }: { code: string }) {
    const [copied, setCopied] = useState(false)
    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/room/${code}`)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
            }}
            className="rounded-lg border border-[#e2e8f0] px-2.5 py-1.5 text-[11px] font-bold text-[#475569] hover:border-[#1a56db] hover:text-[#1a56db] transition-colors"
        >
            {copied ? <Check size={13} /> : <ClipboardList size={13} />}
        </button>
    )
}

// Hook lấy rooms theo exam_id (chỉ fetch khi showRooms = true)
function useQueryRooms(examId: number | null) {
    return useQuery({
        queryKey: QUERY_KEYS.EXAMS.ROOMS(examId!),
        queryFn: () => examService.listRooms(examId!),
        enabled: examId !== null,
    })
}