import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  kicker?: string
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeading({ kicker, title, description, align = "left", className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto text-center", className)}>
      {kicker && (
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{kicker}</p>
      )}
      <h2 className="font-syne text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
