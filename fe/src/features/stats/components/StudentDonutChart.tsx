import { useStudentDistribution } from '../hooks/useStatsData'

export function StudentDonutChart() {
  const { data: legend, isLoading } = useStudentDistribution()

  // Calculate total students and stroke offsets for the donut chart
  const totalStudents = legend?.reduce((sum, item) => sum + item.count, 0) || 0
  const radius = 45
  const circumference = 2 * Math.PI * radius

  // Map data to SVG circular segments
  let currentOffset = 0
  const chartSegments = legend?.map(item => {
    const strokeDasharray = `${(item.count / totalStudents) * circumference} ${circumference}`
    const strokeDashoffset = -currentOffset
    currentOffset += (item.count / totalStudents) * circumference
    return { ...item, strokeDasharray, strokeDashoffset }
  }) || []

  return (
    <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4">
        <div className="flex items-center gap-[7px] text-[14px] font-extrabold text-[#1e293b]">
          🍩 Phân loại học sinh
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 p-5">
        {isLoading ? (
          <div className="flex w-full items-center justify-center gap-6">
            <div className="h-[120px] w-[120px] animate-pulse rounded-full bg-gray-100" />
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        ) : totalStudents === 0 ? (
          <div className="py-8 text-center text-[13px] text-gray-400">
            Chưa có đủ dữ liệu để phân loại
          </div>
        ) : (
          <>
            <svg className="flex-shrink-0" width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="18" />
              {chartSegments.map((seg, i) => (
                <circle
                  key={i}
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth="18"
                  strokeDasharray={seg.strokeDasharray}
                  strokeDashoffset={seg.strokeDashoffset}
                  transform="rotate(-90 60 60)"
                  className="transition-all duration-1000 ease-out"
                />
              ))}
              <text x="60" y="56" textAnchor="middle" fontSize="16" fontWeight="800" fill="#1e293b">
                {totalStudents}
              </text>
              <text x="60" y="72" textAnchor="middle" fontSize="10" fontWeight="600" fill="#94a3b8">
                học sinh
              </text>
            </svg>

            <div className="flex flex-col gap-2">
              {legend?.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-[12px] font-semibold text-[#334155]"
                >
                  <div
                    className="h-[10px] w-[10px] flex-shrink-0 rounded-[3px]"
                    style={{ background: item.color }}
                  />
                  {item.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}