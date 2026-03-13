import { useWeekSchedule } from '../hooks/useDashboardData'

const DAY_STYLES: Record<string, { dayColor: string; borderColor: string; bg: string }> = {
  T2: { dayColor: 'text-[var(--edu-primary)]', borderColor: 'border-[var(--edu-primary)]', bg: 'bg-[var(--edu-primary-soft)]' },
  T3: { dayColor: 'text-[#d97706]', borderColor: 'border-[var(--edu-accent)]', bg: 'bg-[var(--edu-accent-soft)]' },
  T4: { dayColor: 'text-[#d97706]', borderColor: 'border-[var(--edu-accent)]', bg: 'bg-[var(--edu-accent-soft)]' },
  T5: { dayColor: 'text-[var(--edu-success)]', borderColor: 'border-[var(--edu-success)]', bg: 'bg-[var(--edu-success-soft)]' },
  T6: { dayColor: 'text-[var(--edu-success)]', borderColor: 'border-[var(--edu-success)]', bg: 'bg-[var(--edu-success-soft)]' },
  T7: { dayColor: 'text-[#7c3aed]', borderColor: 'border-[#7c3aed]', bg: 'bg-[#f5f3ff]' },
  CN: { dayColor: 'text-[#ef4444]', borderColor: 'border-[#ef4444]', bg: 'bg-[#fee2e2]' },
}
const DEFAULT_STYLE = { dayColor: 'text-gray-500', borderColor: 'border-gray-300', bg: 'bg-gray-50' }

export function WeekSchedule() {
  const { data: schedule, isLoading } = useWeekSchedule()

  return (
    <div className="rounded-[var(--edu-radius)] border border-[var(--edu-gray-100)] bg-white shadow-[var(--edu-shadow-sm)]">
      <div className="flex items-center justify-between border-b border-[var(--edu-gray-100)] px-5 py-4">
        <div className="flex items-center gap-[7px] text-sm font-extrabold text-[var(--edu-gray-800)]">
          📅 Lịch tuần này
        </div>
      </div>
      <div className="flex flex-col gap-2 px-4 py-3">
        {isLoading && (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </>
        )}
        {!isLoading && (!schedule || schedule.length === 0) && (
          <p className="py-2 text-center text-[12px] text-gray-400">Không có lịch thi tuần này</p>
        )}
        {!isLoading &&
          schedule?.map((s, i) => {
            const style = DAY_STYLES[s.day] ?? DEFAULT_STYLE
            return (
              <div
                key={i}
                className={`flex items-center gap-2.5 rounded-lg border-l-[3px] ${style.borderColor} ${style.bg} p-2`}
              >
                <div className={`w-7 text-xs font-extrabold ${style.dayColor}`}>{s.day}</div>
                <div>
                  <div className="text-[12.5px] font-bold text-[var(--edu-gray-800)]">{s.title}</div>
                  <div className="text-[11px] text-[var(--edu-gray-500)]">{s.desc}</div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}