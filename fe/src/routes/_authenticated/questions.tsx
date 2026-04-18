import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuestions, useCreateQuestion, useDeleteQuestion } from '@/features/questions'
import type { CreateQuestionPayload } from '@/features/questions'

export const Route = createFileRoute('/_authenticated/questions')({
    component: QuestionsPage,
})

const LEVEL_LABELS: Record<string, { label: string; color: string }> = {
    easy: { label: 'Dễ', color: 'bg-green-100 text-green-700' },
    med: { label: 'Trung bình', color: 'bg-yellow-100 text-yellow-700' },
    hard: { label: 'Khó', color: 'bg-red-100 text-red-700' },
}

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

function QuestionsPage() {
    const [search, setSearch] = useState('')
    const [levelFilter, setLevelFilter] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [expandedId, setExpandedId] = useState<number | null>(null)
    const [form, setForm] = useState<CreateQuestionPayload>(DEFAULT_FORM)

    const filter = {
        search: search || undefined,
        level: levelFilter || undefined,
    }

    const { data: questions, isLoading } = useQuestions(filter)
    const { mutate: createQuestion, isPending: isCreating } = useCreateQuestion()
    const { mutate: deleteQuestion, isPending: isDeleting } = useDeleteQuestion()

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
                    <h1 className="text-xl font-bold text-[#1e293b]">📚 Ngân hàng câu hỏi</h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {questions ? `${questions.length} câu hỏi` : 'Đang tải...'}
                    </p>
                </div>
                <button
                    onClick={() => { setIsAdding(!isAdding); setForm(DEFAULT_FORM) }}
                    className="bg-[#1a56db] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-sm"
                >
                    {isAdding ? '✕ Hủy' : '+ Thêm câu hỏi'}
                </button>
            </div>

            {/* Filter bar */}
            <div className="flex gap-3 mb-5">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="🔍 Tìm kiếm câu hỏi..."
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
                {isLoading ? (
                    [...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl border border-[#e2e8f0] p-4 animate-pulse">
                            <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/4" />
                        </div>
                    ))
                ) : questions?.length === 0 ? (
                    <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center text-gray-400">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="font-medium">Chưa có câu hỏi nào</p>
                        <p className="text-sm mt-1">Nhấn "+ Thêm câu hỏi" để tạo câu hỏi đầu tiên</p>
                    </div>
                ) : (
                    questions?.map((q, idx) => {
                        const lvl = LEVEL_LABELS[q.level] ?? { label: q.level, color: 'bg-gray-100 text-gray-600' }
                        const isExpanded = expandedId === q.id
                        return (
                            <div key={q.id} className="bg-white rounded-xl border border-[#e2e8f0] shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
                                <div
                                    className="flex items-start gap-3 p-4 cursor-pointer hover:bg-slate-50 transition"
                                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                                >
                                    <span className="text-xs font-bold text-gray-400 mt-0.5 w-6 shrink-0">#{idx + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-[#1e293b] leading-snug">{q.content}</p>
                                        <div className="flex items-center gap-2 mt-1.5">
                                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${lvl.color}`}>{lvl.label}</span>
                                            {q.usage_count > 0 && (
                                                <span className="text-[11px] text-gray-400">Dùng trong {q.usage_count} đề</span>
                                            )}
                                            {q.lesson_name && (
                                                <span className="text-[11px] text-blue-500">📖 {q.lesson_name}</span>
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
        </div>
    )
}
