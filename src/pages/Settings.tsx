import { LocateFixed, RotateCcw, SlidersHorizontal, Wifi } from "lucide-react"
import Callout from "@/components/Callout"
import { cn } from "@/lib/utils"
import { useCafeSwipeStore } from "@/store/useCafeSwipeStore"

export default function Settings() {
  const status = useCafeSwipeStore((s) => s.status)
  const position = useCafeSwipeStore((s) => s.position)
  const radiusKm = useCafeSwipeStore((s) => s.settings.radiusKm)
  const wifi = useCafeSwipeStore((s) => s.settings.filters.wifi)

  const requestLocation = useCafeSwipeStore((s) => s.requestLocation)
  const setRadiusKm = useCafeSwipeStore((s) => s.setRadiusKm)
  const toggleWifiFilter = useCafeSwipeStore((s) => s.toggleWifiFilter)
  const resetHistory = useCafeSwipeStore((s) => s.resetHistory)

  return (
    <div className="space-y-4">
      <Callout title="Vị trí">
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={requestLocation}
            className={cn(
              "inline-flex items-center gap-2 rounded-2xl bg-[hsl(var(--sun-1))] px-4 py-3 text-sm font-semibold text-[hsl(var(--coffee))] shadow-[0_18px_44px_hsl(var(--sun-1)/0.4)] transition hover:brightness-[1.03] active:scale-[0.99]",
              status === "locating" && "opacity-60"
            )}
          >
            <LocateFixed className="size-4" />
            <span>{position ? "Lấy lại vị trí" : "Cho phép vị trí"}</span>
          </button>

          <div className="text-sm text-black/60">
            {position ? (
              <span>
                {roundCoord(position.lat)}, {roundCoord(position.lon)}
              </span>
            ) : (
              <span>Chưa có vị trí.</span>
            )}
          </div>
        </div>
      </Callout>

      <div className="rounded-[22px] border border-black/10 bg-white/70 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="grid size-10 place-items-center rounded-2xl bg-black/5 text-black/70">
              <SlidersHorizontal className="size-5" />
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-tight">Bán kính</div>
              <div className="text-sm text-black/60">Mặc định 5km, chọn 1–5km.</div>
            </div>
          </div>
          <div className="rounded-full bg-[hsl(var(--sun-1))] px-3 py-1 text-sm font-bold text-[hsl(var(--coffee))]">
            {radiusKm}km
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={radiusKm}
          onChange={(e) => setRadiusKm(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)}
          className="mt-4 w-full accent-[hsl(var(--sun-1))]"
        />
      </div>

      <div className="rounded-[22px] border border-black/10 bg-white/70 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="grid size-10 place-items-center rounded-2xl bg-black/5 text-black/70">
              <Wifi className="size-5" />
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-tight">Lọc</div>
              <div className="text-sm text-black/60">Chỉ hiện quán có Wi‑Fi (nếu có dữ liệu).</div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleWifiFilter}
            className={cn(
              "rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition",
              wifi ? "bg-[hsl(var(--mint))] text-white shadow-[0_14px_34px_hsl(var(--mint)/0.25)]" : "bg-white text-black/70 hover:bg-black/5"
            )}
          >
            {wifi ? "Đang bật" : "Đang tắt"}
          </button>
        </div>
      </div>

      <div className="rounded-[22px] border border-black/10 bg-white/70 p-4 shadow-[0_14px_40px_rgba(0,0,0,0.10)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-display text-lg font-bold tracking-tight">Dữ liệu</div>
            <div className="text-sm text-black/60">Xóa danh sách đã thích và lịch sử bỏ qua.</div>
          </div>
          <button
            type="button"
            onClick={resetHistory}
            className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black/70 transition hover:bg-black/5"
          >
            <RotateCcw className="size-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function roundCoord(v: number) {
  return Math.round(v * 10000) / 10000
}

