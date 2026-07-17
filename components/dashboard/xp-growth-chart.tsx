"use client"

import { useMemo, useState, useEffect } from "react"
import { format, subDays, fr } from "@/lib/dates"

export interface ActivityLog {
  id: string
  action: string
  metadata?: Record<string, unknown> | null
  createdAt: Date | string
}

interface XPGrowthChartProps {
  logs: ActivityLog[]
  currentXP: number
}

export function XPGrowthChart({ logs, currentXP }: XPGrowthChartProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; xp: number } | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const chartData = useMemo(() => {
    const days = 14
    const data = []

    const dailyGains = new Map<string, number>()

    logs.forEach(log => {
      const dateKey = format(new Date(log.createdAt), 'yyyy-MM-dd')
      const xpGained = (log.metadata as Record<string, number> | undefined)?.xpGained || (log.action === 'MISSION_APPROVED' ? 100 : log.action === 'CHECKIN_COMPLETED' ? 20 : 0)
      dailyGains.set(dateKey, (dailyGains.get(dateKey) || 0) + xpGained)
    })

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateKey = format(date, 'yyyy-MM-dd')
      data.push({
        date: format(date, 'dd MMM', { locale: fr }),
        xp: 0,
        fullDate: dateKey
      })
    }

    let runningTotal = currentXP
    for (let i = data.length - 1; i >= 0; i--) {
      const dateKey = data[i].fullDate
      const realGain = dailyGains.get(dateKey) || 0
      data[i].xp = runningTotal
      runningTotal -= realGain
    }

    return data
  }, [logs, currentXP])

  if (!isMounted) {
    return (
      <div className="h-[200px] w-full mt-4 bg-white/1 rounded-2xl animate-pulse border border-white/5 flex items-center justify-center">
        <span className="text-[9px] font-mono uppercase text-zinc-600 tracking-tighter">Initialisation du flux d'évolution...</span>
      </div>
    )
  }

  const width = 600
  const height = 200
  const padding = { top: 10, right: 10, bottom: 25, left: 10 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const maxXp = Math.max(...chartData.map(d => d.xp), 1)
  const minXp = Math.min(...chartData.map(d => d.xp), 0)
  const range = maxXp - minXp || 1

  const points = chartData.map((d, i) => ({
    x: padding.left + (i / (chartData.length - 1)) * chartW,
    y: padding.top + chartH - ((d.xp - minXp) / range) * chartH,
    ...d
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join('')
  const areaD = `${pathD}L${points[points.length - 1].x},${padding.top + chartH}L${points[0].x},${padding.top + chartH}Z`

  const yAxisLabels = [0, 25, 50, 75, 100].map(pct => {
    const val = minXp + (pct / 100) * range
    const y = padding.top + chartH - (pct / 100) * chartH
    return { val: Math.round(val), y }
  })

  return (
    <div className="h-[200px] w-full mt-4 relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="none"
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id="xpFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C5F441" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#C5F441" stopOpacity={0} />
          </linearGradient>
        </defs>

        {yAxisLabels.map(({ val, y }) => (
          <g key={val}>
            <line
              x1={padding.left}
              y1={y}
              x2={padding.left + chartW}
              y2={y}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="3 3"
            />
          </g>
        ))}

        <path d={areaD} fill="url(#xpFill)" />
        <path d={pathD} fill="none" stroke="#C5F441" strokeWidth="2" />

        {points.map((p, i) => (
          <g key={i}>
            <rect
              x={p.x - (chartW / chartData.length) / 2}
              y={padding.top}
              width={chartW / chartData.length}
              height={chartH}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={(e) => {
                const rect = (e.target as HTMLElement).closest('svg')?.getBoundingClientRect()
                setTooltip({
                  x: p.x,
                  y: p.y,
                  date: p.date,
                  xp: p.xp,
                })
              }}
            />
          </g>
        ))}

        {points.filter((_, i) => i % 3 === 0 || i === points.length - 1).map((p) => (
          <text
            key={p.fullDate}
            x={p.x}
            y={height - 5}
            textAnchor="middle"
            fill="#52525b"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            {p.date}
          </text>
        ))}
      </svg>

      {tooltip && (
        <div
          className="absolute pointer-events-none bg-zinc-900 border border-white/10 p-2 rounded-lg shadow-xl -translate-x-1/2 -translate-y-full"
          style={{ left: `${(tooltip.x / width) * 100}%`, top: `max(${(tooltip.y / height) * 100}%, 50px)` }}
        >
          <p className="text-[10px] font-mono text-zinc-500 uppercase">{tooltip.date}</p>
          <p className="text-sm font-black text-white font-mono">{tooltip.xp} XP</p>
        </div>
      )}
    </div>
  )
}
