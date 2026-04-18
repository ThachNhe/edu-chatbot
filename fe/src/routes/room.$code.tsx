import { useState, useEffect, useRef, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useValidateStudent } from '@/features/admin'
import { useRoomExam, useSubmitExam } from '@/features/exam'
import type { SubmitResult } from '@/features/exam'
import { Loader2, Lock, FileText, ClipboardList, Clock, XCircle, Rocket, User, CheckCircle2, Upload, AlertTriangle, Trophy, ThumbsUp, BookOpen, Star, CheckCheck } from 'lucide-react'

export const Route = createFileRoute('/room/$code')({
  component: StudentExamPage,
})

const LEVEL_STYLES = {
  easy: 'bg-[#d1fae5] text-[#10b981]',
  med: 'bg-[#fef3c7] text-[#d97706]',
  hard: 'bg-[#fee2e2] text-[#ef4444]',
}
const LEVEL_LABELS = { easy: 'Dễ', med: 'Trung bình', hard: 'Khó' }

function StudentExamPage() {
  const { code } = Route.useParams()
  const { data: exam, isLoading, isError } = useRoomExam(code)
  const { mutate: submit, isPending: isSubmitting } = useSubmitExam(code)
  const { mutateAsync: validateStudentAsync, isPending: isValidating } = useValidateStudent()

  const [step, setStep] = useState<'info' | 'exam' | 'result'>('info')
  const [studentName, setStudentName] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [className, setClassName] = useState('')
  const [email, setEmail] = useState('')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isExpired, setIsExpired] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasSubmittedRef = useRef(false)

  // Khi bắt đầu làm bài: khởi tạo đồng hồ đếm ngược
  useEffect(() => {
    if (step === 'exam' && exam) {
      const totalSeconds = parseInt(exam.duration) * 60
      setTimeLeft(totalSeconds)
    }
  }, [step, exam])

  // Đếm ngược mỗi giây
  const doSubmit = useCallback(() => {
    if (hasSubmittedRef.current || !exam) return
    hasSubmittedRef.current = true
    const answersArr = exam.questions.map((q) => ({
      question_id: q.id,
      selected_letter: answers[q.id] ?? '',
    }))
    submit(
      { student_name: studentName, student_code: studentCode || undefined, class_name: className || undefined, email: email || undefined, answers: answersArr },
      { onSuccess: (r) => { setResult(r); setStep('result') } },
    )
  }, [exam, answers, studentName, studentCode, className, email, submit])

  useEffect(() => {
    if (step !== 'exam') return
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          setIsExpired(true)
          doSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [step, doSubmit])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const timerWarning = timeLeft > 0 && timeLeft <= 300  // 5 phút cuối → cảnh báo

  const handleAnswer = (questionId: number, letter: string) => {
    if (isExpired) return
    setAnswers((prev) => ({ ...prev, [questionId]: letter }))
  }

  const handleStart = async () => {
    if (!studentName.trim() || !studentCode.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Tên và Mã số học sinh.')
      return
    }
    setErrorMsg('')
    try {
      const res = await validateStudentAsync({ student_code: studentCode })
      if (!res.valid) {
        setErrorMsg('Học sinh không tồn tại trong hệ thống. Vui lòng kiểm tra lại Mã số học sinh.')
        return
      }
      hasSubmittedRef.current = false
      setStep('exam')
    } catch (err) {
      setErrorMsg('Lỗi kiểm tra học sinh. Vui lòng thử lại.')
    }
  }

  const handleSubmit = () => doSubmit()

  const answeredCount = Object.keys(answers).length
  const totalCount = exam?.questions.length ?? 0

  // ─── Loading / Error ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff]">
        <div className="flex items-center gap-2 text-[15px] text-[#94a3b8]"><Loader2 size={18} className="animate-spin" /> Đang tải đề thi...</div>
      </div>
    )
  }

  if (isError || !exam) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f4ff] text-center p-4">
        <Lock size={64} className="mb-4 text-[#94a3b8]" />
        <h2 className="text-[20px] font-bold text-[#1e293b]">Phòng thi không tồn tại hoặc đã đóng</h2>
        <p className="mt-2 text-[14px] text-[#94a3b8]">Vui lòng liên hệ giáo viên để được hỗ trợ.</p>
      </div>
    )
  }

  // ─── Step: nhập thông tin ────────────────────────────────────────────────
  if (step === 'info') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff] p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
          <div className="mb-6 text-center">
            <div className="mb-3"><FileText size={48} className="mx-auto text-[#94a3b8]" /></div>
            <h1 className="text-[20px] font-extrabold text-[#1e293b]">{exam.title}</h1>
            <div className="mt-2 flex justify-center gap-4 text-[12px] text-[#94a3b8]">
              <span className="flex items-center gap-1"><Clock size={12} /> {exam.duration} phút</span>
              <span className="flex items-center gap-1"><ClipboardList size={12} /> {exam.questions.length} câu</span>
            </div>
          </div>

          <div className="space-y-3">
            <Field label="Họ và tên *" required>
              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className={inputCls}
              />
            </Field>
            <Field label="Mã số học sinh">
              <input
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="HS001"
                className={inputCls}
              />
            </Field>
            <Field label="Lớp">
              <input
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="12A1"
                className={inputCls}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={inputCls}
              />
            </Field>

            <div className="mt-2 rounded-xl bg-[#eff6ff] border border-[#bfdbfe] px-4 py-3 text-[12px] text-[#1a56db] flex items-center gap-1.5">
              <AlertTriangle size={13} /> Mỗi học sinh chỉ nộp bài một lần. Đảm bảo thông tin chính xác trước khi bắt đầu.
            </div>

            {errorMsg && (
              <div className="mt-2 rounded-xl bg-[#fef2f2] border border-[#fecaca] px-4 py-3 text-[12px] font-medium text-[#ef4444] flex items-center gap-1.5">
                <XCircle size={13} /> {errorMsg}
              </div>
            )}

            <button
              onClick={handleStart}
              disabled={!studentName.trim() || !studentCode.trim() || isValidating}
              className="mt-2 w-full rounded-xl bg-[#1a56db] py-3 text-[14px] font-bold text-white hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              <Rocket size={15} /> {isValidating ? 'Đang kiểm tra...' : 'Bắt đầu làm bài'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Step: làm bài ───────────────────────────────────────────────────────
  if (step === 'exam') {
    return (
      <div className="min-h-screen bg-[#f0f4ff] pb-28">
        {/* Sticky header */}
        <div className={`sticky top-0 z-10 border-b ${timerWarning ? 'border-[#fecaca]' : 'border-[#e2e8f0]'} ${timerWarning ? 'bg-[#fff7ed]/95' : 'bg-white/95'} backdrop-blur px-6 py-3 shadow-sm transition-colors`}>
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <div>
              <h2 className="text-[14px] font-extrabold text-[#1e293b] truncate max-w-xs">{exam.title}</h2>
              <p className="text-[12px] text-[#94a3b8] flex items-center gap-1">
                <User size={12} /> {studentName}
                {studentCode && ` · ${studentCode}`}
                {className && ` · Lớp ${className}`}
              </p>
            </div>

            {/* Đồng hồ đếm ngược */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] text-[#94a3b8]">{answeredCount}/{totalCount} câu</p>
                <div className="mt-0.5 h-1 w-24 rounded-full bg-[#e2e8f0]">
                  <div
                    className="h-full rounded-full bg-[#1a56db] transition-all"
                    style={{ width: `${totalCount ? (answeredCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className={`flex flex-col items-center rounded-xl border-2 px-4 py-2 ${timeLeft <= 60
                ? 'border-[#ef4444] bg-[#fee2e2] animate-pulse'
                : timerWarning
                  ? 'border-[#f97316] bg-[#fff7ed]'
                  : 'border-[#e2e8f0] bg-white'
                }`}>
                <span className="text-[9px] font-bold uppercase tracking-wide text-[#94a3b8]">Thời gian còn lại</span>
                <span className={`text-[20px] font-extrabold tabular-nums ${timeLeft <= 60 ? 'text-[#ef4444]' : timerWarning ? 'text-[#f97316]' : 'text-[#1e293b]'
                  }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cảnh báo hết giờ */}
        {timerWarning && !isExpired && (
          <div className="mx-auto mt-4 max-w-3xl px-6">
            <div className="rounded-xl bg-[#fff7ed] border border-[#fed7aa] px-4 py-3 text-[13px] font-semibold text-[#c2410c] flex items-center gap-1.5">
              <AlertTriangle size={14} /> Còn dưới 5 phút! Kiểm tra lại bài làm và nộp bài trước khi hết giờ.
            </div>
          </div>
        )}

        {isExpired && (
          <div className="mx-auto mt-4 max-w-3xl px-6">
            <div className="rounded-xl bg-[#fee2e2] border border-[#fecaca] px-4 py-3 text-[13px] font-semibold text-[#ef4444] flex items-center gap-1.5">
              <Clock size={14} /> Hết giờ! Bài thi đang được nộp tự động...
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="mx-auto max-w-3xl space-y-4 p-6">
          {exam.questions.map((q, i) => (
            <div key={q.id} className="rounded-xl bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)] border border-[#e2e8f0]">
              <div className="mb-3 flex items-start gap-3">
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-[#eff6ff] text-[12px] font-extrabold text-[#1a56db]">
                  {i + 1}
                </div>
                <p className="flex-1 text-[14px] font-semibold leading-[1.55] text-[#1e293b]">{q.content}</p>
                <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-bold ${LEVEL_STYLES[q.level]}`}>
                  {LEVEL_LABELS[q.level]}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt.letter
                  return (
                    <button
                      key={opt.letter}
                      onClick={() => handleAnswer(q.id, opt.letter)}
                      disabled={isExpired}
                      className={`flex items-center gap-3 rounded-xl border-[1.5px] px-4 py-3 text-left text-[13px] transition-all ${selected
                        ? 'border-[#1a56db] bg-[#eff6ff] font-bold text-[#1a56db]'
                        : 'border-[#e2e8f0] text-[#334155] hover:border-[#1a56db] hover:bg-[#f8fafc]'
                        } disabled:opacity-60 disabled:cursor-not-allowed`}
                    >
                      <div className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold ${selected ? 'bg-[#1a56db] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                        }`}>
                        {opt.letter}
                      </div>
                      <span>{opt.content}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Fixed submit bar */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-[#e2e8f0] bg-white/95 backdrop-blur px-6 py-4">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <p className="text-[13px] text-[#94a3b8]">
              {answeredCount < totalCount
                ? <span className="flex items-center gap-1"><AlertTriangle size={13} /> Còn {totalCount - answeredCount} câu chưa trả lời</span>
                : <span className="flex items-center gap-1"><CheckCheck size={13} /> Đã trả lời tất cả câu hỏi</span>}
            </p>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isExpired}
              className="rounded-xl bg-[#10b981] px-8 py-2.5 text-[14px] font-bold text-white hover:opacity-90 disabled:opacity-60 transition-all flex items-center gap-2"
            >
              {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> Đang nộp...</> : <><Upload size={14} /> Nộp bài</>}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── Step: kết quả ───────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f4ff] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
        <div className="mb-4">
          {result && result.score >= 8 ? <Trophy size={64} className="mx-auto text-yellow-500" /> : result && result.score >= 5 ? <ThumbsUp size={64} className="mx-auto text-blue-500" /> : <BookOpen size={64} className="mx-auto text-gray-400" />}
        </div>
        <h2 className="mb-1 text-[20px] font-extrabold text-[#1e293b]">Kết quả bài thi</h2>
        <p className="text-[13px] text-[#94a3b8]">
          {studentName}
          {studentCode && ` · MSHS: ${studentCode}`}
          {className && ` · Lớp ${className}`}
        </p>

        <div className="my-6 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#0ea5e9] p-6 text-white">
          <p className="text-[52px] font-extrabold leading-none">{result?.score.toFixed(1)}</p>
          <p className="text-[14px] opacity-80 mt-1">/ 10 điểm</p>
          <p className="mt-2 text-[13px] font-semibold opacity-90">
            {result && result.score >= 9 ? <><Star size={14} className="inline" /> Xuất sắc!</>
              : result && result.score >= 8 ? <><Trophy size={14} className="inline" /> Giỏi!</>
                : result && result.score >= 6.5 ? <><ThumbsUp size={14} className="inline" /> Khá!</>
                  : result && result.score >= 5 ? <><CheckCircle2 size={14} className="inline" /> Đạt yêu cầu</>
                    : <><BookOpen size={14} className="inline" /> Cần cố gắng hơn</>}
          </p>
        </div>

        <div className="mb-6 flex justify-center gap-6 text-[13px]">
          <div className="text-center">
            <p className="text-[24px] font-extrabold text-[#10b981]">{result?.correct}</p>
            <p className="text-[#94a3b8]">Câu đúng</p>
          </div>
          <div className="w-px bg-[#e2e8f0]" />
          <div className="text-center">
            <p className="text-[24px] font-extrabold text-[#ef4444]">{(result?.total ?? 0) - (result?.correct ?? 0)}</p>
            <p className="text-[#94a3b8]">Câu sai</p>
          </div>
          <div className="w-px bg-[#e2e8f0]" />
          <div className="text-center">
            <p className="text-[24px] font-extrabold text-[#475569]">{result?.total}</p>
            <p className="text-[#94a3b8]">Tổng</p>
          </div>
        </div>

        <p className="text-[12px] text-[#94a3b8]">
          Điểm của bạn đã được lưu lại. Cảm ơn bạn đã tham gia bài thi!
        </p>
      </div>
    </div>
  )
}

// ─── Utils ────────────────────────────────────────────────────────────────────
const inputCls =
  'w-full rounded-xl border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-4 py-2.5 text-[14px] text-[#334155] outline-none transition-colors focus:border-[#1a56db]'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-bold text-[#475569]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}