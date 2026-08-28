"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Shield, Sparkles, Trophy, Cpu, Zap, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface EvolutionRadarProps {
  builderScore: number
  creatorScore: number
  strategistScore: number
  catalystScore: number
  userClass?: string
}

const AXIS_CONFIG = [
  {
    key: "builder",
    label: "BUILDER",
    desc: "Bâtisseur technique. Transforme le code brut en architectures robustes et produits stables.",
    color: "text-blue-400",
    fill: "rgba(59, 130, 246, 0.15)",
    stroke: "#60a5fa",
    glow: "shadow-blue-500/20",
    icon: Shield,
    angle: -Math.PI / 2, // Up
  },
  {
    key: "creator",
    label: "CRÉATEUR",
    desc: "Designer & Visionnaire. Harmonise l'esthétique et l'expérience utilisateur avec audace.",
    color: "text-purple-400",
    fill: "rgba(168, 85, 247, 0.15)",
    stroke: "#c084fc",
    glow: "shadow-purple-500/20",
    icon: Sparkles,
    angle: 0, // Right
  },
  {
    key: "strategist",
    label: "STRATÈGE",
    desc: "Architecte de flux. Analyse la viabilité, planifie les étapes clés et orchestre les systèmes.",
    color: "text-amber-400",
    fill: "rgba(245, 158, 11, 0.15)",
    stroke: "#fbbf24",
    glow: "shadow-amber-500/20",
    icon: Trophy,
    angle: Math.PI / 2, // Down
  },
  {
    key: "catalyst",
    label: "CATALYSEUR",
    desc: "Accélérateur humain. Fédère l'équipe, débloque les obstacles et propulse la livraison.",
    color: "text-emerald-400",
    fill: "rgba(16, 185, 129, 0.15)",
    stroke: "#34d399",
    glow: "shadow-emerald-500/20",
    icon: Cpu,
    angle: Math.PI, // Left
  },
]

export function EvolutionRadar({
  builderScore = 0,
  creatorScore = 0,
  strategistScore = 0,
  catalystScore = 0,
  userClass = "builder",
}: EvolutionRadarProps) {
  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null)
  
  // Clean inputs
  const cleanScore = (val: unknown) => {
    const num = Number(val);
    return isNaN(num) ? 0 : Math.max(0, num);
  };

  const scores: Record<string, number> = {
    builder: cleanScore(builderScore),
    creator: cleanScore(creatorScore),
    strategist: cleanScore(strategistScore),
    catalyst: cleanScore(catalystScore),
  };

  const maxVal = 100;

  // SVG parameters
  const size = 260;
  const center = size / 2;
  const r = 90; // Max radius for 100% value

  // Coordinates calculators
  const getCoordinates = (angle: number, value: number) => {
    const validVal = isNaN(value) ? 0 : value;
    const scale = validVal / maxVal;
    const distance = r * scale;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return {
      x: isNaN(x) ? center : x,
      y: isNaN(y) ? center : y,
    };
  };

  // Calculate polygon points
  const points = AXIS_CONFIG.map((axis) => {
    const scoreVal = scores[axis.key] || 0
    const coords = getCoordinates(axis.angle, scoreVal)
    return `${coords.x},${coords.y}`
  }).join(" ")

  const initialPoints = AXIS_CONFIG.map(() => `${center},${center}`).join(" ")

  // Interactive description card for the active/hovered class
  const activeAxisKey = hoveredAxis || userClass?.toLowerCase()
  const activeAxis = AXIS_CONFIG.find((a) => a.key === activeAxisKey) || AXIS_CONFIG[0]

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8 w-full p-1">
      {/* Visual HUD Radar Chart Container */}
      <div className="relative shrink-0 select-none">
        {/* Glow behind the HUD */}
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />

        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="relative z-[var(--z-content)] overflow-visible"
        >
          <defs>
            {/* Holographic Radar Gradient */}
            <linearGradient id="cyber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8FF3B" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
            </linearGradient>
            {/* Outer Ring Glow */}
            <radialGradient id="ring-glow" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stopColor="#000000" stopOpacity="0" />
              <stop offset="100%" stopColor="#B8FF3B" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Grid: Concentric Radar rings (HUD circles & diamonds) */}
          {[0.25, 0.5, 0.75, 1.0].map((scale, i) => {
            const currentR = r * scale
            // Diamond path matching the axes
            const diamondPoints = AXIS_CONFIG.map((axis) => {
              const x = center + currentR * Math.cos(axis.angle)
              const y = center + currentR * Math.sin(axis.angle)
              return `${x},${y}`
            }).join(" ")

            return (
              <g key={scale} className="opacity-40">
                {/* Concentric Circle */}
                <circle
                  cx={center}
                  cy={center}
                  r={currentR}
                  className="fill-none stroke-white/3 stroke-1"
                />
                {/* Concentric Diamond Grid */}
                <polygon
                  points={diamondPoints}
                  className={cn(
                    "fill-none stroke-dashed stroke-1 transition-colors duration-300",
                    i === 3 ? "stroke-primary/20" : "stroke-white/5"
                  )}
                  strokeDasharray="3, 3"
                />
              </g>
            )
          })}

          {/* Grid Axes Lines */}
          {AXIS_CONFIG.map((axis) => {
            const endX = center + r * Math.cos(axis.angle)
            const endY = center + r * Math.sin(axis.angle)

            return (
              <line
                key={axis.key}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                className={cn(
                  "stroke-1 transition-colors duration-300",
                  hoveredAxis === axis.key ? "stroke-primary/30" : "stroke-white/5"
                )}
              />
            )
          })}

          {/* Holographic Glowing Polygon (The user's stats shape) */}
          <motion.polygon
            points={points}
            initial={{ points: initialPoints }}
            animate={{ points }}
            transition={{ type: "spring", stiffness: 60, damping: 15 }}
            fill="url(#cyber-gradient)"
            className="stroke-[1.5] stroke-primary filter drop-shadow-[0_0_8px_rgba(184,255,59,0.3)] cursor-pointer"
            whileHover={{ scale: 1.02 }}
          />

          {/* Axis Interactive Nodes / Vertices */}
          {AXIS_CONFIG.map((axis) => {
            const scoreVal = scores[axis.key] || 0
            const coords = getCoordinates(axis.angle, scoreVal)

            return (
              <g
                key={axis.key}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredAxis(axis.key)}
                onMouseLeave={() => setHoveredAxis(null)}
                onClick={() => setHoveredAxis(axis.key)}
              >
                {/* Transparent interactive touch area - ENHANCED FOR MOBILE 48pt feel */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={24}
                  className="fill-white/0 stroke-none active:fill-white/5 transition-colors"
                />
                
                {/* Visual Node Dot */}
                <motion.circle
                  cx={coords.x}
                  cy={coords.y}
                  r={hoveredAxis === axis.key ? 7 : 5}
                  className={cn("transition-colors duration-200")}
                  style={{
                    fill: axis.stroke,
                    stroke: "rgba(0,0,0,0.9)",
                    strokeWidth: 2.5,
                    filter: hoveredAxis === axis.key ? `drop-shadow(0 0 10px ${axis.stroke})` : "none"
                  }}
                  animate={{
                    r: hoveredAxis === axis.key ? 7 : 5,
                  }}
                />
              </g>
            )
          })}

          {/* Outer Labels */}
          {AXIS_CONFIG.map((axis) => {
            const offsetDist = r + 24
            const labelX = center + offsetDist * Math.cos(axis.angle)
            const labelY = center + offsetDist * Math.sin(axis.angle)

            // Adjust text anchor alignment based on quadrant
            let textAnchor: "start" | "middle" | "end" | "inherit" = "middle"
            let dy = "0.33em"

            if (axis.angle === 0) {
              textAnchor = "start"
            } else if (axis.angle === Math.PI) {
              textAnchor = "end"
            } else if (axis.angle === -Math.PI / 2) {
              dy = "-0.5em"
            } else if (axis.angle === Math.PI / 2) {
              dy = "1.2em"
            }

            return (
              <g
                key={axis.key}
                className="cursor-pointer select-none"
                onMouseEnter={() => setHoveredAxis(axis.key)}
                onMouseLeave={() => setHoveredAxis(null)}
              >
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={textAnchor}
                  dy={dy}
                  className={cn(
                    "text-xs font-mono font-bold tracking-widest transition-all duration-300",
                    hoveredAxis === axis.key
                      ? cn("text-white fill-white scale-105")
                      : "text-zinc-500 fill-zinc-500"
                  )}
                >
                  {axis.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Dynamic Detail Card / Interactive Sidebar */}
      <div className="flex-1 w-full space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2">
            <Zap className="size-3 text-primary animate-pulse" />
            <span className="text-xs font-mono text-zinc-500 font-bold tracking-tight uppercase">
              Détail des compétences
            </span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-zinc-600 hover:text-zinc-400 transition-colors">
                  <HelpCircle className="size-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-zinc-900 border-white/10 text-xs font-mono font-bold tracking-tight text-zinc-400 max-w-50">
                Survole les sommets du graphique pour analyser chaque facette de tes compétences comportementales.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Categories Scores List */}
        <div className="grid grid-cols-2 gap-3">
          {AXIS_CONFIG.map((axis) => {
            const isActive = activeAxisKey === axis.key
            const scoreVal = scores[axis.key] || 0
            
            return (
              <div
                key={axis.key}
                onMouseEnter={() => setHoveredAxis(axis.key)}
                onMouseLeave={() => setHoveredAxis(null)}
                className={cn(
                  "p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-3",
                  isActive
                    ? "bg-white/3 border-white/10 shadow-xs"
                    : "bg-white/0.5 border-white/2 hover:border-white/5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={cn("size-6 rounded-md bg-zinc-900 border border-white/5 flex items-center justify-center transition-colors", isActive && "border-primary/20")}>
                    <axis.icon className={cn("size-3.5", axis.color)} />
                  </div>
                  <div className="text-left leading-none">
                    <div className={cn("text-3xs font-mono font-bold tracking-tight uppercase transition-colors", isActive ? "text-white" : "text-zinc-500")}>
                      {axis.label}
                    </div>
                  </div>
                </div>
                <div className={cn("text-base font-black font-mono tracking-tight", isActive ? "text-primary" : "text-zinc-400")}>
                  {scoreVal}
                </div>
              </div>
            )
          })}
        </div>

        {/* Adaptive Description Bento Block */}
        <div className="relative p-4 rounded-xl bg-white/1 border border-white/5 overflow-hidden group min-h-24 flex flex-col justify-center">
          <div
            className="absolute top-0 right-0 p-3 opacity-15 filter blur-xs text-zinc-600 select-none pointer-events-none group-hover:scale-105 transition-transform duration-700"
            style={{ color: activeAxis.stroke }}
          >
            <activeAxis.icon className="size-16" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeAxis.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="space-y-1.5 relative z-[var(--z-content)]"
            >
              <div className="flex items-center gap-1.5">
                <span className={cn("text-3xs font-mono font-bold px-1.5 py-0.5 rounded-sm bg-zinc-900 border border-white/5 uppercase", activeAxis.color)}>
                  {activeAxis.label}
                </span>
                {userClass?.toLowerCase() === activeAxis.key && (
                  <span className="text-xs-sm font-mono font-bold px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                    Force principale
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed text-left font-medium">
                {activeAxis.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
