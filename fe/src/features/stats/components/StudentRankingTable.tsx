import { cn } from '@/lib/utils'

interface Student {
  avatar: string
  avatarGradient: string
  name: string
  scores: { value: string; level: 'high' | 'mid' | 'low' }[]
  avgScore: string
  avgLevel: 'high' | 'mid' | 'low'
  badge?: string
}

const STUDENTS: Student[] = [
  { avatar: 'T', avatarGradient: 'from-amber-500 to-red-500', name: 'Trần Thị Bích', scores: [{ value: '9.5', level: 'high' }, { value: '9.0', level: 'high' }, { value: '9.2', level: 'high' }], avgScore: '9.2', avgLevel: 'high', badge: '⭐' },
  { avatar: 'N', avatarGradient: 'from-[#1a56db] to-[#0ea5e9]', name: 'Nguyễn Minh Khoa', scores: [{ value: '8.5', level: 'high' }, { value: '9.0', level: 'high' }, { value: '8.8', level: 'high' }], avgScore: '8.8', avgLevel: 'high' },
  { avatar: 'L', avatarGradient: 'from-emerald-500 to-cyan-500', name: 'Lê Thị Lan', scores: [{ value: '8.0', level: 'high' }, { value: '7.5', level: 'mid' }, { value: '8.5', level: 'high' }], avgScore: '8.0', avgLevel: 'high' },
  { avatar: 'P', avatarGradient: 'from-violet-600 to-pink-500', name: 'Phạm Quốc Hùng', scores: [{ value: '7.0', level: 'mid' }, { value: '7.5', level: 'mid' }, { value: '6.5', level: 'mid' }], avgScore: '7.0', avgLevel: 'mid' },
  { avatar: 'H', avatarGradient: 'from-amber-500 to-emerald-500', name: 'Hoàng Văn Đức', scores: [{ value: '6.5', level: 'mid' }, { value: '6.0', level: 'mid' }, { value: '7.0', level: 'mid' }], avgScore: '6.5', avgLevel: 'mid' },
  { avatar: 'V', avatarGradient: 'from-red-500 to-orange-500', name: 'Vũ Thị Hoa', scores: [{ value: '4.5', level: 'low' }, { value: '5.0', level: 'low' }, { value: '4.0', level: 'low' }], avgScore: '4.5', avgLevel: 'low', badge: '⚠️' },
]

const SCORE_COLORS = {
  high: 'text-[var(--edu-success)]',
  mid: 'text-[#d97706]',
  low: 'text-[var(--edu-danger)]',
}

export function StudentRankingTable() {
  return (
    <div className="col-span-2 overflow-hidden rounded-[var(--edu-radius)] border border-[var(--edu-gray-200)] bg-white shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-100)] px-5 py-4">
        <div className="flex items-center gap-[7px] text-sm font-extrabold text-[var(--edu-gray-800)]">
          🏆 Bảng điểm học sinh
        </div>
        <div className="flex gap-2">
          <select className="rounded-lg border-[1.5px] border-[var(--edu-gray-200)] bg-[var(--edu-gray-50)] px-2.5 py-[5px] text-xs text-[var(--edu-gray-700)] outline-none focus:border-[var(--edu-primary)]">
            <option>Lớp 12A1</option>
            <option>Lớp 12A2</option>
            <option>Lớp 12A3</option>
          </select>
          <button className="flex items-center gap-[7px] rounded-[9px] border-[1.5px] border-[var(--edu-gray-200)] bg-white px-3.5 py-[5px] text-xs font-bold text-[var(--edu-gray-600)] transition-all hover:border-[var(--edu-primary)] hover:text-[var(--edu-primary)]">
            📥 Xuất Excel
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[36px_1fr_70px_70px_70px_80px] items-center bg-[var(--edu-gray-50)] px-5 py-[11px] text-[11px] font-bold uppercase tracking-[0.8px] text-[var(--edu-gray-400)]">
        <div />
        <div>Học sinh</div>
        <div className="text-center">Kiểm tra 1</div>
        <div className="text-center">Kiểm tra 2</div>
        <div className="text-center">Giữa kỳ</div>
        <div className="text-center">Điểm TB</div>
      </div>

      {/* Rows */}
      {STUDENTS.map((s) => (
        <div
          key={s.name}
          className="grid grid-cols-[36px_1fr_70px_70px_70px_80px] items-center border-b border-[var(--edu-gray-100)] px-5 py-[11px] text-[13px] last:border-b-0"
        >
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br text-[13px] font-bold text-white',
              s.avatarGradient,
            )}
          >
            {s.avatar}
          </div>
          <div className="font-bold text-[var(--edu-gray-800)]">{s.name}</div>
          {s.scores.map((sc, i) => (
            <div
              key={i}
              className={cn('text-center font-bold', SCORE_COLORS[sc.level])}
            >
              {sc.value}
            </div>
          ))}
          <div
            className={cn(
              'text-center font-bold',
              SCORE_COLORS[s.avgLevel],
            )}
          >
            {s.avgScore} {s.badge ?? ''}
          </div>
        </div>
      ))}
    </div>
  )
}