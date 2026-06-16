import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export default function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="min-h-full px-4 py-10">
      <div
        className={cn(
          "mx-auto w-full max-w-[460px] overflow-hidden rounded-[28px] border border-black/10 bg-white/70 shadow-[0_24px_70px_rgba(0,0,0,0.20)] backdrop-blur",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

