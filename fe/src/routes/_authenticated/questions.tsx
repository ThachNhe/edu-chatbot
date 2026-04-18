import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuestions, useCreateQuestion, useDeleteQuestion, useGenerateBankQuestions } from '@/features/questions'
import type { CreateQuestionPayload, GeneratedBankQuestion, GenerateQuestionsPayload } from '@/features/questions'
import { useCreateExamFromBank } from '@/features/exam'
import type { CreateExamFromBankPayload } from '@/features/exam'
import { BookOpen, Inbox, BookOpenCheck, Sparkles, ChevronDown, ChevronUp, Save, X, Pencil, ClipboardList, CheckSquare, Square } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/questions')({
    component: QuestionsPage,
})

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
    easy: { label: 'Dễ', color: 'bg-green-100 text-green-700' },
    med: { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-700' },
    hard: { label: 'Khó', color: 'bg-red-100 text-red-700' },
}

const TOPICS = [
    'Cấu trúc lặp (FOR, WHILE, REPEAT)',
    'Mảng một chiều',
    'Mảng hai chiều',
    'Chương trình con – Hàm và thủ tục',
    'Kiểu dữ liệu: Record',
    'Kiểu dữ liệu: Set',
    'Xử lý tệp',
    'Thuật toán sắp xếp',
    'Thuật toán tìm kiếm',
    'Lập trình hướng đối tượng',
    'Cơ sở dữ liệu quan hệ',
    'Biểu thức và phép toán',
]

const DEFAULT_FORM: CreateQuestionPayload = {
    content: '',
    level: 'easy',
    lesson_id: null,
    options: [
        { letter: 'A', content: '', is_correct: true },
        { letter: 'B', content: '', is_correct: false },
        { letter: 'C', content: '', is_correct: false },
        { letter: 'D', content: '', is_correct: false },
    ],
}

const DEFAULT_GEN: GenerateQuestionsPayload = {
    topic: TOPICS[0],
    count: 5,
    difficulty: 'mixed',
}

/* ---------- AI Generate Panel ---------- */
interface GeneratePanelProps {
    onClose: () => void
    onCreate: (payload: CreateQuestionPayload) => void
    isCreating: boolean
}

function GeneratePanel({ onClose, onCreate, isCreating }: GeneratePanelProps) {
    const [payload, setPayload] = useState<GenerateQuestionsPayload>(DEFAULT_GEN)
    const [generated, setGenerated] = useState<GeneratedBankQuestion[]>([])
    const [editList, setEditList] = useState<GeneratedBankQuestion[]>([])
    const [saveIdx, setSaveIdx] = useState(0)
    const [isSaving, setIsSaving] = useState(false)

    const { mutate: generate, isPending: isGenerating } = useGenerateBankQuestions()

    const handleGenerate = () => {
        generate(payload, {
            onSuccess: (data) => {
                setGenerated(data)
                setEditList(data.map(q => ({
                    ...q,
                    options: q.options.map(o => ({ ...o })),
                })))
                setSaveIdx(0)
            },
        })
    }

    const handleOptionChange = (qi: number, oi: number, field: 'content' | 'is_correct', value: string | boolean) => {
        setEditList(prev => prev.map((q, qi2) => {
            if (qi2 !== qi) return q
            return {
                ...q,
                options: q.options.map((o, oi2) => {
                    if (field === 'is_correct') return { ...o, is_correct: oi2 === oi }
                    return oi2 === oi ? { ...o, [field]: value } : o
                }),
            }
        }))
    }

    const handleBulkSave = async () => {
        setIsSaving(true)
        setSaveIdx(0)
        for (let i = 0; i < editList.length; i++) {
            const q = editList[i]
            await new Promise<void>((resolve) => {
                onCreate(
                    {
                        content: q.content,
                        level: q.level,
                        lesson_id: null,
                        options: q.options,
                    },
                    // @ts-ignore — useMutation callback
                    { onSettled: resolve },
                )
            })
            setSaveIdx(i + 1)
        }
        setIsSaving(false)
        setGenerated([])
        setEditList([])
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 mb-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[#1e293b] flex items-center gap-2">
                    <Sparkles size={16} className="text-blue-600" /> AI Tạo câu hỏi
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                    <X size={18} />
                </button>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex-1 min-w-48">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Chủ đề</label>
                    <select
                        value={payload.topic}
                        onChange={e => setPayload({ ...payload, topic: e.target.value })}
                        className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div className="w-28">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Số câu (1–30)</label>
                    <input
                        type="number"
                        min={1} max={30}
                        value={payload.count}
                        onChange={e => setPayload({ ...payload, count: Math.min(30, Math.max(1, +e.target.value)) })}
                        className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <div className="w-36">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Mức độ</label>
                    <select
                        value={payload.difficulty}
                        onChange={e => setPayload({ ...payload, difficulty: e.target.value as any })}
                        className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="mixed">Hỗn hợp</option>
                        <option value="easy">Dễ</option>
                        <option value="med">Trung bình</option>
                        <option value="hard">Khó</option>
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-[#1a56db] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition flex items-center gap-2"
                    >
                        <Sparkles size={14} />
                        {isGenerating ? 'Đang tạo...' : 'Tạo câu hỏi'}
                    </button>
                </div>
            </div>

            {/* Generated list */}
            {isGenerating && (
                <div className="space-y-3">
                    {[...Array(payload.count)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-4 animate-pulse">
                            <div className="h-4 bg-gray-100 rounded w-4/5 mb-3" />
                            {[...Array(4)].map((__, j) => <div key={j} className="h-3 bg-gray-100 rounded w-3/5 mb-1.5" />)}
                        </div>
                    ))}
                </div>
            )}

            {!isGenerating && editList.length > 0 && (
                <>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-[#1e293b]">
                            {editList.length} câu hỏi được tạo — kiểm tra và chỉnh sửa trước khi lưu
                        </p>
                        <button
                            onClick={handleBulkSave}
                            disabled={isSaving || isCreating}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-60 transition flex items-center gap-2"
                        >
                            <Save size={14} />
                            {isSaving ? `Đang lưu ${saveIdx}/${editList.length}...` : `Lưu ${editList.length} câu vào ngân hàng`}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {editList.map((q, qi) => {
                            const lvl = LEVEL_LABELS[q.level] ?? { label: q.level, color: 'bg-gray-100 text-gray-600' }
                            return (
                                <div key={qi} className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-gray-400">#{qi + 1}</span>
                                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${lvl.color}`}>{lvl.label}</span>
                                        <Pencil size={12} className="text-gray-300 ml-auto" />
                                    </div>
                                    <textarea
                                        rows={2}
                                        value={q.content}
                                        onChange={e => setEditList(prev => prev.map((item, i) => i === qi ? { ...item, content: e.target.value } : item))}
                                        className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
                                    />
                                    <div className="space-y-1.5">
                                        {q.options.map((opt, oi) => (
                                            <div key={oi} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`correct-${qi}`}
                                                    checked={opt.is_correct}
                                                    onChange={() => handleOptionChange(qi, oi, 'is_correct', true)}
                                                    className="accent-blue-600 w-4 h-4 cursor-pointer shrink-0"
                                                />
                                                <span className="font-bold text-sm text-gray-500 w-5 shrink-0">{opt.letter}.</span>
                                                <input
                                                    value={opt.content}
                                                    onChange={e => handleOptionChange(qi, oi, 'content', e.target.value)}
                                                    className="flex-1 border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleBulkSave}
                            disabled={isSaving || isCreating}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-60 transition flex items-center gap-2"
                        >
                            <Save size={14} />
                            {isSaving ? `Đang lưu ${saveIdx}/${editList.length}...` : `Lưu ${editList.length} câu vào ngân hàng`}
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

/* ---------- Create Exam From Bank Dialog ---------- */
interface CreateExamDialogProps {
    selectedCount: number
    onClose: () => void
    onSubmit: (payload: Omit<CreateExamFromBankPayload, 'question_ids'>) => void
    isPending: boolean
}

function CreateExamFromBankDialog({ selectedCount, onClose, onSubmit, isPending }: CreateExamDialogProps) {
    const [title, setTitle] = useState('')
    const [duration, setDuration] = useState('45')
    const [status, setStatus] = useState<'draft' | 'published'>('draft')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit({ title, duration, status, level_mix: 'mixed' })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-[#1e293b] flex items-center gap-2">
                        <ClipboardList size={18} className="text-blue-600" />
                        Tạo đề thi từ ngân hàng
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={18} />
                    </button>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                    Bạn đã chọn <span className="font-bold text-blue-600">{selectedCount} câu hỏi</span> từ ngân hàng.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Tên đề thi *</label>
                        <input
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ví dụ: Kiểm tra giữa kỳ..."
                            className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Thời gian (phút) *</label>
                            <input
                                required
                                type="number"
                                min={5}
                                max={180}
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Trạng thái</label>
                            <select
                                value={status}
                                onChange={e => setStatus(e.target.value as 'draft' | 'published')}
                                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none"
                            >
                                <option value="draft">Nháp</option>
                                <option value="published">Xuất bản</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-[#e2e8f0] text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 bg-[#1a56db] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition"
                        >
                            {isPending ? 'Đang tạo...' : 'Tạo đề thi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

/* ---------- Main Page ---------- */
function QuestionsPage() {
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [levelFilter, setLevelFilter] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
    const [showCreateExamDialog, setShowCreateExamDialog] = useState(false)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [form, setForm] = useState<CreateQuestionPayload>(DEFAULT_FORM)

    const filter = {
        search: search || undefined,
        level: levelFilter || undefined,
    }

    const { data: questions, isLoading } = useQuestions(filter)
    const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion()
    const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion()
    const { mutate: createExamFromBank, isPending: isCreatingExam } = useCreateExamFromBank()

    const toggleSelect = (id: number) => {
        setSelectedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const toggleSelectAll = () => {
        if (!questions) return
        if (selectedIds.size === questions.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(questions.map(q => q.id)))
        }
    }

    const handleCreateExam = (partial: Omit<CreateExamFromBankPayload, 'question_ids'>) => {
        createExamFromBank(
            { ...partial, question_ids: Array.from(selectedIds) },
            {
                onSuccess: () => {
                    setShowCreateExamDialog(false)
                    setSelectedIds(new Set())
                    navigate({ to: '/exam' })
                },
            },
        )
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        createQuestion(form, {
            onSuccess: () => {
                setIsAdding(false)
                setForm(DEFAULT_FORM)
            },
        })
    }

    const handleOptionChange = (index: number, field: 'content' | 'is_correct', value: string | boolean) => {
        const updated = form.options.map((opt, i) => {
            if (field === 'is_correct') {
                return { ...opt, is_correct: i === index }
            }
            return i === index ? { ...opt, [field]: value } : opt
        })
        setForm({ ...form, options: updated })
    }

    return (
        <div className="flex-1 p-6 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h1 className="text-xl font-bold text-[#1e293b] flex items-center gap-2"><BookOpen size={20} /> Ngân hàng câu hỏi</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {questions ? `${questions.length} câu hỏi` : 'Đang tải...'}
                        {selectedIds.size > 0 && (
                            <span className="ml-2 font-semibold text-blue-600">· Đã chọn {selectedIds.size}</span>
                        )}
                    </p>
                </div>
                <div className="flex gap-2">
                    {selectedIds.size > 0 && (
                        <button
                            onClick={() => setShowCreateExamDialog(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-green-700 transition shadow-sm flex items-center gap-1.5"
                        >
                            <ClipboardList size={14} />
                            Tạo đề thi ({selectedIds.size})
                        </button>
                    )}
                    <button
                        onClick={() => { setIsGenerating(!isGenerating); setIsAdding(false) }}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm flex items-center gap-1.5 ${isGenerating ? 'bg-blue-100 text-blue-700 border border-blue-300' : 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'}`}
                    >
                        <Sparkles size={14} />
                        AI Tạo câu hỏi
                        {isGenerating ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                    <button
                        onClick={() => { setIsAdding(!isAdding); setIsGenerating(false); setForm(DEFAULT_FORM) }}
                        className="bg-[#1a56db] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm"
                    >
                        {isAdding ? '✕ Hủy' : '+ Thêm câu hỏi'}
                    </button>
                </div>
            </div>

            {/* AI Generate Panel */}
            {isGenerating && (
                <GeneratePanel
                    onClose={() => setIsGenerating(false)}
                    onCreate={createQuestion}
                    isCreating={isCreating}
                />
            )}

            {/* Filter bar */}
            <div className="flex gap-3 mb-5">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm kiếm câu hỏi..."
                    className="flex-1 border border-[#e2e8f0] rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <select
                    value={levelFilter}
                    onChange={e => setLevelFilter(e.target.value)}
                    className="border border-[#e2e8f0] rounded-xl px-3 py-2 text-sm bg-white focus:outline-none cursor-pointer"
                >
                    <option value="">Tất cả mức độ</option>
                    <option value="easy">Dễ</option>
                    <option value="med">Trung bình</option>
                    <option value="hard">Khó</option>
                </select>
            </div>

            {/* Add Question Form */}
            {isAdding && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-[#e2e8f0] rounded-xl p-5 mb-5 shadow-sm"
                >
                    <h2 className="font-bold text-[#1e293b] mb-4">Thêm câu hỏi mới</h2>
                    <div className="flex gap-3 mb-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Nội dung câu hỏi *</label>
                            <textarea
                                required
                                rows={2}
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                placeholder="Nhập nội dung câu hỏi..."
                            />
                        </div>
                        <div className="w-36">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Mức độ *</label>
                            <select
                                value={form.level}
                                onChange={e => setForm({ ...form, level: e.target.value as 'easy' | 'med' | 'hard' })}
                                className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm focus:outline-none"
                            >
                                <option value="easy">Dễ</option>
                                <option value="med">Trung bình</option>
                                <option value="hard">Khó</option>
                            </select>
                        </div>
                    </div>

                    <p className="text-sm font-medium text-gray-600 mb-2">Các đáp án (chọn đáp án đúng)</p>
                    <div className="space-y-2 mb-4">
                        {form.options.map((opt, i) => (
                            <div key={opt.letter} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="correct"
                                    checked={opt.is_correct}
                                    onChange={() => handleOptionChange(i, 'is_correct', true)}
                                    className="accent-blue-600 w-4 h-4 cursor-pointer"
                                />
                                <span className="font-bold text-sm w-5 text-gray-600">{opt.letter}.</span>
                                <input
                                    required
                                    value={opt.content}
                                    onChange={e => handleOptionChange(i, 'content', e.target.value)}
                                    className="flex-1 border border-[#e2e8f0] rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    placeholder={`Đáp án ${opt.letter}`}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isCreating}
                        className="bg-[#1a56db] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition"
                    >
                        {isCreating ? 'Đang lưu...' : 'Lưu câu hỏi'}
                    </button>
                </form>
            )}

            {/* Question List */}
            <div className="space-y-3">
                {/* Select all bar — shown when list is loaded */}
                {!isLoading && questions && questions.length > 0 && (
                    <div className="flex items-center gap-3 px-1 mb-1">
                        <button
                            onClick={toggleSelectAll}
                            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition"
                        >
                            {selectedIds.size === questions.length
                                ? <CheckSquare size={16} className="text-blue-600" />
                                : <Square size={16} />
                            }
                            {selectedIds.size === questions.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                        </button>
                        {selectedIds.size > 0 && (
                            <span className="text-xs text-blue-600 font-semibold">
                                Đã chọn {selectedIds.size}/{questions.length}
                            </span>
                        )}
                    </div>
                )}

                {isLoading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-4 animate-pulse">
                            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/4" />
                        </div>
                    ))
                ) : questions?.length === 0 ? (
                    <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center text-gray-400">
                        <Inbox size={40} className="mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">Chưa có câu hỏi nào</p>
                        <p className="text-sm mt-1">Nhấn "+ Thêm câu hỏi" hoặc "AI Tạo câu hỏi" để bắt đầu</p>
                    </div>
                ) : (
                    questions?.map((q, idx) => {
                        const lvl = LEVEL_LABELS[q.level] ?? { label: q.level, color: 'bg-gray-100 text-gray-600' }
                        const isExpanded = expandedId === q.id
                        const isSelected = selectedIds.has(q.id)
                        return (
                            <div key={q.id} className={`bg-white rounded-xl border shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden transition ${isSelected ? 'border-blue-400 ring-1 ring-blue-200' : 'border-[#e2e8f0]'}`}>
                                <div
                                    className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition"
                                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                                >
                                    {/* Checkbox */}
                                    <button
                                        onClick={e => { e.stopPropagation(); toggleSelect(q.id) }}
                                        className="mt-0.5 shrink-0 text-gray-400 hover:text-blue-600 transition"
                                        aria-label="Chọn câu hỏi"
                                    >
                                        {isSelected
                                            ? <CheckSquare size={16} className="text-blue-600" />
                                            : <Square size={16} />
                                        }
                                    </button>
                                    <span className="text-xs font-bold text-gray-400 mt-0.5 w-6 shrink-0">#{idx + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#1e293b] leading-snug">{q.content}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${lvl.color}`}>{lvl.label}</span>
                                            {q.usage_count > 0 && (
                                                <span className="text-[11px] text-gray-400">Dùng trong {q.usage_count} đề</span>
                                            )}
                                            {q.lesson_name && (
                                                <span className="text-[11px] text-blue-500 flex items-center gap-0.5"><BookOpenCheck size={11} /> {q.lesson_name}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={e => { e.stopPropagation(); deleteQuestion(q.id) }}
                                            disabled={isDeleting}
                                            className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-2 py-1 rounded-lg transition disabled:opacity-50"
                                        >
                                            Xóa
                                        </button>
                                        <span className="text-gray-300 text-sm">{isExpanded ? '▲' : '▼'}</span>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="border-t border-[#f1f5f9] px-4 py-3 bg-slate-50">
                                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Các đáp án</p>
                                        <div className="space-y-1.5">
                                            {q.options.map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className={`flex items-start gap-2 text-sm rounded-lg px-3 py-1.5 ${opt.is_correct ? 'bg-green-50 border border-green-200' : 'bg-white border border-[#e2e8f0]'}`}
                                                >
                                                    <span className={`font-bold w-5 shrink-0 ${opt.is_correct ? 'text-green-600' : 'text-gray-500'}`}>{opt.letter}.</span>
                                                    <span className={opt.is_correct ? 'text-green-700 font-medium' : 'text-gray-600'}>{opt.content}</span>
                                                    {opt.is_correct && <span className="ml-auto text-xs text-green-600 font-semibold">✓ Đúng</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            {/* Create Exam From Bank Dialog */}
            {showCreateExamDialog && (
                <CreateExamFromBankDialog
                    selectedCount={selectedIds.size}
                    onClose={() => setShowCreateExamDialog(false)}
                    onSubmit={handleCreateExam}
                    isPending={isCreatingExam}
                />
            )}
        </div>
    )
}
