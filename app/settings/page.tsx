"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  User, Mail, Globe, Briefcase,
  Target, Github, Link as LinkIcon,
  Search, Save, Loader2, Camera,
  Shield, Bell, Sparkles,
  Linkedin, Twitter, Settings, Check,
  ChevronRight, Fingerprint, AtSign,
  Languages, Palette, Layout, Cpu, Activity,
  Copy, Lock, Key, RefreshCw, AlertTriangle,
  Eye, EyeOff, CreditCard, Sliders, Zap,
  Terminal, QrCode, Wifi
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { CountrySelector } from "@/components/onboarding/country-selector"
import { UserSituation, MainObjective } from "@/lib/types"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { authClient } from "@/lib/auth-client"
import { ExpertiseDiagnostic } from "@/components/settings/expertise-diagnostic"
import { CLASS_COLORS, LEVEL_NAMES, XP_MAX } from "@/lib/member-card-constants"

// 1. DecryptingText Scrambler Effect Component
function DecryptingText({ text, speed = 25 }: { text: string; speed?: number }) {
  const [displayText, setDisplayText] = useState("")
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-="

  useEffect(() => {
    if (!text) return
    let currentIteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < currentIteration) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      )

      if (currentIteration >= text.length) {
        clearInterval(interval)
      }

      currentIteration += 1 / 3
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return <span className="font-mono tracking-wide">{displayText}</span>
}

// 2. High Definition Dynamic SVG Barcode Component
function SvgBarcode({ value }: { value: string }) {
  const chars = value || "HC-M-000001"
  let hash = 0
  for (let i = 0; i < chars.length; i++) {
    hash = (hash << 5) - hash + chars.charCodeAt(i)
    hash |= 0
  }
  const seed = Math.abs(hash)
  const bars = []
  let totalWidth = 0
  for (let i = 0; i < 28; i++) {
    const width = ((seed >> i) & 2) || 1
    bars.push(width)
    totalWidth += width + 1
  }

  return (
    <div className="flex flex-col items-center gap-1 select-none pointer-events-none">
      <svg className="h-6 w-28 text-white/50" viewBox={`0 0 ${totalWidth} 20`} fill="currentColor">
        {bars.map((w, idx) => {
          const x = bars.slice(0, idx).reduce((sum, curr) => sum + curr + 1, 0)
          return <rect key={idx} x={x} y="0" width={w} height="20" />
        })}
      </svg>
      <span className="text-[5.5px] font-mono text-zinc-500 font-black">{chars}</span>
    </div>
  )
}

// 3. Immersive Tactical Backgrounds per Profile Class
function ClassBackground({ userClass, tierColor }: { userClass: string; tierColor: string }) {
  const cl = (userClass || "builder").toLowerCase()
  if (cl === "builder") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {/* Engineering Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(184,255,59,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(184,255,59,0.08)_1px,transparent_1px)] bg-[size:12px_12px]" />
        {/* Hazard stripes */}
        <div className="absolute bottom-0 right-0 w-24 h-6 bg-[repeating-linear-gradient(45deg,rgba(184,255,59,0.25),rgba(184,255,59,0.25)_8px,transparent_8px,transparent_16px)]" />
        {/* Crosshair SVG */}
        <svg className="absolute top-4 right-4 w-12 h-12 text-[#B8FF3B]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M 10 50 H 90 M 50 10 V 90" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>
    )
  }
  if (cl === "creator") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        {/* Nebula cosmic swirls */}
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)] blur-2xl animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute -inset-10 bg-[radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.1),transparent_50%)] blur-2xl" />
        {/* Magic circles / glowing stars */}
        <svg className="absolute inset-0 w-full h-full text-purple-400/40" viewBox="0 0 300 200">
          <circle cx="240" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" />
          <circle cx="240" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" />
          <polygon points="240,85 243,97 255,100 243,103 240,115 237,103 225,100 237,97" fill="currentColor" className="opacity-40" />
        </svg>
      </div>
    )
  }
  if (cl === "strategist") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {/* Radar concentric dashed circles */}
        <svg className="absolute -left-10 -bottom-10 w-48 h-48 text-[#22D3EE]/30" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="6 4" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
        {/* Telemetry data overlays */}
        <div className="absolute top-3 right-16 font-mono text-[5.5px] text-[#22D3EE]/50 leading-tight text-right uppercase tracking-wider">
          SYS.LOC: 45.1092° N / 130.2918° E<br />
          HD_BAND: SECURE_SSO<br />
          VECTOR: [0.89, -0.42, 0.11]
        </div>
      </div>
    )
  }
  if (cl === "catalyst") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        {/* Sunburst flares */}
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.12),transparent_70%)] blur-2xl" />
        <svg className="absolute inset-0 w-full h-full text-orange-400/30" viewBox="0 0 300 200">
          <path d="M150,200 L0,50 M150,200 L50,0 M150,200 L150,0 M150,200 L250,0 M150,200 L300,50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 15" />
          <circle cx="150" cy="200" r="120" fill="none" stroke="currentColor" strokeWidth="0.75" />
        </svg>
      </div>
    )
  }
  return null
}

// 4. Circular Clearance/Integrity Gauge Component
function RadialIntegrityGauge({ percentage = 98, size = 110, strokeWidth = 8, color = "#B8FF3B" }: { percentage?: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  return (
    <div className="relative flex flex-col items-center justify-center shrink-0 select-none" style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg] size-full">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth={strokeWidth}
        />
        {/* Animated Accent Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`
          }}
        />
      </svg>
      {/* Text overlays */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-black tracking-tight text-white uppercase leading-none font-mono">
          {percentage}%
        </span>
        <span className="text-[6.5px] font-mono font-black tracking-wider text-zinc-500 uppercase mt-0.5">
          SECURE
        </span>
      </div>
    </div>
  )
}

// 5. Mini Sparkline Ping Graph
function Sparkline({ activeColor }: { activeColor: string }) {
  const [points, setPoints] = useState<number[]>([15, 10, 18, 12, 16, 14, 20])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const next = [...prev.slice(1), Math.floor(Math.random() * 15) + 5]
        return next
      })
    }, 1500)
    return () => clearInterval(interval)
  }, [])
  
  const pathData = `M 0 ${points[0]} L 10 ${points[1]} L 20 ${points[2]} L 30 ${points[3]} L 40 ${points[4]} L 50 ${points[5]} L 60 ${points[6]}`
  
  return (
    <svg className="w-12 h-5 text-zinc-500 select-none pointer-events-none" viewBox="0 0 60 25" fill="none">
      <path 
        d={pathData} 
        stroke={activeColor} 
        strokeWidth="1.25" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  )
}

// 6. Live SVG Activity Waveform Graph Component
function LiveWaveform() {
  return (
    <div className="relative w-full h-24 bg-black/60 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-4">
      {/* Grid line overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:10px_10px]" />
      
      <svg className="w-full h-full pointer-events-none" viewBox="0 0 300 80" preserveAspectRatio="none">
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(197,244,65,0.05)" />
            <stop offset="50%" stopColor="rgba(34,211,238,0.3)" />
            <stop offset="100%" stopColor="rgba(197,244,65,0.05)" />
          </linearGradient>
          <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(245,158,11,0.02)" />
            <stop offset="30%" stopColor="rgba(197,244,65,0.2)" />
            <stop offset="70%" stopColor="rgba(34,211,238,0.2)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0.02)" />
          </linearGradient>
        </defs>
        
        {/* Wave 1 */}
        <motion.path
          d="M 0 40 Q 75 10 150 40 T 300 40"
          fill="none"
          stroke="url(#waveGrad)"
          strokeWidth="1.5"
          animate={{
            d: [
              "M 0 40 Q 75 10 150 40 T 300 40",
              "M 0 40 Q 75 70 150 40 T 300 40",
              "M 0 40 Q 75 10 150 40 T 300 40"
            ]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Wave 2 */}
        <motion.path
          d="M 0 40 Q 75 60 150 40 T 300 40"
          fill="none"
          stroke="url(#waveGrad2)"
          strokeWidth="1"
          animate={{
            d: [
              "M 0 40 Q 75 60 150 40 T 300 40",
              "M 0 40 Q 75 20 150 40 T 300 40",
              "M 0 40 Q 75 60 150 40 T 300 40"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        {/* Center scanner sweep dotted line */}
        <line x1="0" y1="40" x2="300" y2="40" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
      </svg>
      
      {/* Real-time scanner dot */}
      <motion.div 
        className="absolute w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
        style={{ top: "calc(50% - 4px)" }}
        animate={{
          left: ["0%", "100%", "0%"]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

// 7. Cybernetic Notched CyberButton Component
interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glowColor?: string
  className?: string
  children: React.ReactNode
}

function CyberButton({ glowColor = "#B8FF3B", className, children, ...props }: CyberButtonProps) {
  return (
    <button
      className={cn(
        "relative p-[1.5px] group active:scale-[0.98] transition-all duration-300 cursor-pointer cyber-notch w-full",
        className
      )}
      style={{
        background: `linear-gradient(90deg, ${glowColor}aa, ${glowColor}22)`
      }}
      {...props}
    >
      <div 
        className="w-full h-full bg-black group-hover:bg-transparent transition-colors duration-300 text-white group-hover:text-black flex items-center justify-center py-3.5 px-6 font-mono font-black uppercase text-[10px] tracking-wider cyber-notch gap-2"
      >
        {children}
      </div>
    </button>
  )
}

const TABS = [
  { id: "profile", label: "Diagnostic", icon: User, desc: "Identité et informations de base" },
  { id: "expertise", label: "Spécialisation", icon: Sparkles, desc: "Tes domaines et outils favoris" },
  { id: "links", label: "Connectivité", icon: LinkIcon, desc: "Tes points d'ancrage externes" },
  { id: "vault", label: "Coffre-fort", icon: Fingerprint, desc: "Ta carte membre & clés d'accès" },
  { id: "account", label: "Sécurité", icon: Shield, desc: "Gestion du compte et accès" },
]

const TAB_COLORS: Record<string, { color: string; border: string; glow: string; text: string; label: string }> = {
  profile: { color: "#10B981", border: "border-emerald-500/30", glow: "rgba(16, 185, 129, 0.2)", text: "text-emerald-400", label: "PROFILE_NODE" },
  expertise: { color: "#A855F7", border: "border-purple-500/30", glow: "rgba(168, 85, 247, 0.2)", text: "text-purple-400", label: "SPECIALIZATION_NODE" },
  links: { color: "#06B6D4", border: "border-cyan-500/30", glow: "rgba(6, 182, 212, 0.2)", text: "text-cyan-400", label: "CONNECTIVITY_NODE" },
  vault: { color: "#B8FF3B", border: "border-[#B8FF3B]/30", glow: "rgba(184, 255, 59, 0.2)", text: "text-[#B8FF3B]", label: "VAULT_NODE" },
  account: { color: "#EF4444", border: "border-red-500/30", glow: "rgba(239, 68, 68, 0.2)", text: "text-red-400", label: "SECURITY_NODE" }
}



export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [autoSaving, setAutoSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [toolSearch, setToolSearch] = useState("")

  const [secretKey, setSecretKey] = useState<string | null>(null)
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  // Biometric scanner session state
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false)
  const [biometricState, setBiometricState] = useState<"STANDBY" | "SCANNING" | "DECRYPTING" | "SECURING" | "SUCCESS" | "FAILED">("STANDBY")
  const [biometricLogs, setBiometricLogs] = useState<string[]>([])

  // Formulaire Coffre-fort Saisie Manuelle & Liaisons
  const [customSecretCode, setCustomSecretCode] = useState("")
  const [customSignature, setCustomSignature] = useState("")
  const [cardTier, setCardTier] = useState("STANDARD")
  const [showSecretCode, setShowSecretCode] = useState(false)
  const [isSavingCustomCard, setIsSavingCustomCard] = useState(false)
  const [activeVaultMode, setActiveVaultMode] = useState("auto")

  // Dynamic network node latencies for live diagnostic telemetry console
  const [latencies, setLatencies] = useState<Record<string, number>>({
    squad: 14,
    missions: 28,
    sso: 8,
    community: 19
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLatencies(prev => ({
        squad: Math.max(8, Math.min(35, prev.squad + (Math.random() > 0.5 ? 1 : -1))),
        missions: Math.max(18, Math.min(55, prev.missions + (Math.random() > 0.5 ? 2 : -2))),
        sso: Math.max(4, Math.min(22, prev.sso + (Math.random() > 0.5 ? 1 : -1))),
        community: Math.max(10, Math.min(38, prev.community + (Math.random() > 0.5 ? 1.5 : -1.5)))
      }))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Language custom select
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (userData) {
      setCustomSignature(userData.cardSignature || "")
      setCardTier(userData.cardTier || "STANDARD")
    }
  }, [userData])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const saveCustomCard = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingCustomCard(true)
    try {
      const res = await fetch("/api/user/card/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customSecretCode: customSecretCode || undefined,
          customSignature: customSignature || undefined,
          cardTier: cardTier || undefined,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setUserData({
          ...userData,
          cardSignature: data.cardSignature,
          cardIssuedAt: data.cardIssuedAt,
          cardTier: data.cardTier,
          memberNumber: data.memberNumber,
        })
        setCustomSecretCode("") // Réinitialiser le mot de passe après sauvegarde
        toast.success("Coffre-fort et carte membre mis à jour avec succès !")
      } else {
        const errMsg = await res.text()
        toast.error(errMsg || "Échec de la mise à jour du coffre-fort.")
      }
    } catch {
      toast.error("Erreur réseau lors de la mise à jour.")
    } finally {
      setIsSavingCustomCard(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 10
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10
    setRotate({ x: rotateX, y: rotateY })

    const mx = (x / rect.width) * 100
    const my = (y / rect.height) * 100
    card.style.setProperty('--mx', `${mx}%`)
    card.style.setProperty('--my', `${my}%`)
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success("Code secret copié dans le presse-papiers !")
    setTimeout(() => setCopied(false), 2000)
  }

  const openBiometricScanner = () => {
    setIsBiometricModalOpen(true)
    setBiometricState("STANDBY")
    setBiometricLogs([
      "[SYS] CONSOLE SESSION INITIALIZED",
      "[SYS] ENCRYPTED ACCESS KEY GENERATOR READY",
      "[SYS] STANDBY - PLACE FINGERPRINT TO INITIATE CRYPTO MATCHING..."
    ])
  }

  const triggerBiometricScan = async () => {
    setBiometricState("SCANNING")
    setBiometricLogs([
      "[SYS] CAPACITIVE SCAN SENSOR [ONLINE]",
      "[SCAN] CAPTURING EPIDERMAL MAP VECTORS...",
      "[SCAN] ANALYZING RETINAL PATTERNS AND FLOW..."
    ])

    await new Promise(resolve => setTimeout(resolve, 800))
    setBiometricState("DECRYPTING")
    setBiometricLogs(prev => [
      ...prev,
      "[OK] BIOMETRIC SIGNATURE IDENTIFIED",
      "[SYS] DECRYPTING HASHCODE PROFILE DATA MATRIX...",
      "[SYS] RESOLVING CODESPACE HOLOGRAPHIC TIERS..."
    ])

    await new Promise(resolve => setTimeout(resolve, 800))
    setBiometricState("SECURING")
    setBiometricLogs(prev => [
      ...prev,
      "[OK] ENTROPY COEFFICIENT GENERATED",
      "[SYS] SECURING ACCESS HANDSHAKE WITH SSO GATEWAY...",
      "[NET] REGISTRATION IN PROGRESS, STANDBY..."
    ])

    try {
      const res = await fetch("/api/user/card/generate", {
        method: "POST",
      })
      
      if (res.ok) {
        const data = await res.json()
        setSecretKey(data.secretKey)
        setUserData(prev => ({
          ...prev,
          cardSignature: data.cardSignature,
          cardIssuedAt: data.cardIssuedAt,
          cardTier: data.cardTier,
          memberNumber: data.memberNumber,
        }))
        
        setBiometricState("SUCCESS")
        setBiometricLogs(prev => [
          ...prev,
          "[OK] CRYPTOGRAPHIC LINK FULLY RESOLVED",
          "[SUCCESS] SSO ACCESS KEY SECURELY SEALED AND ENGAGED."
        ])
        toast.success("Nouveau Code Secret généré avec succès !")
      } else {
        throw new Error("Generation endpoint error")
      }
    } catch {
      setBiometricState("FAILED")
      setBiometricLogs(prev => [
        ...prev,
        "[ERROR] SECURE CODESPACE SYNCHRONIZATION FAILURE",
        "[ERROR] TRANSACTION REVERTED"
      ])
      toast.error("Échec de la génération du code secret.")
    }
  }


  useEffect(() => {
    fetch("/api/user/me")
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(() => toast.error("Impossible de charger les données"))
  }, [])

  const save = useCallback(async (data: any, silent = false) => {
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setSavedAt(new Date());
        setIsDirty(false);
        if (!silent) toast.success("Données synchronisées.");
        return true;
      }
      if (!silent) toast.error("Erreur de synchronisation");
    } catch {
      if (!silent) toast.error("Erreur réseau");
    }
    return false;
  }, []);

  const updateData = useCallback((next: any) => {
    setUserData(next);
    setIsDirty(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setAutoSaving(true);
      await save(next, true);
      setAutoSaving(false);
    }, 2000);
  }, [save]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error(await res.text())

      const { url } = await res.json()
      setUserData({ ...userData, image: url })
      toast.success("Avatar mis à jour !")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload")
    } finally {
      setUploadingAvatar(false)
    }
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <span className="text-[10px] font-mono uppercase text-primary/60">Initialisation_Console_Settings...</span>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar user={userData} />
      <BottomNav />
 
      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />

        <UserTopBar user={userData} />
        
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {/* Context Header - Tactical Style */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                  <Cpu className="size-3.5 text-primary" />
                  <span className="text-[10px] font-mono font-black uppercase text-primary">System_Preferences_v2.2</span>
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
                    Configuration <span className="text-primary italic">.System</span>
                </h1>
                <p className="text-zinc-500 max-w-xl font-light text-sm md:text-base leading-relaxed">
                    Ajuste tes paramètres d&apos;habilitation et synchronise ton arsenal technique avec le réseau.
                </p>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                {isDirty && !autoSaving && (
                  <Button
                    onClick={() => { setLoading(true); save(userData).finally(() => setLoading(false)); }}
                    disabled={loading}
                    className="btn-primary-glow h-12 rounded-xl px-6 text-[11px] uppercase font-black tracking-wide gap-2"
                  >
                    {loading ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Sauvegarder_Manuellement
                  </Button>
                )}
                <div className="flex items-center gap-4 bg-zinc-900/40 border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-xl">
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] font-mono uppercase text-zinc-600 tracking-tighter">Status_Lien</span>
                    <span className={cn("text-[10px] font-mono font-black uppercase tracking-wider", autoSaving ? "text-primary" : isDirty ? "text-amber-500" : "text-emerald-500")}>
                      {autoSaving ? "SYNCING..." : isDirty ? "MODIFIÉ" : "OPÉRATIONNEL"}
                    </span>
                  </div>
                  <div className={cn("size-2 rounded-full", autoSaving ? "bg-primary animate-pulse" : isDirty ? "bg-amber-500" : "bg-emerald-500 shadow-[0_0_15px_#10b981]")} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
              
              {/* Tactical Navigation Sidebar */}
              <aside className="space-y-3">
                {TABS.map((tab) => {
                   const isActive = activeTab === tab.id
                   const tabColor = TAB_COLORS[tab.id] || TAB_COLORS.profile
                   return (
                     <button
                       key={tab.id}
                       onClick={() => setActiveTab(tab.id)}
                       className={cn(
                         "w-full flex items-start gap-5 p-5 rounded-[1.5rem] transition-all duration-500 border group text-left relative overflow-hidden cursor-pointer",
                         isActive 
                         ? "text-white backdrop-blur-md z-10" 
                         : "bg-white/[0.01] border-white/5 text-zinc-500 hover:bg-white/[0.03] hover:border-white/10 z-0"
                       )}
                       style={isActive ? {
                         backgroundColor: `${tabColor.color}12`,
                         borderColor: `${tabColor.color}44`,
                         boxShadow: `0 0 35px ${tabColor.color}11`
                       } : {}}
                     >
                       {isActive && (
                           <div className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-full shadow-[0_0_15px_currentColor]" style={{ backgroundColor: tabColor.color, color: tabColor.color }} />
                       )}
                       {/* Radial ambient backlight */}
                       {isActive && (
                         <div 
                           className="absolute inset-0 -z-10 pointer-events-none transition-all duration-500 opacity-60 animate-hud-pulse"
                           style={{
                             background: `radial-gradient(circle at 10% 50%, ${tabColor.color}22 0%, transparent 70%)`
                           }}
                         />
                       )}
                       <div className={cn(
                         "p-3 rounded-xl transition-all duration-500 relative",
                         isActive ? "text-black" : "bg-zinc-900 border border-white/5 group-hover:text-primary"
                       )}
                       style={isActive ? {
                         backgroundColor: tabColor.color,
                         boxShadow: `0 0 20px ${tabColor.color}cc`
                       } : {}}
                       >
                         {isActive && (
                           <span className="absolute -inset-1.5 rounded-xl blur-md pointer-events-none" style={{ backgroundColor: `${tabColor.color}33` }} />
                         )}
                        <tab.icon className="size-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className={cn("text-xs font-black uppercase tracking-wider transition-colors", isActive ? "text-white" : "group-hover:text-zinc-300")}
                           style={isActive ? { textShadow: `0 0 10px ${tabColor.color}44` } : {}}
                        >
                            {tab.label}
                        </p>
                        <p className="text-[10px] opacity-60 leading-tight font-light tracking-tight">{tab.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </aside>

              {/* Immersive Active Content Area */}
              {(() => {
                const activeColor = TAB_COLORS[activeTab] || TAB_COLORS.profile;
                return (
                  <div 
                    className="glass-card rounded-[2.5rem] overflow-hidden min-h-[650px] relative group/content transition-all duration-700 w-full"
                    style={{
                      borderColor: `${activeColor.color}25`,
                      boxShadow: `0 8px 32px 0 rgba(0,0,0,0.8), 0 0 40px ${activeColor.color}05`
                    }}
                  >
                    {/* HUD corner brackets for content area */}
                    <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 pointer-events-none transition-colors duration-500" style={{ borderColor: `${activeColor.color}35` }} />
                    <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 pointer-events-none transition-colors duration-500" style={{ borderColor: `${activeColor.color}35` }} />
                    <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 pointer-events-none transition-colors duration-500" style={{ borderColor: `${activeColor.color}35` }} />
                    <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 pointer-events-none transition-colors duration-500" style={{ borderColor: `${activeColor.color}35` }} />

                    {/* Top-left Telemetry Tag */}
                    <div className="absolute top-6 left-16 font-mono text-[7px] text-zinc-500 uppercase tracking-widest pointer-events-none select-none flex items-center gap-1.5">
                      <span className="size-1 rounded-full animate-ping" style={{ backgroundColor: activeColor.color }} />
                      [SYS_PREF: {activeColor.label}]
                    </div>

                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none group-hover/content:opacity-[0.06] transition-opacity duration-1000">
                        <Activity className="size-64" style={{ color: activeColor.color }} />
                    </div>
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="p-8 md:p-12 relative z-10"
                      >
                    {activeTab === "profile" && (
                      <div className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-white/5 pb-12">
                          
                          {/* Left Column (col-span-5) - Biometric Holographic Avatar Dock */}
                          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-zinc-950/40 border border-emerald-500/20 rounded-[2.5rem] relative overflow-hidden group/avatar-dock min-h-[280px]">
                            {/* Grid background */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none animate-grid-drift" />
                            
                            {/* Scanning green laser sweep */}
                            <div className="absolute inset-x-0 w-full animate-laser-sweep pointer-events-none" style={{ '--laser-color': '#10B981' } as React.CSSProperties} />
                            
                            {/* Target Vectors / Brackets */}
                            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-emerald-500/30 pointer-events-none group-hover/avatar-dock:border-emerald-500/60 transition-colors duration-500" />
                            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-emerald-500/30 pointer-events-none group-hover/avatar-dock:border-emerald-500/60 transition-colors duration-500" />
                            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-emerald-500/30 pointer-events-none group-hover/avatar-dock:border-emerald-500/60 transition-colors duration-500" />
                            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-emerald-500/30 pointer-events-none group-hover/avatar-dock:border-emerald-500/60 transition-colors duration-500" />

                            <div className="absolute top-4 left-6 font-mono text-[7px] text-emerald-500/60 uppercase tracking-widest pointer-events-none">
                              [SYS_IDENT: MAPPED]
                            </div>
                            <div className="absolute bottom-4 left-6 font-mono text-[7px] text-zinc-500 uppercase tracking-widest pointer-events-none space-y-0.5">
                              <div>NEURAL_DRIFT: 0.28</div>
                              <div>SYS_STATE: NOMINAL</div>
                            </div>
                            
                            <div className="relative group/avatar shrink-0 my-4">
                              {/* Octagonal notched holographic avatar dock wrapper */}
                              <div className="size-32 md:size-40 bg-zinc-900 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] flex items-center justify-center relative overflow-hidden group-hover/avatar:border-emerald-500/60 transition-all duration-700 cyber-notch">
                                <div className="absolute inset-0 bg-radial-gradient opacity-10 group-hover/avatar:opacity-20 pointer-events-none" />
                                {uploadingAvatar ? (
                                  <Loader2 className="size-10 animate-spin text-emerald-400" />
                                ) : userData?.image ? (
                                  <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-5xl font-black text-emerald-500/10 bg-linear-to-br from-emerald-500/5 to-transparent uppercase">
                                    {userData?.name?.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleAvatarUpload} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/webp"
                              />
                              <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingAvatar}
                                className="absolute -bottom-2 -right-2 p-3 rounded-2xl bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-110 active:scale-95 transition-all disabled:opacity-50 z-20 cursor-pointer"
                              >
                                <Camera className="size-4" />
                              </button>
                            </div>
                          </div>

                          {/* Right Column (col-span-7) - Profile Form Fields */}
                          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500"><User className="size-3 text-emerald-500"/> Nom_Identité</label>
                                <Input 
                                  value={userData?.name || ""} 
                                  onChange={e => updateData({...userData, name: e.target.value})}
                                  className="input-premium h-14 rounded-2xl text-base px-5 font-bold focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500"><AtSign className="size-3 text-emerald-500"/> Pseudo_System</label>
                                <Input 
                                  value={userData?.pseudo || ""} 
                                  onChange={e => updateData({...userData, pseudo: e.target.value})}
                                  className="input-premium h-14 rounded-2xl text-base px-5 font-bold font-mono focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                                  placeholder="votre_pseudo"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-mono font-black uppercase text-zinc-500">Bio_Signature</label>
                              <textarea 
                                value={userData?.bio || ""} 
                                onChange={e => updateData({...userData, bio: e.target.value})}
                                className="w-full input-premium min-h-[120px] rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-emerald-500/60 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] resize-none text-white leading-relaxed font-light italic"
                                placeholder="Ta signature communautaire..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                           <div className="space-y-2">
                              <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500"><Languages className="size-3 text-emerald-500"/> Langue_Code</label>
                              <div className="relative" ref={dropdownRef}>
                                <button
                                  type="button"
                                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                  className="w-full input-premium h-14 px-5 text-base focus:outline-none flex justify-between items-center text-white font-bold transition-all text-left cyber-notch"
                                >
                                  <span>{userData?.language === "en" ? "English (EN)" : "Français (FR)"}</span>
                                  <ChevronRight 
                                    className={cn(
                                      "size-4 text-zinc-400 transition-transform duration-300", 
                                      langDropdownOpen ? "-rotate-90 text-emerald-400 animate-pulse" : "rotate-90"
                                    )} 
                                  />
                                </button>
                                
                                <AnimatePresence>
                                  {langDropdownOpen && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute top-16 left-0 right-0 bg-zinc-950/90 border border-emerald-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 p-1.5 backdrop-blur-2xl cyber-notch"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateData({...userData, language: "fr"})
                                          setLangDropdownOpen(false)
                                        }}
                                        className={cn(
                                          "w-full text-left px-5 py-3.5 text-sm font-bold transition-all flex items-center justify-between cyber-notch-sm mb-1",
                                          userData?.language !== "en" ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                        )}
                                      >
                                        <span>Français (FR)</span>
                                        {userData?.language !== "en" && <Check className="size-4" />}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          updateData({...userData, language: "en"})
                                          setLangDropdownOpen(false)
                                        }}
                                        className={cn(
                                          "w-full text-left px-5 py-3.5 text-sm font-bold transition-all flex items-center justify-between cyber-notch-sm",
                                          userData?.language === "en" ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                                        )}
                                      >
                                        <span>English (EN)</span>
                                        {userData?.language === "en" && <Check className="size-4" />}
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500"><Globe className="size-3 text-emerald-500"/> Localisation_Géo</label>
                              <CountrySelector 
                                value={userData?.country || ""} 
                                onChange={val => updateData({...userData, country: val})}
                              />
                           </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "expertise" && (
                      <ExpertiseDiagnostic userData={userData} updateData={updateData} />
                    )}

                    {activeTab === "links" && (
                      <div className="space-y-8">
                        <div className="space-y-1 border-b border-white/5 pb-4">
                            <p className="text-[10px] font-mono font-black uppercase text-cyan-500">Canaux_Externes</p>
                            <p className="text-zinc-400 text-xs font-light">Lier tes réseaux renforce ton autorité et ton score de confiance.</p>
                        </div>
                        <div className="grid gap-6">
                          {[
                            { id: "githubUrl", icon: Github, label: "GitHub_Repo", placeholder: "github.com/votre-user", color: "group-focus-within:text-cyan-400" },
                            { id: "linkedinUrl", icon: Linkedin, label: "LinkedIn_Network", placeholder: "linkedin.com/in/profil", color: "group-focus-within:text-[#0077B5]" },
                            { id: "twitterUrl", icon: Twitter, label: "X_Twitter_Signal", placeholder: "x.com/votre-user", color: "group-focus-within:text-cyan-400" },
                            { id: "portfolioUrl", icon: Globe, label: "Portfolio_Dossier", placeholder: "votre-site.com", color: "group-focus-within:text-cyan-400" },
                          ].map((link) => {
                            const isLinked = !!userData[link.id]
                            const latency = isLinked ? (latencies.missions - 5) : 999
                            return (
                              <div key={link.id} className="relative p-6 bg-zinc-950/40 border border-cyan-500/10 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 group/uplink">
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                  <div className="relative shrink-0 flex items-center justify-center size-10 rounded-xl bg-zinc-900 border border-white/5">
                                    <link.icon className="size-5 text-zinc-400 group-focus-within/uplink:text-cyan-400 transition-colors" />
                                  </div>
                                  <div className="space-y-0.5">
                                    <span className="text-[9px] font-mono font-black uppercase text-zinc-500 tracking-wider block">{link.label}</span>
                                    <div className="flex items-center gap-2">
                                      <div className={cn("size-1.5 rounded-full", isLinked ? "bg-cyan-400 shadow-[0_0_10px_#06b6d4]" : "bg-amber-500 animate-pulse")} />
                                      <span className={cn("text-[9px] font-mono font-black uppercase tracking-widest", isLinked ? "text-cyan-400" : "text-amber-500")}>
                                        {isLinked ? "UPLINK: ACTIVE" : "UPLINK: STANDBY"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-1 max-w-xs w-full flex items-center justify-between bg-black/40 border border-white/[0.02] px-4 py-2 rounded-xl shrink-0">
                                  <div className="flex flex-col">
                                    <span className="text-[7px] font-mono text-zinc-600 font-bold uppercase leading-none">Latency</span>
                                    <span className="text-[9px] font-mono font-extrabold text-white mt-0.5 leading-none">
                                      {isLinked ? `${latency}ms` : "--- ms"}
                                    </span>
                                  </div>
                                  <div>
                                    {isLinked ? <Sparkline activeColor="#06b6d4" /> : (
                                      <svg className="w-12 h-5 text-zinc-800" viewBox="0 0 60 25" fill="none">
                                        <line x1="0" y1="12.5" x2="60" y2="12.5" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 3" className="opacity-50" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                                <div className="relative group/link w-full md:w-80">
                                  <Input 
                                    value={userData[link.id] || ""} 
                                    onChange={e => updateData({...userData, [link.id]: e.target.value})}
                                    className="input-premium h-12 rounded-xl text-xs font-bold pl-4 focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                                    placeholder={link.placeholder}
                                  />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    {activeTab === "vault" && (
                      <div className="space-y-10">
                        {/* Dynamic Tier colors and states for active card */}
                        {(() => {
                          const cl = (userData?.class || "builder").toLowerCase()
                          const baseColor = CLASS_COLORS[cl] || "#B8FF3B"
                          const activeTier = activeVaultMode === "manual" ? cardTier : (userData?.cardTier || "STANDARD")
                          
                          // Accent tier details
                          const tierColor = 
                            activeTier === "FOUNDER" ? "#F59E0B" : 
                            activeTier === "PREMIUM" ? "#22D3EE" : 
                            baseColor;

                          const tierGlow = 
                            activeTier === "FOUNDER" ? "rgba(245, 158, 11, 0.45)" : 
                            activeTier === "PREMIUM" ? "rgba(6, 182, 212, 0.45)" : 
                            `rgba(184, 255, 59, 0.25)`;

                          const strength = (() => {
                            if (!customSecretCode) return { score: 0, label: "VIDE", color: "bg-zinc-800", text: "text-zinc-500" }
                            if (customSecretCode.length < 8) return { score: 1, label: "TROP COURT (DANGER)", color: "bg-rose-500 shadow-[0_0_12px_#f43f5e]", text: "text-rose-500 font-black animate-pulse" }
                            if (customSecretCode.length < 12) return { score: 2, label: "VULNÉRABLE (FAIBLE)", color: "bg-amber-500 shadow-[0_0_12px_#f59e0b]", text: "text-amber-500" }
                            if (customSecretCode.length < 16) return { score: 3, label: "SÉCURISÉ (MOYEN)", color: "bg-cyan-500 shadow-[0_0_12px_#06b6d4]", text: "text-cyan-400" }
                            return { score: 4, label: "EXTRÊME (IMPÉNÉTRABLE)", color: "bg-emerald-500 shadow-[0_0_15px_#10b981]", text: "text-emerald-400 font-bold" }
                          })()

                          const signatureRegex = /^[A-Z0-9-]*$/
                          const isSignatureValid = signatureRegex.test(customSignature)

                          return (
                            <>
                              <div className="space-y-2 border-b border-white/5 pb-6">
                                <div className="flex items-center gap-2">
                                  <div className="size-2 rounded-full animate-pulse" style={{ backgroundColor: tierColor }} />
                                  <h2 className="text-xl font-black uppercase text-white italic">
                                    Coffre-fort d&apos;Accès <span style={{ color: tierColor }}>.Ecosystem</span>
                                  </h2>
                                </div>
                                <p className="text-xs text-zinc-500 font-light leading-relaxed">
                                  Configure ton identité HASHCODE unifiée. Enregistre une signature unique et tes clés d&apos;habilitation pour te connecter de manière sécurisée et décentralisée à l&apos;ensemble de nos réseaux.
                                </p>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                                {/* MODULE 01: DOCK DE CONFINEMENT DE LA CARTE */}
                                <div className="lg:col-span-6 relative rounded-[2.5rem] bg-zinc-950/40 border border-white/5 p-6 flex flex-col items-center justify-center overflow-hidden min-h-[380px] group/dock">
                                  {/* Grid drift background */}
                                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] opacity-45 pointer-events-none animate-grid-drift" />
                                  
                                  {/* Scanline scanning laser sweep */}
                                  <div className="absolute inset-x-0 w-full animate-laser-sweep pointer-events-none" style={{ '--laser-color': tierColor } as React.CSSProperties} />
                                  
                                  {/* HUD decorative brackets */}
                                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/20 pointer-events-none group-hover/dock:border-primary/50 transition-colors duration-500" />
                                  <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/20 pointer-events-none group-hover/dock:border-primary/50 transition-colors duration-500" />
                                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/20 pointer-events-none group-hover/dock:border-primary/50 transition-colors duration-500" />
                                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/20 pointer-events-none group-hover/dock:border-primary/50 transition-colors duration-500" />

                                  {/* Top HUD text */}
                                  <div className="absolute top-4 left-8 font-mono text-[7px] text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 pointer-events-none">
                                    <div className="size-1 rounded-full bg-emerald-500 animate-ping" /> CONFINEMENT_ACTIVE
                                  </div>
                                  <div className="absolute top-4 right-8 font-mono text-[7px] text-zinc-500 uppercase tracking-wider pointer-events-none">
                                    SECURE_LEVEL_LVL_{userData?.level || 1}
                                  </div>

                                  {/* Holographic Card Wrapper */}
                                  <div className="w-full max-w-[390px] relative group/card-wrapper z-10 transition-transform duration-500 hover:scale-[1.01]">
                                    {/* Glowing dynamic background aura */}
                                    <div 
                                      className="absolute -inset-1.5 rounded-[2.2rem] blur-2xl opacity-25 group-hover/card-wrapper:opacity-50 transition-all duration-1000"
                                      style={{ 
                                        backgroundColor: tierColor,
                                        boxShadow: `0 0 50px ${tierColor}20`
                                      }}
                                    />
                                    
                                    <div 
                                      ref={cardRef}
                                      onMouseMove={handleMouseMove}
                                      onMouseLeave={handleMouseLeave}
                                      className="relative w-full aspect-[1.586/1] rounded-[2rem] p-5 text-white overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] border transition-all duration-200 select-none cursor-pointer holographic-sheen"
                                      style={{
                                        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                                        borderColor: `${tierColor}33`,
                                        background: `radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(26,26,26,0.96) 0%, rgba(4,4,4,0.99) 100%)`,
                                        boxShadow: `0 0 45px ${tierColor}10, inset 0 0 20px ${tierColor}05`,
                                      }}
                                    >
                                      {/* Immersive Tactical background overlay based on class */}
                                      <ClassBackground userClass={userData?.class} tierColor={tierColor} />

                                      {/* Sub-pixel Tactical Mesh Background overlay */}
                                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:12px_12px] opacity-40 pointer-events-none" />

                                      {/* Holographic light reflection sweep aligned with 3D tilts */}
                                      <div 
                                        className="absolute inset-0 pointer-events-none opacity-45 mix-blend-overlay transition-opacity duration-300"
                                        style={{
                                          background: `radial-gradient(circle at ${50 + rotate.y * 3.5}% ${50 - rotate.x * 3.5}%, rgba(255,255,255,0.3) 0%, transparent 60%)`,
                                        }}
                                      />

                                      {/* Premium physical double-glare overlay */}
                                      <div 
                                        className="absolute inset-0 pointer-events-none mix-blend-color-dodge opacity-30 transition-all duration-300"
                                        style={{
                                          background: `
                                            radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.18) 0%, transparent 40%),
                                            radial-gradient(circle at calc(var(--mx, 50%) - 10%) calc(var(--my, 50%) - 10%), ${tierColor}1a 0%, transparent 60%)
                                          `
                                        }}
                                      />

                                      {/* SVG tactical HUD corner sights with coordinates */}
                                      <svg className="absolute top-4 left-4 size-6 pointer-events-none opacity-60 transition-all duration-500" viewBox="0 0 24 24" fill="none" style={{ color: tierColor }}>
                                        <path d="M 2 12 V 2 H 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                                        <circle cx="2" cy="2" r="1" fill="currentColor" />
                                        <text x="5" y="10" className="text-[5px] font-mono fill-current font-black opacity-75">x:0.45</text>
                                      </svg>
                                      <svg className="absolute top-4 right-4 size-6 pointer-events-none opacity-60 transition-all duration-500" viewBox="0 0 24 24" fill="none" style={{ color: tierColor }}>
                                        <path d="M 22 12 V 2 H 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                                        <circle cx="22" cy="2" r="1" fill="currentColor" />
                                        <text x="12" y="10" className="text-[5px] font-mono fill-current font-black opacity-75">y:0.29</text>
                                      </svg>
                                      <svg className="absolute bottom-4 left-4 size-6 pointer-events-none opacity-60 transition-all duration-500" viewBox="0 0 24 24" fill="none" style={{ color: tierColor }}>
                                        <path d="M 2 12 V 22 H 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                                        <circle cx="2" cy="22" r="1" fill="currentColor" />
                                        <text x="5" y="18" className="text-[5px] font-mono fill-current font-black opacity-75">z:8.91</text>
                                      </svg>
                                      <svg className="absolute bottom-4 right-4 size-6 pointer-events-none opacity-60 transition-all duration-500" viewBox="0 0 24 24" fill="none" style={{ color: tierColor }}>
                                        <path d="M 22 12 V 22 H 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                                        <circle cx="22" cy="22" r="1" fill="currentColor" />
                                        <text x="12" y="18" className="text-[5px] font-mono fill-current font-black opacity-75">w:1.02</text>
                                      </svg>

                                      {/* Top Line */}
                                      <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="space-y-0.5">
                                          <div className="flex items-center gap-1.5">
                                            <Wifi className="size-2.5 text-zinc-600 animate-pulse" />
                                            <span className="text-[7px] font-mono text-zinc-500 font-bold uppercase">SSO_INTEGRITY_SECURED</span>
                                          </div>
                                          <h3 className="text-xs font-black tracking-wider text-white uppercase italic">{"HASHCODE // CODESPACE"}</h3>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-black/60 backdrop-blur-md" style={{ borderColor: `${tierColor}33` }}>
                                          <div className="size-1.5 rounded-full animate-pulse" style={{ backgroundColor: tierColor, boxShadow: `0 0 10px ${tierColor}` }} />
                                          <span className="text-[7px] font-mono tracking-wider font-bold uppercase" style={{ color: tierColor }}>
                                            {activeTier}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Content block */}
                                      <div className="grid grid-cols-[56px_1fr] gap-3 items-center relative z-10 mb-2">
                                        {/* Avatar wrapped in tactical polygon shape */}
                                        <div className="relative shrink-0">
                                          <div 
                                            className="size-14 rounded-[1.25rem] bg-zinc-950/90 overflow-hidden border flex items-center justify-center transition-all duration-700 shadow-xl"
                                            style={{ borderColor: `${tierColor}44` }}
                                          >
                                            {userData?.image ? (
                                              <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/10 uppercase bg-linear-to-br from-white/5 to-transparent">
                                                {userData?.name?.charAt(0)}
                                              </div>
                                            )}
                                          </div>
                                          <div className="absolute inset-0 rounded-[1.25rem] blur-md opacity-20 pointer-events-none" style={{ backgroundColor: tierColor }} />
                                        </div>

                                        {/* User details */}
                                        <div className="space-y-1 min-w-0">
                                          <div>
                                            <h4 className="text-xs font-black tracking-tight text-white uppercase truncate leading-none">
                                              <DecryptingText text={userData?.name || "ANONYMOUS"} />
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                              <p className="text-[8px] font-mono text-zinc-500 tracking-wider">@{userData?.pseudo || "non_defini"}</p>
                                            </div>
                                          </div>

                                          {/* Microchip SVG and Barcode */}
                                          <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                              <span className="text-[5px] font-mono text-zinc-600 uppercase tracking-wide leading-none block">Profile</span>
                                              <div className="text-[9px] font-black uppercase tracking-wider" style={{ color: CLASS_COLORS[cl] || "#B8FF3B" }}>
                                                {userData?.class || "BUILDER"}{" // SQUAD"}
                                              </div>
                                            </div>

                                            <div className="flex items-center gap-2.5 shrink-0">
                                              <svg className="size-7" viewBox="0 0 100 100" fill="none">
                                                <rect x="20" y="20" width="60" height="60" rx="10" fill="url(#chip-grad-bento)" stroke={tierColor} strokeWidth="1.5" />
                                                <path d="M 35 20 V 80 M 50 20 V 80 M 65 20 V 80 M 20 35 H 80 M 20 50 H 80 M 20 65 H 80" stroke={`${tierColor}40`} strokeWidth="1" />
                                                <circle cx="50" cy="50" r="10" fill="#0c0a09" stroke={tierColor} strokeWidth="1" />
                                                <defs>
                                                  <linearGradient id="chip-grad-bento" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    {activeTier === "FOUNDER" ? (
                                                      <>
                                                        <stop offset="0%" stopColor="#fbbf24" />
                                                        <stop offset="30%" stopColor="#f59e0b" />
                                                        <stop offset="70%" stopColor="#fbbf24" />
                                                        <stop offset="100%" stopColor="#d97706" />
                                                      </>
                                                    ) : activeTier === "PREMIUM" ? (
                                                      <>
                                                        <stop offset="0%" stopColor="#67e8f9" />
                                                        <stop offset="30%" stopColor="#06b6d4" />
                                                        <stop offset="70%" stopColor="#22d3ee" />
                                                        <stop offset="100%" stopColor="#0891b2" />
                                                      </>
                                                    ) : (
                                                      <>
                                                        <stop offset="0%" stopColor="#e5e7eb" />
                                                        <stop offset="30%" stopColor="#9ca3af" />
                                                        <stop offset="70%" stopColor="#d1d5db" />
                                                        <stop offset="100%" stopColor="#4b5563" />
                                                      </>
                                                    )}
                                                  </linearGradient>
                                                </defs>
                                              </svg>

                                              <SvgBarcode value={userData?.memberNumber ? `HC-M-${String(userData.memberNumber).padStart(6, '0')}` : "HC-M-000001"} />
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* physical segmented ticks progress bar */}
                                      {(() => {
                                        const currentLvl = userData?.level || 1
                                        const currentXp = userData?.experience || 0
                                        const maxXp = XP_MAX[currentLvl] || 100
                                        const progressPercentage = Math.min(100, Math.max(0, (currentXp / maxXp) * 100))

                                        return (
                                          <div className="w-full relative z-10 px-0.5 my-1.5">
                                            <div className="flex justify-between items-center text-[5.5px] font-mono text-zinc-500 uppercase tracking-wide mb-1 leading-none">
                                              <span className="flex items-center gap-1"><Cpu className="size-2 text-zinc-500" /> EVOLUTION ENGINE</span>
                                              <span>{currentXp} / {maxXp} XP</span>
                                            </div>
                                            <div className="flex gap-0.5 h-1 w-full bg-zinc-950/80 p-px rounded-xs border border-white/5 overflow-hidden">
                                              {Array.from({ length: 12 }).map((_, i) => {
                                                const active = (i / 12) * 100 < progressPercentage
                                                return (
                                                  <div 
                                                    key={i} 
                                                    className="flex-1 h-full rounded-2xs transition-all duration-500"
                                                    style={{ 
                                                      backgroundColor: active ? tierColor : "rgba(255, 255, 255, 0.05)",
                                                      boxShadow: active ? `0 0 6px ${tierColor}` : "none"
                                                    }}
                                                  />
                                                )
                                              })}
                                            </div>
                                          </div>
                                        )
                                      })()}

                                      {/* Footer bar */}
                                      <div className="absolute bottom-3 left-5 right-5 flex justify-between items-end border-t border-white/5 pt-1.5 relative z-10">
                                        <div className="flex items-center gap-2.5">
                                          <div>
                                            <span className="text-[5px] font-mono text-zinc-600 uppercase block leading-none">Access_Lvl</span>
                                            <div className="text-[7.5px] font-mono font-bold text-zinc-300 leading-none mt-0.5">LVL {userData?.level || 1}</div>
                                          </div>
                                          <div>
                                            <span className="text-[5px] font-mono text-zinc-600 uppercase block leading-none">SSO_Integrity</span>
                                            <div className="text-[7.5px] font-mono font-bold text-emerald-400 flex items-center gap-0.5 leading-none mt-0.5">
                                              <span className="size-1 rounded-full bg-emerald-500 animate-pulse" /> 98%
                                            </div>
                                          </div>
                                          <div>
                                            <span className="text-[5px] font-mono text-zinc-600 uppercase block leading-none">SSO_Ping</span>
                                            <div className="text-[7.5px] font-mono font-bold text-zinc-300 leading-none mt-0.5">{latencies.sso || 8}ms</div>
                                          </div>
                                        </div>

                                        <div className="flex flex-col items-end">
                                          <span className="text-[4.5px] font-mono text-zinc-700 tracking-tighter uppercase leading-none">Security_Signature</span>
                                          <span className="text-[7px] font-mono font-black text-white tracking-wide leading-none mt-0.5" style={{ textShadow: `0 0 8px ${tierColor}40` }}>
                                            {activeVaultMode === "manual" && customSignature
                                              ? customSignature.trim().toUpperCase()
                                              : (userData?.cardSignature || "AUCUNE_SIGNATURE")}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* MODULE 02: CONSOLE DE CONTROLE SSO */}
                                <div className="lg:col-span-6 relative rounded-[2.5rem] bg-zinc-950/40 border border-white/5 p-6 md:p-8 flex flex-col justify-between overflow-hidden group/sso">
                                  {/* Switch mode pills inside the console */}
                                  <div className="space-y-6 w-full">
                                    <div className="flex p-1 bg-black/60 border border-white/5 rounded-2xl relative overflow-hidden">
                                      <button
                                        type="button"
                                        onClick={() => setActiveVaultMode("auto")}
                                        className={cn(
                                          "flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative z-10 cursor-pointer",
                                          activeVaultMode === "auto" ? "text-black font-extrabold" : "text-zinc-500 hover:text-zinc-300"
                                        )}
                                      >
                                        {activeVaultMode === "auto" && (
                                          <motion.div 
                                            layoutId="activeVaultPillBento" 
                                            className="absolute inset-0 bg-primary rounded-xl z-[-1] shadow-[0_0_20px_rgba(197,244,65,0.4)]"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                          />
                                        )}
                                        <RefreshCw className="size-3.5" />
                                        Génération Auto
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setActiveVaultMode("manual")}
                                        className={cn(
                                          "flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 relative z-10 cursor-pointer",
                                          activeVaultMode === "manual" ? "text-black font-extrabold" : "text-zinc-500 hover:text-zinc-300"
                                        )}
                                      >
                                        {activeVaultMode === "manual" && (
                                          <motion.div 
                                            layoutId="activeVaultPillBento" 
                                            className="absolute inset-0 bg-primary rounded-xl z-[-1] shadow-[0_0_20px_rgba(197,244,65,0.4)]"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                          />
                                        )}
                                        <Sliders className="size-3.5" />
                                        Liaison Manuelle
                                      </button>
                                    </div>

                                    <AnimatePresence mode="wait">
                                      {activeVaultMode === "auto" ? (
                                        <motion.div
                                          key="auto-vault-bento"
                                          initial={{ opacity: 0, x: -10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: 10 }}
                                          transition={{ duration: 0.3 }}
                                          className="space-y-6"
                                        >
                                          <div className="flex items-center gap-6 bg-zinc-900/30 border border-white/[0.03] p-5 rounded-2xl backdrop-blur-md">
                                            {/* Circular gauge */}
                                            <RadialIntegrityGauge percentage={98} size={90} strokeWidth={6} color={tierColor} />
                                            
                                            <div className="space-y-1">
                                              <span className="text-[7.5px] font-mono font-bold text-zinc-500 uppercase tracking-wider">SSO_SECURE_INTEGRITY</span>
                                              <h3 className="text-xs font-black text-white uppercase italic leading-none">Connexion SSO Chiffrée</h3>
                                              <p className="text-[9.5px] text-zinc-500 font-light leading-relaxed">
                                                Cryptage fort transient. Votre signature numérique unifiée est active et sécurisée contre les intrusions réseau.
                                              </p>
                                            </div>
                                          </div>

                                          <div className="pt-2">
                                            <CyberButton
                                              type="button"
                                              glowColor={tierColor}
                                              onClick={openBiometricScanner}
                                            >
                                              <Zap className="size-3.5 text-current shrink-0" />
                                              {userData?.cardSecretHash ? "Générer_Nouveau_Code" : "Générer_Code_Secret"}
                                            </CyberButton>
                                          </div>
                                        </motion.div>
                                      ) : (
                                        <motion.div
                                          key="manual-vault-bento"
                                          initial={{ opacity: 0, x: 10 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          exit={{ opacity: 0, x: -10 }}
                                          transition={{ duration: 0.3 }}
                                          className="space-y-5"
                                        >
                                          <form onSubmit={saveCustomCard} className="space-y-5">
                                            {/* 1. Code Secret SSO */}
                                            <div className="space-y-2">
                                              <label className="text-[9px] font-mono font-black uppercase text-zinc-500 flex items-center justify-between">
                                                <span>Code Secret SSO (Perso)</span>
                                                <span className={`text-[8px] font-mono tracking-normal px-2 py-0.5 rounded bg-zinc-950/80 border border-white/5 ${strength.text}`}>
                                                  {strength.label}
                                                </span>
                                              </label>
                                              <div className="relative group/secret">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within/secret:text-primary transition-colors duration-300">
                                                  <Lock className="size-4" />
                                                </div>
                                                <input
                                                  type={showSecretCode ? "text" : "password"}
                                                  value={customSecretCode}
                                                  onChange={e => setCustomSecretCode(e.target.value)}
                                                  placeholder={userData?.cardSecretHash ? "••••••••••••••••••••" : "Définir ton code secret SSO..."}
                                                  className="w-full input-premium h-12 rounded-xl pl-11 pr-11 text-xs focus:outline-none font-mono font-bold"
                                                />
                                                <button
                                                  type="button"
                                                  onClick={() => setShowSecretCode(!showSecretCode)}
                                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                                >
                                                  {showSecretCode ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                                </button>
                                              </div>

                                              {/* Matrix Decryption Grid */}
                                              {customSecretCode && (
                                                <div className="space-y-2">
                                                  <div className="grid grid-cols-10 gap-1 p-2.5 bg-black/60 rounded-xl border border-white/5 relative overflow-hidden">
                                                    {/* Animated Matrix Laser Sweep */}
                                                    <div 
                                                      className="absolute inset-x-0 w-full animate-laser-sweep pointer-events-none" 
                                                      style={{ 
                                                        '--laser-color': 
                                                          strength.score === 1 ? '#f43f5e' : 
                                                          strength.score === 2 ? '#f59e0b' : 
                                                          strength.score === 3 ? '#06b6d4' : 
                                                          '#10b981' 
                                                      } as React.CSSProperties} 
                                                    />

                                                    {Array.from({ length: 20 }).map((_, index) => {
                                                      const charCode = customSecretCode.charCodeAt(index % customSecretCode.length) || 0
                                                      const binaryVal = (charCode + index) % 2 === 0 ? "1" : "0"
                                                      const blockStep = Math.floor(index / 5) + 1
                                                      const isLit = strength.score >= blockStep
                                                      const blockColor = 
                                                        strength.score === 1 ? "bg-rose-500 text-black border-transparent shadow-[0_0_8px_#f43f5e] relative z-10" :
                                                        strength.score === 2 ? "bg-amber-500 text-black border-transparent shadow-[0_0_8px_#f59e0b] relative z-10" :
                                                        strength.score === 3 ? "bg-cyan-500 text-black border-transparent shadow-[0_0_8px_#06b6d4] relative z-10" :
                                                        "bg-emerald-500 text-black border-transparent shadow-[0_0_8px_#10b981] relative z-10";
                                                      
                                                      return (
                                                        <div 
                                                          key={index} 
                                                          className={cn(
                                                            "aspect-square rounded-sm border flex items-center justify-center text-[8px] font-mono font-black transition-all duration-500 select-none relative z-10", 
                                                            isLit ? blockColor + " scale-100" : "bg-zinc-950/80 border-white/5 text-zinc-700 scale-95"
                                                          )}
                                                        >
                                                          {binaryVal}
                                                        </div>
                                                      )
                                                    })}
                                                  </div>
                                                  <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500 tracking-wider px-1">
                                                    <span>ENTROPY_GRID_LOADED</span>
                                                    <span>COMPLEXITY_INDEX: {strength.score}/4</span>
                                                  </div>
                                                </div>
                                              )}
                                            </div>

                                            {/* 2. Signature Gravée */}
                                            <div className="space-y-2">
                                              <label className="text-[9px] font-mono font-black uppercase text-zinc-500 flex justify-between items-center">
                                                <span>Signature Unique Gravée</span>
                                                {customSignature && (
                                                  <span className={`text-[8px] font-mono px-2 py-0.5 rounded bg-zinc-950/80 border border-white/5 ${isSignatureValid ? "text-emerald-400" : "text-rose-500"}`}>
                                                    {isSignatureValid ? "FORMAT_VALIDE" : "ALPHANUM_ONLY"}
                                                  </span>
                                                )}
                                              </label>
                                              <div className="relative group/sig">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within/sig:text-primary transition-colors duration-300">
                                                  <AtSign className="size-4" />
                                                </div>
                                                <input
                                                  type="text"
                                                  value={customSignature}
                                                  onChange={e => {
                                                    const val = e.target.value.toUpperCase()
                                                    if (signatureRegex.test(val) || val === "") {
                                                      setCustomSignature(val)
                                                    }
                                                  }}
                                                  placeholder="Ex: ALPHA-DRUID-09"
                                                  className="w-full input-premium h-12 rounded-xl pl-11 pr-5 text-xs focus:outline-none font-bold uppercase font-mono tracking-wider"
                                                />
                                              </div>
                                            </div>

                                            {/* 3. Tier Selector buttons */}
                                            <div className="space-y-2">
                                              <label className="text-[9px] font-mono font-black uppercase text-zinc-500 block">
                                                Niveau d&apos;Habilitation (Tier)
                                              </label>
                                              <div className="grid grid-cols-3 gap-3">
                                                {[
                                                  { id: "STANDARD", title: "STANDARD", desc: "Base", color: "#B8FF3B", glow: "rgba(184, 255, 59, 0.15)" },
                                                  { id: "PREMIUM", title: "PREMIUM", desc: "Pro Hub", color: "#22D3EE", glow: "rgba(34, 211, 238, 0.15)" },
                                                  { id: "FOUNDER", title: "FOUNDER", desc: "Elite", color: "#F59E0B", glow: "rgba(245, 158, 11, 0.15)" },
                                                ].map((t) => {
                                                  const isSelected = cardTier === t.id
                                                  return (
                                                    <button
                                                      key={t.id}
                                                      type="button"
                                                      onClick={() => setCardTier(t.id)}
                                                      className={cn(
                                                        "p-3 text-left font-mono transition-all duration-500 relative overflow-hidden flex flex-col justify-between aspect-[1.3/1] cursor-pointer group/tier cyber-notch border",
                                                        isSelected
                                                          ? "text-white"
                                                          : "bg-black/50 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-400"
                                                      )}
                                                      style={isSelected ? {
                                                        borderColor: t.color,
                                                        backgroundColor: `${t.color}05`,
                                                        boxShadow: `0 0 20px ${t.glow}`,
                                                      } : {}}
                                                    >
                                                      {/* Holographic light reflect line when hovered */}
                                                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover/tier:animate-holographic-sheen pointer-events-none" />

                                                      {/* Hazard Stripes when selected */}
                                                      {isSelected && (
                                                        <div className="absolute top-0 right-0 h-1 w-1/2 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,currentColor_2px,currentColor_4px)] opacity-20 pointer-events-none" style={{ color: t.color }} />
                                                      )}

                                                      {/* Corner Target Vectors */}
                                                      <div className={cn("absolute top-1 left-1 size-1.5 border-t border-l pointer-events-none transition-colors", isSelected ? "border-current" : "border-white/10 group-hover/tier:border-white/30")} style={isSelected ? { color: t.color } : {}} />
                                                      <div className={cn("absolute bottom-1 right-1 size-1.5 border-b border-r pointer-events-none transition-colors", isSelected ? "border-current" : "border-white/10 group-hover/tier:border-white/30")} style={isSelected ? { color: t.color } : {}} />

                                                      <div className="flex justify-between items-start w-full">
                                                        <span className="text-[8.5px] font-black tracking-wider uppercase">{t.title}</span>
                                                        {isSelected && (
                                                          <div className="size-1.5 rounded-full animate-pulse shadow-[0_0_10px_currentColor]" style={{ backgroundColor: t.color, color: t.color }} />
                                                        )}
                                                      </div>
                                                      <div className="space-y-0.5">
                                                        <span className="text-[7.5px] font-bold opacity-60 block leading-none">{t.desc}</span>
                                                        <span className="text-[5.5px] opacity-40 font-mono tracking-tighter uppercase block">AUTHENTICATION_LEVEL</span>
                                                      </div>
                                                    </button>
                                                  )
                                                })}
                                              </div>
                                            </div>

                                            {/* Submit Cyber Button */}
                                            <div className="pt-2">
                                              <CyberButton
                                                type="submit"
                                                glowColor={tierColor}
                                                disabled={isSavingCustomCard || !isSignatureValid}
                                              >
                                                {isSavingCustomCard ? (
                                                  <Loader2 className="size-3.5 animate-spin animate-duration-1000 shrink-0" />
                                                ) : (
                                                  <Save className="size-3.5 shrink-0" />
                                                )}
                                                Sauvegarder_Coffre_Fort
                                              </CyberButton>
                                            </div>
                                          </form>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>

                                {/* MODULE 03: LIVE NETWORK TELEMETRY CONSOLE */}
                                <div className="lg:col-span-12 relative rounded-[2.5rem] bg-zinc-950/40 border border-white/5 p-6 overflow-hidden group/telemetry">
                                  <div className="absolute top-4 right-6 font-mono text-[7px] text-zinc-600 uppercase tracking-wider flex items-center gap-1.5 pointer-events-none">
                                    <div className="size-1.5 rounded-full bg-emerald-500 animate-ping" /> STAT_FEED: OPERATIONAL
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                                    {/* Column A: Live Waveform */}
                                    <div className="md:col-span-7 space-y-3">
                                      <div className="space-y-0.5">
                                        <h3 className="text-xs font-black text-white uppercase italic flex items-center gap-2">
                                          <Activity className="size-3.5 text-primary animate-pulse" /> Diagnostique Flux Réseau
                                        </h3>
                                        <p className="text-[9.5px] text-zinc-500 font-mono uppercase tracking-wider">Activité & Analyse de Paquets en Direct</p>
                                      </div>
                                      
                                      <LiveWaveform />
                                    </div>

                                    {/* Column B: Live Network Latency stats */}
                                    <div className="md:col-span-5 space-y-3">
                                      <div className="font-mono text-[8px] text-zinc-600 font-bold uppercase tracking-wider border-b border-white/5 pb-1">
                                        Ecosystem Nodes Latency Telemetry
                                      </div>
                                      <div className="grid grid-cols-2 gap-2 text-[8px] font-mono text-zinc-400">
                                        {[
                                          { id: "squad", name: "SQUAD_SERVICE", label: "Squad Service", active: !!userData?.squadId },
                                          { id: "missions", name: "MISSIONS_API", label: "Missions Portal", active: true },
                                          { id: "sso", name: "SSO_GATEWAY", label: "SSO Auth Gate", active: !!userData?.cardSecretHash },
                                          { id: "community", name: "COMMUNITY_GUILD", label: "Community Guild", active: !!userData?.class },
                                        ].map((node) => {
                                          const latency = latencies[node.id] || 15
                                          const pingColor = 
                                            latency < 15 ? "#10b981" : 
                                            latency < 30 ? "#22d3ee" : 
                                            "#f59e0b";
                                          
                                          return (
                                            <div key={node.id} className="bg-zinc-900/40 p-2.5 rounded-xl border border-white/[0.02] flex flex-col justify-between gap-2">
                                              <div className="flex items-center justify-between w-full">
                                                <span className="text-[7.5px] text-zinc-500 font-bold">{node.name}</span>
                                                <div className="size-1.5 rounded-full" style={{ backgroundColor: node.active ? "#10b981" : "rgba(255,255,255,0.05)" }} />
                                              </div>
                                              <div className="flex items-end justify-between">
                                                <span className="text-[10px] font-extrabold text-white font-mono leading-none">
                                                  {latency}<span className="text-[7px] font-normal text-zinc-500">ms</span>
                                                </span>
                                                <Sparkline activeColor={pingColor} />
                                              </div>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* MODULE 04: CRYPTOGRAPHIC VAULT TERMINAL (Secret Key Container) */}
                                <AnimatePresence>
                                  {secretKey && (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      transition={{ duration: 0.4, ease: "easeOut" }}
                                      className="lg:col-span-12 p-6 md:p-8 rounded-[2.5rem] bg-emerald-950/10 border border-emerald-500/20 space-y-6 relative overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.15)]"
                                    >
                                      {/* HUD decorative brackets on the alert box */}
                                      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-emerald-500/30 pointer-events-none" />
                                      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-emerald-500/30 pointer-events-none" />
                                      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-emerald-500/30 pointer-events-none" />
                                      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-emerald-500/30 pointer-events-none" />

                                      {/* Cyber Grid scanline overlay */}
                                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(16,185,129,0.05))] bg-[linear-gradient(rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-60 pointer-events-none" />

                                      {/* Warning Hazard Stripe Tape Gradient */}
                                      <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,#10b981,#10b981_10px,#022c22_10px,#022c22_20px)] rounded-full mb-2 pointer-events-none opacity-80 animate-pulse" />

                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/10 pb-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                          <div className="p-3 bg-emerald-950/80 border border-emerald-500/30 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-hud-pulse">
                                            <Shield className="size-5 text-emerald-400" />
                                          </div>
                                          <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5">
                                              <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                                              <span className="text-[7px] font-mono text-emerald-500 font-bold uppercase tracking-wider">CONFINEMENT_CRITICAL_AREA</span>
                                            </div>
                                            <h3 className="text-sm font-black uppercase text-white italic">
                                              Coffre Cryptographique Sécurisé
                                            </h3>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-[7.5px] font-mono text-emerald-500/60 uppercase">
                                          <span>ALGO: AES-GCM-256</span>
                                          <span className="hidden sm:inline">•</span>
                                          <span>BITS: 256</span>
                                          <span className="hidden sm:inline">•</span>
                                          <span>NODE: HC-ALPHA</span>
                                        </div>
                                      </div>

                                      <p className="text-xs text-zinc-400 font-light leading-relaxed pl-1">
                                        Recopie immédiatement ce code d&apos;accès dans un endroit sûr. Pour des raisons strictes de sécurité et de conformité RGPD, <strong className="text-emerald-400 font-bold">cette clé ne sera plus jamais visible</strong> après la fermeture de cet écran. Conserve-la précieusement pour connecter tes applications décentralisées.
                                      </p>

                                      <div className="flex items-center gap-4 bg-black/85 border border-emerald-500/20 p-5 rounded-2xl font-mono text-sm font-bold text-white shadow-inner relative overflow-hidden group/key-container">
                                        {/* Decorative background grid inside copy bar */}
                                        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:8px_100%] opacity-40 pointer-events-none" />
                                        <span className="text-emerald-400 select-all truncate pr-28 font-mono tracking-wide relative z-10 w-full">
                                          <DecryptingText text={secretKey} />
                                        </span>
                                        <Button
                                          onClick={() => copyToClipboard(secretKey)}
                                          className="absolute right-2 top-1/2 -translate-y-1/2 h-11 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all font-mono font-black text-[9px] uppercase tracking-wider flex items-center gap-2 group/copy-btn relative z-20 shrink-0 cursor-pointer"
                                        >
                                          {copied ? (
                                            <>
                                              <Check className="size-3.5" />
                                              Copié
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="size-3.5 animate-pulse" />
                                              Copier_Clé
                                            </>
                                          )}
                                        </Button>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    )}

                    {activeTab === "account" && (
                      <div className="space-y-12">
                        <div className="space-y-6">
                           <label className="flex items-center gap-2 text-[10px] font-mono font-black uppercase text-zinc-500">
                             <Fingerprint className="size-4 text-red-500 animate-pulse" /> Accès_Système_Autorisé
                           </label>
                           
                           <div className="relative p-[1.5px] cyber-notch bg-gradient-to-r from-emerald-500/20 via-emerald-500/5 to-transparent">
                             <div className="p-8 bg-black/85 cyber-notch space-y-6 relative overflow-hidden group/acc">
                                {/* Decorative grid */}
                                <div className="absolute inset-0 cyber-grid-emerald pointer-events-none opacity-40" />
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/acc:opacity-10 transition-opacity">
                                  <Shield className="size-16 text-emerald-400" />
                                </div>
                                
                                <div className="space-y-3 relative z-10">
                                  <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
                                    <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest font-black">
                                      {"NODE_SECURE: GRANTED // ENCRYPTION_SCHEME: SSL_TLS_1.3"}
                                    </span>
                                  </div>
                                  
                                  <h3 className="text-xl font-mono font-black text-white uppercase tracking-tight flex items-center gap-3">
                                    <span className="text-emerald-400">{userData?.email?.split("@")[0]}</span>
                                    <span className="text-zinc-600 font-light">@</span>
                                    <span className="text-zinc-400 text-sm">{userData?.email?.split("@")[1]}</span>
                                  </h3>
                                  <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
                                    UPLINK_IDENTITY_HASH: <span className="text-zinc-400 font-bold select-all">{userData?.id}</span>
                                  </p>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 relative z-10">
                                  <div className="flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                                    <span className="text-[9px] font-mono text-emerald-400/80 uppercase font-black tracking-wider">
                                      AUTHENTICATOR: BETTER_AUTH v1.0
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-500">
                                    <span>INTEGRITY_SHIELD: 100%</span>
                                    <span>•</span>
                                    <span>SYS_VERIFIED</span>
                                  </div>
                                </div>
                             </div>
                           </div>
                        </div>

                        <div className="pt-12 border-t border-white/5 space-y-6">
                           <div className="relative p-[1.5px] cyber-notch bg-gradient-to-r from-red-500/30 to-red-950/10 overflow-hidden group/del">
                             {/* Animated sweeping red laser scan line */}
                             <div className="absolute inset-x-0 h-[1.5px] bg-red-500 opacity-30 shadow-[0_0_12px_#ef4444] animate-laser-sweep z-10 pointer-events-none" style={{ '--laser-color': '#ef4444' } as React.CSSProperties} />
                             
                             <div className="p-8 md:p-10 bg-zinc-950/90 cyber-notch flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
                               {/* Moving Hazard stripes sliding background at the top */}
                               <div className="absolute top-0 inset-x-0 h-1 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,#450a0a_10px,#450a0a_20px)] animate-hazard-sweep pointer-events-none" />

                               {/* Custom Red HUD Corner Anchors */}
                               <div className="absolute top-3 left-3 size-3 border-t border-l border-red-500/50 pointer-events-none" />
                               <div className="absolute top-3 right-3 size-3 border-t border-r border-red-500/50 pointer-events-none" />
                               <div className="absolute bottom-3 left-3 size-3 border-b border-l border-red-500/50 pointer-events-none" />
                               <div className="absolute bottom-3 right-3 size-3 border-b border-r border-red-500/50 pointer-events-none" />

                               {/* Grid overlay */}
                               <div className="absolute inset-0 cyber-grid-red pointer-events-none opacity-20" />
                               
                               <div className="space-y-4 text-center sm:text-left relative z-10 flex-1">
                                 {/* Top hazard strip */}
                                 <div className="hazard-header-strip animate-pulse h-2 w-48 rounded-full mb-3" />
                                 
                                 <div className="flex items-center gap-2 justify-center sm:justify-start">
                                   <div className="size-1.5 rounded-full bg-red-500 animate-ping" />
                                   <h3 className="text-base font-black text-red-500 uppercase tracking-wider italic">
                                     {"Destruction du Profil // ZONE_DANGER"}
                                   </h3>
                                 </div>
                                 
                                 <p className="text-xs text-zinc-400 max-w-sm font-light leading-relaxed">
                                   Supprime définitivement ton dossier, tes habilitations et toute ta progression de build. Cette action est irréversible et effacera ton signal du réseau.
                                 </p>

                                 {/* Interactive Meltdown Alert Banner */}
                                 <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-xl flex items-start gap-3 relative z-10 w-full mt-4">
                                   <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                                   <div className="space-y-1 font-mono text-[9px] text-left">
                                     <div className="text-red-400 font-black uppercase tracking-wider flex items-center gap-2">
                                       <span className="size-1 bg-red-500 rounded-full animate-ping" /> CRITICAL SYS_MELTDOWN LEVEL A-1
                                     </div>
                                     <div className="text-zinc-500 leading-normal">
                                       WARNING: PROCEEDING WILL INSTANTLY VOID YOUR PROFILE, EVOLUTION SCORE, DRIFT TRACKS AND COMMUNITY PERMISSIONS. SYSTEM STATE CANNOT BE REVERTED.
                                     </div>
                                   </div>
                                 </div>
                               </div>
                               
                               {/* Tactical self-destruct button */}
                               <div className="relative p-[1.5px] cyber-notch-sm transition-all duration-300 hover:scale-[1.02] shrink-0 z-10">
                                 <Button
                                   variant="destructive"
                                   className="h-14 font-mono font-black px-8 text-[10px] uppercase transition-all duration-300 cyber-notch-sm bg-red-950/80 border border-red-500 text-red-400 hover:bg-red-500 hover:text-black shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] cursor-pointer"
                                   onClick={async () => {
                                     if (!confirm("Supprimer ton profil HASHCODE ? Toutes tes données seront effacées du réseauneuronal.")) return;
                                     const res = await fetch("/api/user/delete", { method: "DELETE" });
                                     if (res.ok) {
                                       await authClient.signOut();
                                       window.location.href = "/";
                                     } else {
                                       toast.error("Erreur lors de la désactivation");
                                     }
                                   }}
                                 >
                                   DÉSACTIVER_PROFIL
                                 </Button>
                               </div>
                             </div>
                           </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )
          })()}
            </div>
          </div>
        </main>

        {/* Interactive Biometric Fingerprint Scanner Modal */}
        <AnimatePresence>
          {isBiometricModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-full max-w-xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] relative flex flex-col md:min-h-[500px]"
              >
                {/* Scanlines & Grid background for that game terminal feel */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none opacity-40" />
                <div className="scanline opacity-10 pointer-events-none" />

                {/* Corner decorative brackets */}
                <div className="absolute top-6 left-6 w-5 h-5 border-t-2 border-l-2 border-primary/40 pointer-events-none" />
                <div className="absolute top-6 right-6 w-5 h-5 border-t-2 border-r-2 border-primary/40 pointer-events-none" />
                <div className="absolute bottom-6 left-6 w-5 h-5 border-b-2 border-l-2 border-primary/40 pointer-events-none" />
                <div className="absolute bottom-6 right-6 w-5 h-5 border-b-2 border-r-2 border-primary/40 pointer-events-none" />

                {/* Modal Header */}
                <div className="p-8 pb-4 border-b border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 border border-primary/20 rounded-xl text-primary animate-pulse">
                      <Fingerprint className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-primary animate-ping" />
                        <span className="text-[7.5px] font-mono text-primary font-black uppercase">SECURE_NODE: KEY_GEN_v2</span>
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-white italic">
                        Scanneur d&apos;Empreintes Biométriques
                      </h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsBiometricModalOpen(false)}
                    disabled={biometricState === "SCANNING" || biometricState === "DECRYPTING" || biometricState === "SECURING"}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal body containing the scanner and terminal */}
                <div className="p-8 flex-1 flex flex-col md:grid md:grid-cols-2 gap-8 items-center relative z-10">
                  {/* Left Column: Interactive scanner pad */}
                  <div className="w-full flex flex-col items-center gap-4 text-center">
                    <div className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-wider">
                      CAPTEUR BIOMÉTRIQUE CAPACITIF
                    </div>

                    <button
                      type="button"
                      disabled={biometricState !== "STANDBY" && biometricState !== "FAILED"}
                      onClick={triggerBiometricScan}
                      className={cn(
                        "size-32 rounded-full border-2 transition-all duration-500 relative flex items-center justify-center overflow-hidden active:scale-95 group/scanner-pad",
                        biometricState === "STANDBY" ? "bg-zinc-950 border-primary/20 hover:border-primary/50 cursor-pointer shadow-[0_0_20px_rgba(184,255,59,0.02)]" :
                        biometricState === "SCANNING" ? "bg-amber-950/20 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.2)] cursor-wait" :
                        biometricState === "DECRYPTING" ? "bg-cyan-950/20 border-cyan-500/50 shadow-[0_0_40px_rgba(6,182,212,0.2)] cursor-wait" :
                        biometricState === "SECURING" ? "bg-purple-950/20 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.2)] cursor-wait" :
                        biometricState === "SUCCESS" ? "bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_50px_rgba(16,185,129,0.3)] cursor-default" :
                        "bg-rose-950/30 border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.2)] cursor-pointer"
                      )}
                    >
                      {/* Flashing scanner grid */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.8))]" />

                      {/* Moving laser sweep line */}
                      {(biometricState === "SCANNING" || biometricState === "DECRYPTING" || biometricState === "SECURING") && (
                        <motion.div
                          animate={{ y: ['-10%', '110%', '-10%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                          className={cn(
                            "absolute left-0 right-0 h-1 z-20 shadow-lg",
                            biometricState === "SCANNING" ? "bg-amber-500 shadow-amber-500/50" :
                            biometricState === "DECRYPTING" ? "bg-cyan-500 shadow-cyan-500/50" :
                            "bg-purple-500 shadow-purple-500/50"
                          )}
                        />
                      )}

                      {/* Concentric rotating radar sweeps */}
                      {biometricState !== "STANDBY" && biometricState !== "SUCCESS" && biometricState !== "FAILED" && (
                        <div className="absolute inset-2 border border-white/5 rounded-full animate-spin animate-duration-3000 border-dashed" />
                      )}

                      {/* Fingerprint icon */}
                      <Fingerprint
                        className={cn(
                          "size-16 transition-all duration-700 relative z-10",
                          biometricState === "STANDBY" ? "text-primary/40 group-hover/scanner-pad:text-primary group-hover/scanner-pad:scale-105" :
                          biometricState === "SCANNING" ? "text-amber-500 animate-pulse" :
                          biometricState === "DECRYPTING" ? "text-cyan-400" :
                          biometricState === "SECURING" ? "text-purple-400 animate-pulse" :
                          biometricState === "SUCCESS" ? "text-emerald-400 scale-105" :
                          "text-rose-500"
                        )}
                      />
                    </button>

                    <div className="space-y-1">
                      <span className={cn(
                        "text-[10px] font-mono font-black uppercase tracking-wider",
                        biometricState === "STANDBY" ? "text-primary" :
                        biometricState === "SCANNING" ? "text-amber-500" :
                        biometricState === "DECRYPTING" ? "text-cyan-400" :
                        biometricState === "SECURING" ? "text-purple-400 animate-pulse" :
                        biometricState === "SUCCESS" ? "text-emerald-400" :
                        "text-rose-500"
                      )}>
                        {biometricState === "STANDBY" && "PRET POUR LE BALAYAGE"}
                        {biometricState === "SCANNING" && "NUMÉRISATION..."}
                        {biometricState === "DECRYPTING" && "DÉCHIFFREMENT DATA..."}
                        {biometricState === "SECURING" && "SÉCURISATION NODE..."}
                        {biometricState === "SUCCESS" && "DÉVERROUILLAGE RÉUSSI"}
                        {biometricState === "FAILED" && "NUMÉRISATION ÉCHOUÉE"}
                      </span>
                      <p className="text-[9px] text-zinc-500 font-light max-w-[200px] leading-relaxed">
                        {biometricState === "STANDBY" && "Place ton empreinte sur le capteur pour démarrer l'analyse de sécurité."}
                        {biometricState === "SCANNING" && "Garde le doigt immobile pendant que nous capturons les coordonnées."}
                        {biometricState === "DECRYPTING" && "Génération de l'entropie et synchronisation avec la blockchain."}
                        {biometricState === "SECURING" && "Enregistrement de la clé dans le coffre-fort hautement sécurisé."}
                        {biometricState === "SUCCESS" && "Ta clé a été scellée dans le coffre. Tu peux copier le mot de passe."}
                        {biometricState === "FAILED" && "La transaction a échoué. Veuillez réessayer."}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Cybernetic Console Terminal Logs */}
                  <div className="w-full h-[220px] md:h-[260px] bg-black/60 border border-white/5 rounded-2xl p-4 font-mono text-[9px] text-zinc-400 flex flex-col justify-between overflow-hidden shadow-inner relative group/terminal">
                    {/* Glowing scanning laser matrix background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.005)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                    
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 shrink-0">
                      <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-wide flex items-center gap-1.5">
                        <Terminal className="size-3 text-zinc-500" /> CONSOLE_LOGGER
                      </span>
                      <span className="text-[7.5px] text-zinc-600">STABLE</span>
                    </div>

                    {/* Scrollable logs screen */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 py-3 pr-1 text-left font-mono scrollbar-none">
                      {biometricLogs.map((log, idx) => {
                        const isError = log.includes("[ERROR]")
                        const isSuccess = log.includes("[SUCCESS]") || log.includes("[OK]")
                        return (
                          <div 
                            key={idx} 
                            className={cn(
                              "leading-relaxed select-none",
                              isError ? "text-rose-500 font-bold" :
                              isSuccess ? "text-emerald-400 font-bold" :
                              log.startsWith("[SCAN]") ? "text-amber-500" : "text-zinc-400"
                            )}
                          >
                            {log}
                          </div>
                        )
                      })}
                      {/* Blinking cyber cursor */}
                      {(biometricState === "SCANNING" || biometricState === "DECRYPTING" || biometricState === "SECURING") && (
                        <div className="inline-block size-1.5 bg-primary animate-pulse ml-0.5" />
                      )}
                    </div>

                    <div className="border-t border-white/5 pt-2 text-zinc-600 flex justify-between items-center text-[7px] shrink-0">
                      <span>SECURE TRANSACTION</span>
                      <span>100% SECURE SHA-256</span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="p-8 pt-4 border-t border-white/5 flex gap-4 justify-end relative z-10">
                  {biometricState === "STANDBY" && (
                    <Button
                      onClick={triggerBiometricScan}
                      className="btn-primary-glow h-11 px-8 rounded-xl text-[10px] uppercase font-black tracking-wider"
                    >
                      Démarrer_Balayage
                    </Button>
                  )}
                  {biometricState === "FAILED" && (
                    <Button
                      onClick={triggerBiometricScan}
                      className="btn-primary-glow h-11 px-8 rounded-xl text-[10px] uppercase font-black tracking-wider"
                    >
                      Réessayer_Balayage
                    </Button>
                  )}
                  {(biometricState === "SUCCESS" || biometricState === "FAILED" || biometricState === "STANDBY") && (
                    <Button
                      onClick={() => setIsBiometricModalOpen(false)}
                      className="h-11 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase font-black tracking-wider text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      Fermer_Terminal
                    </Button>
                  )}
                  {(biometricState === "SCANNING" || biometricState === "DECRYPTING" || biometricState === "SECURING") && (
                    <div className="flex items-center gap-2 text-zinc-500 font-mono text-[9px] uppercase font-bold pr-2">
                      <Loader2 className="size-3 animate-spin text-amber-500" /> Numérisation_Sécurisée_En_Cours...
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  )
}
