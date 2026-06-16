import { Heart, SlidersHorizontal, Sparkles } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const items = [
  { to: "/discover", label: "Quẹt", Icon: Sparkles },
  { to: "/likes", label: "Đã thích", Icon: Heart },
  { to: "/settings", label: "Thiết lập", Icon: SlidersHorizontal },
] as const

export default function BottomNav() {
  const location = useLocation()

  return (
    <div className="border-t border-black/10 bg-white/70 px-2 py-2">
      <div className="grid grid-cols-3 gap-2">
        {items.map(({ to, label, Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold transition",
                active
                  ? "bg-[hsl(var(--sun-1))] text-[hsl(var(--coffee))] shadow-[0_16px_34px_hsl(var(--sun-1)/0.35)]"
                  : "text-black/70 hover:bg-black/5"
              )}
            >
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

