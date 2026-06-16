import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Cafe } from "@/types"

export default function CafeCard({ cafe, className }: { cafe: Cafe; className?: string }) {
  const bg = gradientFor(cafe.id)

  return (
    <div className={cn("relative h-full w-full overflow-hidden rounded-[26px] border border-black/10 bg-white shadow-[0_22px_60px_rgba(0,0,0,0.18)]", className)}>
      <div className="absolute inset-0 opacity-95" style={{ backgroundImage: bg }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-black/80 backdrop-blur">
            <MapPin className="size-4 text-[hsl(var(--mint))]" />
            <span>{cafe.distanceKm.toFixed(2)} km</span>
          </div>

          <div className="rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-black/80 backdrop-blur">
            {cafe.source === "mock" ? "Offline" : "Gần bạn"}
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-display text-[28px] font-bold leading-[1.05] tracking-tight text-white drop-shadow">
            {cafe.name}
          </div>
          {cafe.address ? <div className="text-sm text-white/90">{cafe.address}</div> : null}

          {cafe.tags.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {cafe.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function gradientFor(seed: string) {
  const h1 = hashHue(seed)
  const h2 = (h1 + 38) % 360
  const h3 = (h1 + 110) % 360
  return `radial-gradient(900px 600px at 10% 10%, hsl(${h1} 95% 72% / 0.95), transparent 60%),
radial-gradient(700px 520px at 90% 20%, hsl(${h2} 95% 70% / 0.9), transparent 55%),
radial-gradient(720px 600px at 50% 100%, hsl(${h3} 70% 55% / 0.85), transparent 62%),
linear-gradient(135deg, hsl(44 100% 70% / 0.55), hsl(22 55% 18% / 0.35))`
}

function hashHue(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) % 360
  }
  return h
}

