import { animate, motion, useMotionValue, useTransform } from "framer-motion"
import CafeCard from "@/components/CafeCard"
import type { Cafe } from "@/types"

export default function SwipeDeck({
  cafe,
  nextCafe,
  onLike,
  onDislike,
}: {
  cafe: Cafe | null
  nextCafe: Cafe | null
  onLike: () => void
  onDislike: () => void
}) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-220, 0, 220], [-10, 0, 10])
  const likeOpacity = useTransform(x, [40, 130], [0, 1])
  const nopeOpacity = useTransform(x, [-130, -40], [1, 0])

  const handleReset = async () => {
    await animate(x, 0, { type: "spring", stiffness: 520, damping: 42 })
  }

  const handleDragEnd = async () => {
    const v = x.get()
    if (v > 140) {
      await animate(x, 460, { type: "spring", stiffness: 520, damping: 36 })
      onLike()
      x.set(0)
      return
    }
    if (v < -140) {
      await animate(x, -460, { type: "spring", stiffness: 520, damping: 36 })
      onDislike()
      x.set(0)
      return
    }
    await handleReset()
  }

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="relative aspect-[3/4] w-full">
        {nextCafe ? (
          <div className="absolute inset-0 translate-y-3 scale-[0.97]">
            <CafeCard cafe={nextCafe} className="opacity-85" />
          </div>
        ) : null}

        {cafe ? (
          <motion.div
            className="absolute inset-0"
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.14}
            onDragEnd={handleDragEnd}
            whileTap={{ scale: 0.995 }}
          >
            <CafeCard cafe={cafe} />

            <motion.div
              className="pointer-events-none absolute left-4 top-4 rotate-[-14deg] rounded-2xl border-2 border-white/70 bg-[hsl(var(--mint)/0.25)] px-4 py-2 font-display text-lg font-extrabold tracking-wide text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur"
              style={{ opacity: likeOpacity }}
            >
              THÍCH
            </motion.div>

            <motion.div
              className="pointer-events-none absolute right-4 top-4 rotate-[14deg] rounded-2xl border-2 border-white/70 bg-[hsl(var(--coffee)/0.22)] px-4 py-2 font-display text-lg font-extrabold tracking-wide text-white shadow-[0_18px_40px_rgba(0,0,0,0.22)] backdrop-blur"
              style={{ opacity: nopeOpacity }}
            >
              BỎ QUA
            </motion.div>
          </motion.div>
        ) : (
          <div className="grid h-full place-items-center rounded-[26px] border border-black/10 bg-white/60 px-6 text-center">
            <div>
              <div className="font-display text-2xl font-bold tracking-tight">Hết thẻ rồi</div>
              <div className="mt-2 text-sm text-black/60">Bấm tải lại để xem thêm quán gần bạn.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

