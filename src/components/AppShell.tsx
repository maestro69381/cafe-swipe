import { useEffect } from "react"
import { Outlet } from "react-router-dom"
import BottomNav from "@/components/BottomNav"
import PhoneFrame from "@/components/PhoneFrame"
import TopBar from "@/components/TopBar"
import { useCafeSwipeStore } from "@/store/useCafeSwipeStore"

export default function AppShell() {
  const hydrate = useCafeSwipeStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <PhoneFrame>
      <div className="flex min-h-[720px] flex-col">
        <TopBar />
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-4 py-4">
            <Outlet />
          </div>
        </div>
        <BottomNav />
      </div>
    </PhoneFrame>
  )
}

