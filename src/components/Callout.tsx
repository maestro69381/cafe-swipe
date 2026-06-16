import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export default function Callout({
  title,
  children,
  tone = "sun",
}: {
  title: string
  children?: ReactNode
  tone?: "sun" | "coffee"
}) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-black/10 px-4 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.10)]",
        tone === "sun" ? "bg-white/75" : "bg-white/70"
      )}
    >
      <div className={cn("font-display text-xl font-bold tracking-tight", tone === "sun" ? "text-black/90" : "text-black/85")}>
        {title}
      </div>
      {children ? <div className="mt-2 text-sm leading-relaxed text-black/65">{children}</div> : null}
    </div>
  )
}

