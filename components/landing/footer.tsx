import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Logo & Vision */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <div className="relative">
                <Image
                  src="/hashcodejoin.png"
                  alt="HASHCODE"
                  width={140}
                  height={36}
                  className="h-7 w-auto object-contain brightness-75 group-hover:brightness-100 transition-all"
                />
              </div>
            </Link>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-xs">
              Le premier écosystème de profilage neuronal dédié aux bâtisseurs de la nouvelle ère technologique.
            </p>
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-emerald-500/50 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[9px] font-mono font-bold text-zinc-600 uppercase tracking-tighter">système_opérationnel_v1.1</span>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-zinc-700 uppercase tracking-widest">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/quiz" className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors">Lancer le quiz</Link></li>
                <li><Link href="/signin" className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors">Accès membre</Link></li>
                <li><Link href="/missions" className="text-xs font-bold text-zinc-500 hover:text-primary transition-colors">Catalogue missions</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-zinc-700 uppercase tracking-widest">Protocoles</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link href="/terms" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Conditions</Link></li>
                <li><Link href="/legal" className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Mentions légales</Link></li>
              </ul>
            </div>
          </div>

          {/* Technical Info / CTA */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-primary font-black uppercase">node_location_</span>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-tight">Afrique & Diaspora Connectée</p>
            </div>
            <div className="h-px bg-white/5" />
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono text-zinc-600 font-bold">build: 2026.05.19</span>
              <span className="text-[9px] font-mono text-zinc-600 font-bold">hash: AF-772-X</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-mono font-bold text-zinc-600 tracking-tight">
            © 2026 HASHCODE // LE PROGRAMME DE LA NOUVELLE ÈRE
          </p>
          <div className="flex items-center gap-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
             {/* Social placeholders could go here */}
          </div>
        </div>
      </div>
    </footer>
  )
}
