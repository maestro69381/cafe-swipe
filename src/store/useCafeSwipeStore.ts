import { create } from "zustand"
import type { Cafe, GeoPoint, UserSettings } from "@/types"
import { createMockCafes } from "@/utils/mockCafes"
import { fetchCafesNear } from "@/utils/overpass"

type LoadStatus = "idle" | "locating" | "loading" | "ready" | "error"

type LastAction =
  | {
      kind: "like" | "dislike"
      cafe: Cafe
    }
  | null

type CafeSwipeState = {
  status: LoadStatus
  error: string | null

  position: GeoPoint | null
  cafes: Cafe[]
  index: number

  likes: Cafe[]
  dislikes: string[]
  lastAction: LastAction

  settings: UserSettings

  hydrate: () => void
  requestLocation: () => Promise<void>
  loadCafes: () => Promise<void>
  like: () => void
  dislike: () => void
  undo: () => void
  resetHistory: () => void
  setRadiusKm: (radiusKm: UserSettings["radiusKm"]) => void
  toggleWifiFilter: () => void
  removeLike: (id: string) => void
}

const LS_KEYS = {
  settings: "cafeswipe.settings",
  likes: "cafeswipe.likes",
  dislikes: "cafeswipe.dislikes",
} as const

const DEFAULT_SETTINGS: UserSettings = {
  radiusKm: 5,
  filters: {
    wifi: false,
  },
}

export const useCafeSwipeStore = create<CafeSwipeState>((set, get) => ({
  status: "idle",
  error: null,

  position: null,
  cafes: [],
  index: 0,

  likes: [],
  dislikes: [],
  lastAction: null,

  settings: DEFAULT_SETTINGS,

  hydrate: () => {
    const settings = safeJsonParse<UserSettings>(localStorage.getItem(LS_KEYS.settings)) ?? DEFAULT_SETTINGS
    const likes = safeJsonParse<Cafe[]>(localStorage.getItem(LS_KEYS.likes)) ?? []
    const dislikes = safeJsonParse<string[]>(localStorage.getItem(LS_KEYS.dislikes)) ?? []

    set({
      settings: normalizeSettings(settings),
      likes: Array.isArray(likes) ? likes : [],
      dislikes: Array.isArray(dislikes) ? dislikes : [],
    })
  },

  requestLocation: async () => {
    set({ status: "locating", error: null })

    if (!navigator.geolocation) {
      set({ status: "error", error: "Trình duyệt không hỗ trợ định vị." })
      return
    }

    const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        maximumAge: 60_000,
        timeout: 12_000,
      })
    }).catch((e: unknown) => {
      const message =
        e && typeof e === "object" && "message" in e && typeof e.message === "string" ? e.message : "Không lấy được vị trí."
      set({ status: "error", error: message })
      return null
    })

    if (!pos) return

    set({
      position: { lat: pos.coords.latitude, lon: pos.coords.longitude },
      status: "idle",
      error: null,
    })
  },

  loadCafes: async () => {
    const { position, settings } = get()
    if (!position) return

    set({ status: "loading", error: null, cafes: [], index: 0, lastAction: null })

    const blockedIds = new Set<string>([...get().likes.map((l) => l.id), ...get().dislikes])

    try {
      const cafes = await fetchCafesNear(position, settings.radiusKm)
      const filtered = cafes.filter((c) => !blockedIds.has(c.id)).filter((c) => applyFilters(c, settings))

      set({ cafes: filtered, index: 0, status: "ready", error: null })
    } catch (e: unknown) {
      const fallback = createMockCafes(position, settings.radiusKm).filter((c) => !blockedIds.has(c.id)).filter((c) => applyFilters(c, settings))
      const message =
        e && typeof e === "object" && "message" in e && typeof e.message === "string"
          ? `Không tải được dữ liệu online, dùng dữ liệu minh hoạ. (${e.message})`
          : "Không tải được dữ liệu online, dùng dữ liệu minh hoạ."

      set({ cafes: fallback, index: 0, status: "ready", error: message })
    }
  },

  like: () => {
    const { cafes, index } = get()
    const cafe = cafes[index]
    if (!cafe) return

    const likes = [...get().likes, cafe]
    localStorage.setItem(LS_KEYS.likes, JSON.stringify(likes))

    set({ likes, index: index + 1, lastAction: { kind: "like", cafe } })
  },

  dislike: () => {
    const { cafes, index } = get()
    const cafe = cafes[index]
    if (!cafe) return

    const dislikes = [...get().dislikes, cafe.id]
    localStorage.setItem(LS_KEYS.dislikes, JSON.stringify(dislikes))

    set({ dislikes, index: index + 1, lastAction: { kind: "dislike", cafe } })
  },

  undo: () => {
    const last = get().lastAction
    if (!last) return

    const nextIndex = Math.max(0, get().index - 1)
    if (last.kind === "like") {
      const likes = get().likes.filter((c) => c.id !== last.cafe.id)
      localStorage.setItem(LS_KEYS.likes, JSON.stringify(likes))
      set({ likes, index: nextIndex, lastAction: null })
      return
    }

    const dislikes = get().dislikes.filter((id) => id !== last.cafe.id)
    localStorage.setItem(LS_KEYS.dislikes, JSON.stringify(dislikes))
    set({ dislikes, index: nextIndex, lastAction: null })
  },

  resetHistory: () => {
    localStorage.removeItem(LS_KEYS.likes)
    localStorage.removeItem(LS_KEYS.dislikes)

    set({
      likes: [],
      dislikes: [],
      cafes: [],
      index: 0,
      lastAction: null,
    })
  },

  setRadiusKm: (radiusKm) => {
    const settings = { ...get().settings, radiusKm }
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(settings))
    set({ settings })
  },

  toggleWifiFilter: () => {
    const settings = { ...get().settings, filters: { ...get().settings.filters, wifi: !get().settings.filters.wifi } }
    localStorage.setItem(LS_KEYS.settings, JSON.stringify(settings))
    set({ settings })
  },

  removeLike: (id) => {
    const likes = get().likes.filter((c) => c.id !== id)
    localStorage.setItem(LS_KEYS.likes, JSON.stringify(likes))
    set({ likes })
  },
}))

function safeJsonParse<T>(v: string | null): T | null {
  if (!v) return null
  try {
    return JSON.parse(v) as T
  } catch {
    return null
  }
}

function normalizeSettings(s: UserSettings) {
  const radius = Number(s?.radiusKm)
  const radiusKm = (radius >= 1 && radius <= 5 ? radius : 5) as UserSettings["radiusKm"]
  return {
    radiusKm,
    filters: {
      wifi: Boolean(s?.filters?.wifi),
    },
  } satisfies UserSettings
}

function applyFilters(cafe: Cafe, settings: UserSettings) {
  if (settings.filters.wifi) return cafe.tags.includes("wifi")
  return true
}
