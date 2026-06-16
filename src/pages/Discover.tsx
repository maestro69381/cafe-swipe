import { useEffect } from "react"
import Callout from "@/components/Callout"
import SwipeControls from "@/components/SwipeControls"
import SwipeDeck from "@/components/SwipeDeck"
import { useCafeSwipeStore } from "@/store/useCafeSwipeStore"

export default function Discover() {
  const status = useCafeSwipeStore((s) => s.status)
  const error = useCafeSwipeStore((s) => s.error)
  const position = useCafeSwipeStore((s) => s.position)
  const cafes = useCafeSwipeStore((s) => s.cafes)
  const index = useCafeSwipeStore((s) => s.index)
  const lastAction = useCafeSwipeStore((s) => s.lastAction)
  const radiusKm = useCafeSwipeStore((s) => s.settings.radiusKm)
  const wifi = useCafeSwipeStore((s) => s.settings.filters.wifi)

  const requestLocation = useCafeSwipeStore((s) => s.requestLocation)
  const loadCafes = useCafeSwipeStore((s) => s.loadCafes)
  const like = useCafeSwipeStore((s) => s.like)
  const dislike = useCafeSwipeStore((s) => s.dislike)
  const undo = useCafeSwipeStore((s) => s.undo)

  useEffect(() => {
    if (!position) return
    loadCafes()
  }, [position, radiusKm, wifi, loadCafes])

  const currentCafe = cafes[index] ?? null
  const nextCafe = cafes[index + 1] ?? null
  const canSwipe = status === "ready" && Boolean(currentCafe)
  const canUndo = Boolean(lastAction)

  return (
    <div className="space-y-4">
      {!position ? (
        <Callout title="Bật vị trí để quẹt quán gần bạn">
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={async () => {
                await requestLocation()
                await loadCafes()
              }}
              className="rounded-2xl bg-[hsl(var(--sun-1))] px-4 py-3 text-sm font-semibold text-[hsl(var(--coffee))] shadow-[0_18px_44px_hsl(var(--sun-1)/0.4)] transition hover:brightness-[1.03] active:scale-[0.99]"
            >
              Cho phép vị trí
            </button>
            <div className="text-xs text-black/55">
              Chỉ dùng để tìm quán trong {radiusKm}km.
            </div>
          </div>
        </Callout>
      ) : null}

      {error ? <Callout title="Gợi ý" tone="coffee">{error}</Callout> : null}

      <div className="flex items-end justify-between gap-3">
        <div className="text-sm font-semibold text-black/70">
          Bán kính: <span className="text-black/90">{radiusKm}km</span>
          {wifi ? <span className="ml-2 rounded-full bg-black/5 px-2 py-1 text-xs font-semibold">Wi‑Fi</span> : null}
        </div>
        <div className="text-xs text-black/55">
          {cafes.length ? (
            <span>
              {Math.min(index + 1, cafes.length)}/{cafes.length}
            </span>
          ) : (
            <span>0/0</span>
          )}
        </div>
      </div>

      {status === "loading" || status === "locating" ? (
        <div className="mx-auto w-full max-w-[420px]">
          <div className="aspect-[3/4] w-full animate-pulse rounded-[26px] border border-black/10 bg-white/60" />
        </div>
      ) : (
        <SwipeDeck cafe={currentCafe} nextCafe={nextCafe} onLike={like} onDislike={dislike} />
      )}

      <SwipeControls
        canSwipe={canSwipe}
        canUndo={canUndo}
        onDislike={dislike}
        onLike={like}
        onUndo={undo}
        onReload={loadCafes}
      />
    </div>
  )
}

