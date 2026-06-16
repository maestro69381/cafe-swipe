import { Heart, RefreshCcw, Undo2, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  canSwipe: boolean
  canUndo: boolean
  onDislike: () => void
  onLike: () => void
  onUndo: () => void
  onReload: () => void
}

export default function SwipeControls({ canSwipe, canUndo, onDislike, onLike, onUndo, onReload }: Props) {
  return (
    <div className="mx-auto mt-5 flex w-full max-w-[420px] items-center justify-center gap-3">
      <button
        type="button"
        onClick={onUndo}
        disabled={!canUndo}
        className={cn(
          "grid size-12 place-items-center rounded-2xl border border-black/10 bg-white/70 text-black/70 shadow-sm transition active:scale-[0.99]",
          canUndo ? "hover:bg-white" : "opacity-40"
        )}
        aria-label="Hoàn tác"
      >
        <Undo2 className="size-5" />
      </button>

      <button
        type="button"
        onClick={onDislike}
        disabled={!canSwipe}
        className={cn(
          "grid size-14 place-items-center rounded-3xl border border-black/10 bg-white/70 text-[hsl(var(--coffee))] shadow-[0_16px_38px_rgba(0,0,0,0.15)] transition active:scale-[0.99]",
          canSwipe ? "hover:bg-white" : "opacity-40"
        )}
        aria-label="Bỏ qua"
      >
        <X className="size-6" />
      </button>

      <button
        type="button"
        onClick={onLike}
        disabled={!canSwipe}
        className={cn(
          "grid size-14 place-items-center rounded-3xl border border-black/10 bg-[hsl(var(--sun-1))] text-[hsl(var(--coffee))] shadow-[0_18px_46px_hsl(var(--sun-1)/0.45)] transition active:scale-[0.99]",
          canSwipe ? "hover:brightness-[1.03]" : "opacity-40"
        )}
        aria-label="Thích"
      >
        <Heart className="size-6" />
      </button>

      <button
        type="button"
        onClick={onReload}
        className="grid size-12 place-items-center rounded-2xl border border-black/10 bg-white/70 text-black/70 shadow-sm transition hover:bg-white active:scale-[0.99]"
        aria-label="Tải lại"
      >
        <RefreshCcw className="size-5" />
      </button>
    </div>
  )
}

