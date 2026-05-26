"use client"

import { useMemo } from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { format, subDays, startOfDay, isSameDay } from "date-fns"
import { fr } from "date-fns/locale"

interface ActivityLog {
  id: string
  action: string
  metadata: any
  createdAt: Date | string
}

interface XPGrowthChartProps {
  logs: ActivityLog[]
  currentXP: number
}

export function XPGrowthChart({ logs, currentXP }: XPGrowthChartProps) {
  const chartData = useMemo(() => {
    const days = 14
    const data = []
    let tempXP = currentXP

    // Extract XP gains from logs (mocking some if logs are too recent or missing XP metadata)
    const dailyGains = new Map<string, number>()
    
    logs.forEach(log => {
      const dateKey = format(new Date(log.createdAt), 'yyyy-MM-dd')
      const xpGained = (log.metadata as any)?.xpGained || (log.action === 'MISSION_APPROVED' ? 100 : log.action === 'CHECKIN_COMPLETED' ? 20 : 0)
      dailyGains.set(dateKey, (dailyGains.get(dateKey) || 0) + xpGained)
    })

    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dateKey = format(date, 'yyyy-MM-dd')
      const gain = dailyGains.get(dateKey) || 0
      
      // We calculate backwards from currentXP
      // Actually, it's easier to just show the gains or a simulated growth if history is short
      data.push({
        date: format(date, 'dd MMM', { locale: fr }),
        xp: Math.max(0, tempXP - (i * 15)), // Mocking a steady growth for visual effect if data is sparse
        fullDate: dateKey
      })
    }

    // Replace mock with real gains where available
    let runningTotal = currentXP
    for (let i = data.length - 1; i >= 0; i--) {
        const dateKey = data[i].fullDate
        const realGain = dailyGains.get(dateKey) || 0
        data[i].xp = runningTotal
        runningTotal -= realGain
    }

    return data
  }, [logs, currentXP])

  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C5F441" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#C5F441" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255,255,255,0.05)" 
          />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: '#52525b', fontWeight: 'bold' }}
            interval={2}
          />
          <YAxis hide />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-zinc-900 border border-white/10 p-2 rounded-lg shadow-xl">
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">{payload[0].payload.date}</p>
                    <p className="text-sm font-black text-white font-mono">{payload[0].value} XP</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="xp"
            stroke="#C5F441"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorXp)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
