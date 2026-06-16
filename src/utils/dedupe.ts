import type { Cafe } from "@/types"

export function dedupeByLocation(cafes: Cafe[]) {
  const seen = new Set<string>()
  const out: Cafe[] = []

  for (const c of cafes) {
    const key = `${Math.round(c.location.lat * 10000)}:${Math.round(c.location.lon * 10000)}:${c.name.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(c)
  }

  return out
}

