"use client"

import { motion } from "framer-motion"
import { Shield, Sparkles, Trophy, Cpu } from "lucide-react"

interface ResultRadarProps {
  builderScore: number
  creatorScore: number
  strategistScore: number
  catalystScore: number
  color: string
}

const AXIS_CONFIG = [
  { key: "builder", icon: Shield, angle: -Math.PI / 2 },
  { key: "creator", icon: Sparkles, angle: 0 },
  { key: "strategist", icon: Trophy, angle: Math.PI / 2 },
  { key: "catalyst", icon: Cpu, angle: Math.PI },
]

export function ResultRadar({
  builderScore,
  creatorScore,
  strategistScore,
  catalystScore,
  color,
}: ResultRadarProps) {
  const size = 300
  const center = size / 2
  const r = 100
  const maxVal = 100

  const scores: Record<string, number> = {
    builder: builderScore,
    creator: creatorScore,
    strategist: strategistScore,
    catalyst: catalystScore,
  }

  const getCoordinates = (angle: number, value: number) => {
    const scale = value / maxVal
    const distance = r * scale
    const x = center + distance * Math.cos(angle)
    const y = center + distance * Math.sin(angle)
    return `${x},${y}`
  }

  const points = AXIS_CONFIG.map((axis) => getCoordinates(axis.angle, scores[axis.key])).join(" ")
  const initialPoints = AXIS_CONFIG.map(() => `${center},${center}`).join(" ")

  return (
    <div className="relative flex items-center justify-center select-none">
      {/* Background Pulse */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full blur-3xl"
        style={{ background: `${color}15` }}
      />

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative z-10 overflow-visible">
        {/* Grid Rings */}
        {[0.25, 0.5, 0.75, 1.0].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={r * scale}
            className="fill-none stroke-white/5 stroke-[0.5]"
          />
        ))}

        {/* Grid Axes */}
        {AXIS_CONFIG.map((axis) => (
          <line
            key={axis.key}
            x1={center}
            y1={center}
            x2={center + r * Math.cos(axis.angle)}
            y2={center + r * Math.sin(axis.angle)}
            className="stroke-white/5 stroke-[0.5]"
          />
        ))}

        {/* User Stats Shape */}
        <motion.polygon
          points={points}
          initial={{ points: initialPoints, opacity: 0 }}
          animate={{ points, opacity: 1 }}
          transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
          fill={`${color}20`}
          stroke={color}
          strokeWidth="2"
          style={{ filter: `drop-shadow(0 0 12px ${color}40)` }}
        />

        {/* Axis Icons */}
        {AXIS_CONFIG.map((axis) => {
          const x = center + (r + 30) * Math.cos(axis.angle)
          const y = center + (r + 30) * Math.sin(axis.angle)
          const Icon = axis.icon
          return (
            <motion.g
              key={axis.key}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + AXIS_CONFIG.indexOf(axis) * 0.1 }}
            >
              <foreignObject x={x - 12} y={y - 12} width="24" height="24">
                <div className="flex items-center justify-center w-full h-full">
                  <Icon className="size-4" style={{ color }} />
                </div>
              </foreignObject>
            </motion.g>
          )
        })}
      </svg>
    </div>
  )
}
