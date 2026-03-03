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
  { avatar: 'T', avatarGradient: 'from-amber-500 to-red-500',      name: 'Trần Thị Bích',    scores: [{ value: '9.5', level: 'high' }, { value: '9.0', level: 'high' }, { value: '9.2', level: 'high' }], avgScore: '9.2', avgLevel: 'high', badge: '⭐' },
  { avatar: 'N', avatarGradient: 'from-[#1a56db] to-[#0ea5e9]',   name: 'Nguyễn Minh Khoa', scores: [{ value: '8.5', level: 'high' }, { value: '9.0', level: 'high' }, { value: '8.8', level: 'high' }], avgScore: '8.8', avgLevel: 'high' },
  { avatar: 'L', avatarGradient: 'from-[#10b981] to-[#06b6d4]',   name: 'Lê Thị Lan',       scores: [{ value: '8.0', level: 'high' }, { value: '7.5', level: 'mid'  }, { value: '8.5', level: 'high' }], avgScore: '8.0', avgLevel: 'high' },
  { avatar: 'P', avatarGradient: 'from-[#7c3aed] to-[#ec4899]',   name: 'Phạm Quốc Hùng',   scores: [{ value: '7.0', level: 'mid'  }, { value: '7.5', level: 'mid'  }, { value: '6.5', level: 'mid'  }], avgScore: '7.0', avgLevel: 'mid'  },
  { avatar: 'H', avatarGradient: 'from-amber-500 to-[#10b981]',   name: 'Hoàng Văn Đức',    scores: [{ value: '6.5', level: 'mid'  }, { value: '6.0', level: 'mid'  }, { value: '7.0', level: 'mid'  }], avgScore: '6.5', avgLevel: 'mid'  },
  { avatar: 'V', avatarGradient: 'from-[#ef4444] to-[#f97316]',   name: 'Vũ Thị Hoa',       scores: [{ value: '4.5', level: 'low'  }, { value: '5.0', level: 'low'  }, { value: '4.0', level: 'low'  }], avgScore: '4.5', avgLevel: 'low',  badge: '⚠️' },
]

// khớp .score-high, .score-mid, .score-low
const SCORE_COLORS = {
  high: 'text-[#10b981]',
  mid:  'text-[#d97706]',
  low:  'text-[#ef4444]',
}

export function StudentRankingTable() {
  return (
    <div className="col-span-2 overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
      {/* khớp .card-header */}
      <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
        <div className="flex items-center gap-[7px] text-[14px] font-extrabold text-[#1e293b]">
          🏆 Bảng điểm học sinh
        </div>
        <div className="flex gap-2">
          {/* khớp .exam-select */}
          <select className="rounded-lg border-[1.5px] border-[#e2e8f0] bg-[#f8fafc] px-2.5 py-[5px] font-['Nunito',sans-serif] text-[12px] text-[#334155] outline-none focus:border-[#1a56db]">
            <option>Lớp 12A1</option>
            <option>Lớp 12A2</option>
            <option>Lớp 12A3</option>
          </select>
          {/* khớp .btn.btn-outline */}
          <button className="flex items-center gap-[7px] rounded-[9px] border-[1.5px] border-[#e2e8f0] bg-white px-3.5 py-[5px] font-['Nunito',sans-serif] text-[12px] font-bold text-[#475569] transition-all hover:border-[#1a56db] hover:text-[#1a56db]">
            📥 Xuất Excel
          </button>
        </div>
      </div>

      {/* Header — khớp .st-row.st-header */}
      <div className="grid grid-cols-[36px_1fr_70px_70px_70px_80px] items-center bg-[#f8fafc] px-5 py-[11px] text-[11px] font-bold uppercase tracking-[0.8px] text-[#94a3b8]">
        <div />
        <div>Học sinh</div>
        <div className="text-center">Kiểm tra 1</div>
        <div className="text-center">Kiểm tra 2</div>
        <div className="text-center">Giữa kỳ</div>
        <div className="text-center">Điểm TB</div>
      </div>

      {/* Rows — khớp .st-row */}
      {STUDENTS.map((s) => (
        <div
          key={s.name}
          className="grid grid-cols-[36px_1fr_70px_70px_70px_80px] items-center border-b border-[#f1f5f9] px-5 py-[11px] text-[13px] last:border-b-0"
        >
          {/* khớp .st-av { width:28px; height:28px; border-radius:8px } */}
          <div
            className={cn(
              'flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[13px] font-bold text-white',
              s.avatarGradient,
            )}
          >
            {s.avatar}
          </div>

          {/* khớp .st-name */}
          <div className="font-bold text-[#1e293b]">{s.name}</div>

          {/* khớp .score-cell */}
          {s.scores.map((sc, i) => (
            <div key={i} className={cn('text-center font-bold', SCORE_COLORS[sc.level])}>
              {sc.value}
            </div>
          ))}

          {/* avg — khớp .score-cell */}
          <div className={cn('text-center font-bold', SCORE_COLORS[s.avgLevel])}>
            {s.avgScore} {s.badge ?? ''}
          </div>
        </div>
      ))}
    </div>
  )
}