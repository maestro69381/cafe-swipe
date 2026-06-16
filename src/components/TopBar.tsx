import { Coffee, MapPin } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useCafeSwipeStore } from "@/store/useCafeSwipeStore"

export default function TopBar() {
  const location = useLocation()
  const radiusKm = useCafeSwipeStore((s) => s.settings.radiusKm)
  const hasPosition = useCafeSwipeStore((s) => Boolean(s.position))

  return (
    <div className="flex items-center justify-between gap-3 border-b border-black/10 bg-white/70 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="grid size-10 place-items-center rounded-2xl bg-[hsl(var(--sun-1))] text-[hsl(var(--coffee))] shadow-[0_10px_24px_hsl(var(--sun-1)/0.35)]">
          <Coffee className="size-5" />
        </div>
        <div className="leading-tight">
          <div className="font-display text-[18px] font-bold tracking-tight">CafeSwipe</div>
          <div className="text-xs text-black/55">Quẹt quán trong {radiusKm}km</div>
        </div>
      </div>

      <Link
        to="/settings"
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-2 text-xs font-semibold text-black/80 transition hover:bg-white",
          location.pathname === "/settings" && "border-black/20 bg-white"
        )}
      >
        <MapPin className={cn("size-4", hasPosition ? "text-[hsl(var(--mint))]" : "text-black/35")} />
        <span>{hasPosition ? "Đang gần bạn" : "Cần vị trí"}</span>
      </Link>
    </div>
  )
}

