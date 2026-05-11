import { useState } from 'react'
import {
    FileText,
    Clock,
    ClipboardList,
    CheckCircle2,
    Rocket,
    ChevronDown,
    ChevronUp,
    Loader2,
    Upload,
} from 'lucide-react'
import { examService } from '@/features/exam/services/exam.service'
import { CreateRoomModal } from '@/features/exam/components/CreateRoomModal'
import type { ExamDetail, RoomOut } from '@/features/exam/types/exam.type'

interface ChatExamResultProps {
    exam: ExamDetail
    onPublished?: (updated: ExamDetail) => void
}

const LEVEL_STYLES: Record<string, string> = {
    easy: 'bg-[#d1fae5] text-[#10b981]',
    med: 'bg-[#fef3c7] text-[#d97706]',
    hard: 'bg-[#fee2e2] text-[#ef4444]',
}
const LEVEL_LABELS: Record<string, string> = { easy: 'Dễ', med: 'TB', hard: 'Khó' }

export function ChatExamResult({ exam, onPublished }: ChatExamResultProps) {
    const [showQuestions, setShowQuestions] = useState(false)
    const [isCreatingRoom, setIsCreatingRoom] = useState(false)
    const [room, setRoom] = useState<RoomOut | null>(null)
    const [roomError, setRoomError] = useState('')
    const [examStatus, setExamStatus] = useState(exam.status)
    const [isPublishing, setIsPublishing] = useState(false)
    const [publishError, setPublishError] = useState('')

    const handleCreateRoom = async () => {
        setIsCreatingRoom(true)
        setRoomError('')
        try {
            const created = await examService.createRoom(exam.id)
            setRoom(created)
        } catch {
            setRoomError('Tạo phòng thi thất bại. Vui lòng thử lại.')
        } finally {
            setIsCreatingRoom(false)
        }
    }

    const handlePublish = async () => {
        setIsPublishing(true)
        setPublishError('')
        try {
            const updated = await examService.publish(exam.id)
            setExamStatus(updated.status)
            onPublished?.({ ...exam, status: updated.status })
        } catch {
            setPublishError('Xuất bản thất bại. Vui lòng thử lại.')
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <div className="mt-1 w-full max-w-[560px] overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1a56db] to-[#0ea5e9] px-5 py-4 text-white">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="flex items-center gap-2 text-[14px] font-extrabold leading-tight">
                        <FileText size={15} className="shrink-0" />
                        {exam.title}
                    </h3>
                    <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${examStatus === 'published'
                            ? 'bg-green-400/30 text-green-100'
                            : 'bg-white/20 text-white/80'
                            }`}
                    >
                        {examStatus === 'published' ? (
                            <><CheckCircle2 size={11} className="inline mr-1" />Đã xuất bản</>
                        ) : (
                            <><ClipboardList size={11} className="inline mr-1" />Nháp</>
                        )}
                    </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-4">
                    <div className="flex items-center gap-1.5 text-[12px] opacity-85">
                        <Clock size={12} /> {exam.duration} phút
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px] opacity-85">
                        <ClipboardList size={12} /> {exam.questions.length} câu hỏi
                    </div>
                </div>
            </div>

            {/* Accordion: questions */}
            <button
                onClick={() => setShowQuestions((v) => !v)}
                className="flex w-full items-center justify-between px-5 py-3 text-[12.5px] font-semibold text-[#475569] hover:bg-[#f8fafc] transition-colors"
            >
                <span>{showQuestions ? 'Ẩn câu hỏi' : 'Xem câu hỏi'}</span>
                {showQuestions ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showQuestions && (
                <div className="max-h-[420px] overflow-y-auto border-t border-[#f1f5f9] px-5 py-4 [scrollbar-width:thin]">
                    {exam.questions.map((q, i) => (
                        <div key={q.id} className="mb-5 last:mb-0">
                            {/* Question */}
                            <div className="mb-2 flex items-start gap-2">
                                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#eff6ff] text-[11px] font-extrabold text-[#1a56db]">
                                    {i + 1}
                                </div>
                                <div className="flex flex-1 items-start justify-between gap-2">
                                    <p className="flex-1 text-[13px] font-semibold leading-[1.5] text-[#1e293b]">
                                        {q.content}
                                    </p>
                                    <span
                                        className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ${LEVEL_STYLES[q.level] ?? ''}`}
                                    >
                                        {LEVEL_LABELS[q.level] ?? q.level}
                                    </span>
                                </div>
                            </div>
                            {/* Options */}
                            <div className="ml-8 grid grid-cols-1 gap-1">
                                {q.options.map((opt) => (
                                    <div
                                        key={opt.id}
                                        className={`rounded-lg px-3 py-1.5 text-[12px] leading-snug ${opt.is_correct
                                            ? 'bg-[#d1fae5] font-semibold text-[#10b981]'
                                            : 'bg-[#f8fafc] text-[#475569]'
                                            }`}
                                    >
                                        <span className="mr-1.5 font-bold">{opt.letter}.</span>
                                        {opt.content}
                                        {opt.is_correct && (
                                            <CheckCircle2 size={11} className="ml-1.5 inline text-[#10b981]" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 border-t border-[#f1f5f9] bg-[#f8fafc] px-5 py-3">
                {examStatus === 'draft' && (
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className="flex items-center gap-1.5 rounded-[9px] bg-[#10b981] px-4 py-2 text-[12.5px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isPublishing ? (
                            <><Loader2 size={13} className="animate-spin" />Đang xuất bản...</>
                        ) : (
                            <><Upload size={13} />Xuất bản đề thi</>
                        )}
                    </button>
                )}
                <button
                    onClick={handleCreateRoom}
                    disabled={isCreatingRoom}
                    className="flex items-center gap-1.5 rounded-[9px] bg-[#7c3aed] px-4 py-2 text-[12.5px] font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isCreatingRoom ? (
                        <><Loader2 size={13} className="animate-spin" />Đang tạo...</>
                    ) : (
                        <><Rocket size={13} />Tạo phòng thi</>
                    )}
                </button>
                {roomError && (
                    <span className="text-[12px] text-red-500">{roomError}</span>
                )}
                {publishError && (
                    <span className="text-[12px] text-red-500">{publishError}</span>
                )}
            </div>

            <CreateRoomModal room={room} onClose={() => setRoom(null)} />
        </div>
    )
}
