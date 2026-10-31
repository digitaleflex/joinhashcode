import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-light min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="pt-14">{children}</div>
      <SiteFooter />
    </div>
  )
}
