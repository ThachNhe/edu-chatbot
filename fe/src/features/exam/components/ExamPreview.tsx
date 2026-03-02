import { useState, useCallback } from 'react'
import { QuestionBlock } from './QuestionBlock'
import { ExamActions } from './ExamActions'
import type { ExamQuestion } from '../types/exam.types'

const SAMPLE_QUESTIONS: ExamQuestion[] = [
  {
    number: 1, text: 'Trong Pascal, cú pháp đúng của vòng lặp FOR–DO là gì?', level: 'easy',
    options: [
      { letter: 'A', text: 'for i := 1 to n do', isCorrect: true },
      { letter: 'B', text: 'for (i = 1; i &lt;= n; i++)' },
      { letter: 'C', text: 'for i = 1 to n loop' },
      { letter: 'D', text: 'for i from 1 to n do' },
    ],
  },
  {
    number: 2, text: 'Vòng lặp nào trong Pascal luôn thực hiện ít nhất một lần?', level: 'easy',
    options: [
      { letter: 'A', text: 'FOR–DO' },
      { letter: 'B', text: 'WHILE–DO' },
      { letter: 'C', text: 'REPEAT–UNTIL', isCorrect: true },
      { letter: 'D', text: 'LOOP–END' },
    ],
  },
  {
    number: 3,
    text: 'Đoạn chương trình sau sẽ in ra kết quả gì?<br><code style="font-size:12px">s := 0; for i := 1 to 5 do s := s + i; writeln(s);</code>',
    level: 'med',
    options: [
      { letter: 'A', text: '10' },
      { letter: 'B', text: '15', isCorrect: true },
      { letter: 'C', text: '20' },
      { letter: 'D', text: '5' },
    ],
  },
  {
    number: 4, text: 'Điều kiện trong vòng lặp REPEAT–UNTIL sẽ dừng khi nào?', level: 'med',
    options: [
      { letter: 'A', text: 'Điều kiện là FALSE' },
      { letter: 'B', text: 'Điều kiện là TRUE', isCorrect: true },
      { letter: 'C', text: 'Biến đếm = 0' },
      { letter: 'D', text: 'Hết bộ nhớ' },
    ],
  },
  {
    number: 5, text: 'Vòng lặp FOR–DO có thể sử dụng biến đếm kiểu nào trong Pascal?', level: 'hard',
    options: [
      { letter: 'A', text: 'Real' },
      { letter: 'B', text: 'Integer hoặc Char', isCorrect: true },
      { letter: 'C', text: 'String' },
      { letter: 'D', text: 'Boolean' },
    ],
  },
]

export function ExamPreview() {
  const [title, setTitle] = useState('Cấu trúc lặp')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => {
      setTitle((prev) =>
        prev === 'Cấu trúc lặp' ? 'Mảng và Chuỗi' : 'Cấu trúc lặp',
      )
      setIsGenerating(false)
    }, 800)
  }, [])

  return (
    <div
      className={`overflow-hidden rounded-[var(--edu-radius)] border border-[var(--edu-gray-200)] bg-white shadow-[var(--edu-shadow-sm)] transition-opacity ${
        isGenerating ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a56db] to-[#0ea5e9] px-7 py-[22px] text-white">
        <h3 className="mb-1.5 text-base font-extrabold">
          📝 Đề kiểm tra Tin học 12 – Chương 2: {title}
        </h3>
        <div className="flex gap-5">
          {['⏱️ Thời gian: 45 phút', '📋 Số câu: 10', '🎯 Hình thức: Trắc nghiệm', '📅 Ngày tạo: 27/02/2026'].map(
            (meta) => (
              <div
                key={meta}
                className="flex items-center gap-[5px] text-xs opacity-85"
              >
                {meta}
              </div>
            ),
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="px-7 py-6">
        {SAMPLE_QUESTIONS.map((q) => (
          <QuestionBlock key={q.number} question={q} />
        ))}
      </div>

      <ExamActions onRegenerate={handleGenerate} />
    </div>
  )
}