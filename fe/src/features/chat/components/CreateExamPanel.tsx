import { useRef, useState } from 'react'
import { X, FileText, PlusCircle, Sparkles, Loader2 } from 'lucide-react'

export interface ExamCreateOptions {
    title: string
    questionCount: number
    difficulty: 'easy' | 'med' | 'hard' | 'mixed'
    duration: string
    files: File[]
}

interface CreateExamPanelProps {
    attachedFiles: File[]
    onSubmit: (opts: ExamCreateOptions) => void
    onCancel: () => void
    onFilesChange: (files: File[]) => void
    isLoading: boolean
}

const DIFFICULTY_OPTIONS: { value: ExamCreateOptions['difficulty']; label: string }[] = [
    { value: 'easy', label: 'Dễ' },
    { value: 'med', label: 'Trung bình' },
    { value: 'hard', label: 'Khó' },
    { value: 'mixed', label: 'Hỗn hợp' },
]

const QUESTION_COUNT_OPTIONS = [5, 10, 15, 20, 25, 30]
const MAX_FILES = 3

export function CreateExamPanel({
    attachedFiles,
    onSubmit,
    onCancel,
    onFilesChange,
    isLoading,
}: CreateExamPanelProps) {
    const [title, setTitle] = useState('')
    const [questionCount, setQuestionCount] = useState(10)
    const [difficulty, setDifficulty] = useState<ExamCreateOptions['difficulty']>('mixed')
    const [duration, setDuration] = useState('45')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? [])
        if (selected.length === 0) return
        const combined = [...attachedFiles, ...selected].slice(0, MAX_FILES)
        onFilesChange(combined)
        if (!title && combined[0]) {
            setTitle(combined[0].name.replace(/\.[^.]+$/, ''))
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const removeFile = (index: number) => {
        onFilesChange(attachedFiles.filter((_, i) => i !== index))
    }

    const handleSubmit = () => {
        if (attachedFiles.length === 0) return
        if (!title.trim()) return
        onSubmit({ title: title.trim(), questionCount, difficulty, duration, files: attachedFiles })
    }

    const canSubmit = attachedFiles.length > 0 && title.trim().length > 0 && !isLoading
    const canAddMore = attachedFiles.length < MAX_FILES && !isLoading

    return (
        <div className="mb-2 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] p-3 shadow-sm">
            {/* Header */}
            <div className="mb-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#1a56db]">
                    <Sparkles size={14} />
                    Tạo đề thi từ tài liệu
                </span>
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-[#64748b] hover:bg-white hover:text-[#1a56db] disabled:opacity-40"
                >
                    <X size={14} />
                </button>
            </div>

            {/* File list */}
            <div className="mb-2.5">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                    Tài liệu <span className="text-red-500">*</span>
                    <span className="ml-1.5 font-normal normal-case text-[#94a3b8]">
                        (tối đa {MAX_FILES} file)
                    </span>
                </label>

                <div className="flex flex-col gap-1.5">
                    {attachedFiles.map((file, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2 rounded-lg border border-[#bfdbfe] bg-white px-2.5 py-1.5"
                        >
                            <FileText size={14} className="shrink-0 text-[#1a56db]" />
                            <span className="flex-1 truncate text-[12.5px] text-[#1e293b]">{file.name}</span>
                            <button
                                onClick={() => removeFile(idx)}
                                disabled={isLoading}
                                className="text-[#94a3b8] hover:text-red-500 disabled:opacity-40"
                            >
                                <X size={13} />
                            </button>
                        </div>
                    ))}

                    {canAddMore && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#bfdbfe] bg-white py-1.5 text-[12.5px] font-semibold text-[#1a56db] transition hover:border-[#1a56db] hover:bg-white/70"
                        >
                            <PlusCircle size={14} />
                            {attachedFiles.length === 0 ? 'Chọn file (.txt, .pdf, .docx)' : 'Thêm file'}
                        </button>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                />
            </div>

            {/* Exam title */}
            <div className="mb-2.5">
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                    Tên đề thi <span className="text-red-500">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tên đề thi..."
                    disabled={isLoading}
                    className="w-full rounded-lg border border-[#e2e8f0] bg-white px-2.5 py-1.5 text-[12.5px] text-[#1e293b] outline-none placeholder:text-[#94a3b8] focus:border-[#1a56db] disabled:opacity-50"
                />
            </div>

            {/* Question count */}
            <div className="mb-3 grid gap-2.5 sm:grid-cols-[1fr_112px]">
                <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                        Số câu hỏi
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                        {QUESTION_COUNT_OPTIONS.map((n) => (
                            <button
                                key={n}
                                onClick={() => setQuestionCount(n)}
                                disabled={isLoading}
                                className={`rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold transition ${questionCount === n
                                        ? 'bg-[#1a56db] text-white shadow-sm'
                                        : 'border border-[#e2e8f0] bg-white text-[#475569] hover:border-[#1a56db] hover:text-[#1a56db]'
                                    } disabled:opacity-50`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Duration */}
                <div>
                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                        Thời gian
                    </label>
                    <input
                        type="number"
                        min={5}
                        max={180}
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        disabled={isLoading}
                        className="w-full rounded-lg border border-[#e2e8f0] bg-white px-2.5 py-1.5 text-[12.5px] text-[#1e293b] outline-none focus:border-[#1a56db] disabled:opacity-50"
                    />
                </div>
            </div>

            {/* Difficulty */}
            <div className="mb-3">
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-[#475569]">
                    Mức độ
                </label>
                <div className="flex flex-wrap gap-1.5">
                    {DIFFICULTY_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setDifficulty(opt.value)}
                            disabled={isLoading}
                            className={`rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold transition ${difficulty === opt.value
                                    ? 'bg-[#1a56db] text-white shadow-sm'
                                    : 'border border-[#e2e8f0] bg-white text-[#475569] hover:border-[#1a56db] hover:text-[#1a56db]'
                                } disabled:opacity-50`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
                <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="flex items-center gap-1.5 rounded-lg bg-[#1a56db] px-3.5 py-1.5 text-[12.5px] font-bold text-white shadow-sm transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={13} className="animate-spin" />
                            Đang tạo...
                        </>
                    ) : (
                        <>
                            <Sparkles size={13} />
                            Tạo đề thi
                        </>
                    )}
                </button>
                <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="rounded-lg border border-[#e2e8f0] bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-[#475569] transition hover:border-[#1a56db] hover:text-[#1a56db] disabled:opacity-40"
                >
                    Hủy
                </button>
            </div>
        </div>
    )
}
