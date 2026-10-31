import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  kicker?: string
  title: string
  description?: string
  align?: "left" | "center"
  level?: 1 | 2
  className?: string
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = "left",
  level = 2,
  className,
}: SectionHeadingProps) {
  const HeadingTag = level === 1 ? "h1" : "h2"

  return (
    <div className={cn("max-w-2xl space-y-3", align === "center" && "mx-auto text-center", className)}>
      {kicker && (
        <p className="text-xs font-bold uppercase tracking-widest text-primary">{kicker}</p>
      )}
      <HeadingTag className="font-syne text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </HeadingTag>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
