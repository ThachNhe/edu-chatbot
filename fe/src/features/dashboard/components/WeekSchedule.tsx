const SCHEDULE = [
  {
    day: 'T2',
    dayColor: 'text-[var(--edu-primary)]',
    borderColor: 'border-[var(--edu-primary)]',
    bg: 'bg-[var(--edu-primary-soft)]',
    title: 'Lớp 12A1 – Tiết 3,4',
    desc: 'Bài 15: Thao tác với tệp',
  },
  {
    day: 'T4',
    dayColor: 'text-[#d97706]',
    borderColor: 'border-[var(--edu-accent)]',
    bg: 'bg-[var(--edu-accent-soft)]',
    title: 'Lớp 12A2 – Tiết 1,2',
    desc: 'Kiểm tra 15 phút Chương 3',
  },
  {
    day: 'T6',
    dayColor: 'text-[var(--edu-success)]',
    borderColor: 'border-[var(--edu-success)]',
    bg: 'bg-[var(--edu-success-soft)]',
    title: 'Lớp 12A3 – Tiết 5,6',
    desc: 'Ôn tập cuối chương',
  },
]

export function WeekSchedule() {
  return (
    <div className="rounded-[var(--edu-radius)] border border-[var(--edu-gray-100)] bg-white shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-100)] px-5 py-4">
        <div className="flex items-center gap-[7px] text-sm font-extrabold text-[var(--edu-gray-800)]">
          📅 Lịch tuần này
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        {SCHEDULE.map((s) => (
          <div
            key={s.day}
            className={`flex items-center gap-2.5 rounded-lg border-l-[3px] ${s.borderColor} ${s.bg} p-2`}
          >
            <div className={`w-7 text-xs font-extrabold ${s.dayColor}`}>
              {s.day}
            </div>
            <div>
              <div className="text-[12.5px] font-bold text-[var(--edu-gray-800)]">
                {s.title}
              </div>
              <div className="text-[11px] text-[var(--edu-gray-500)]">
                {s.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}