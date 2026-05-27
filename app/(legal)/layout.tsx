import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-600 hover:text-primary transition-colors mb-12 group"
        >
          <ChevronLeft className="size-3.5 group-hover:-translate-x-1 transition-transform" />
          HASHCODE
        </Link>
        {children}
      </div>
    </div>
  )
}
