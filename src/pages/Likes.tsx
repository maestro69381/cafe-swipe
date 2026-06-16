import { ExternalLink, HeartOff, MapPinned } from "lucide-react"
import Callout from "@/components/Callout"
import { cn } from "@/lib/utils"
import { useCafeSwipeStore } from "@/store/useCafeSwipeStore"

export default function Likes() {
  const likes = useCafeSwipeStore((s) => s.likes)
  const removeLike = useCafeSwipeStore((s) => s.removeLike)

  if (!likes.length) {
    return <Callout title="Chưa có quán nào trong Đã thích">Quẹt phải vài quán, danh sách sẽ nằm ở đây.</Callout>
  }

  return (
    <div className="space-y-3">
      {likes
        .slice()
        .reverse()
        .map((cafe) => (
          <div key={cafe.id} className="rounded-[22px] border border-black/10 bg-white/70 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-display text-lg font-bold leading-tight">{cafe.name}</div>
                <div className="mt-1 text-sm text-black/60">
                  {cafe.distanceKm.toFixed(2)} km{cafe.address ? ` • ${cafe.address}` : ""}
                </div>
              </div>

              <a
                href={mapUrl(cafe.location.lat, cafe.location.lon)}
                target="_blank"
                rel="noreferrer"
                className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[hsl(var(--sun-1))] text-[hsl(var(--coffee))] shadow-[0_16px_34px_hsl(var(--sun-1)/0.35)] transition hover:brightness-[1.03] active:scale-[0.99]"
                aria-label="Mở bản đồ"
              >
                <MapPinned className="size-5" />
              </a>
            </div>

            {cafe.tags.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {cafe.tags.slice(0, 6).map((t) => (
                  <span key={t} className="rounded-full bg-black/5 px-3 py-1 text-xs font-semibold text-black/70">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={mapUrl(cafe.location.lat, cafe.location.lon)}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5"
                )}
              >
                <ExternalLink className="size-4" />
                <span>Mở bản đồ</span>
              </a>

              <button
                type="button"
                onClick={() => removeLike(cafe.id)}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5"
              >
                <HeartOff className="size-4" />
                <span>Bỏ thích</span>
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

function mapUrl(lat: number, lon: number) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lon}`)}`
}

