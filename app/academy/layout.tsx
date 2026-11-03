import { SiteNav } from "@/components/site/site-nav"
import { SiteFooter } from "@/components/site/site-footer"

/**
 * Academy shell.
 *
 * Every /academy route (public catalogue and member-only pages) previously
 * rendered without any navigation. The public site shell is reused so the
 * academy keeps the same navbar, identity and footer as the rest of the site.
 */
export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="site-light min-h-screen bg-background text-foreground">
      <SiteNav />
      <div className="pt-16">{children}</div>
      <SiteFooter />
    </div>
  )
}
