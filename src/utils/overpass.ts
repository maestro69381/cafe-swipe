import type { Cafe, GeoPoint } from "@/types"
import { haversineKm } from "@/utils/distance"
import { dedupeByLocation } from "@/utils/dedupe"

type OverpassElement = {
  type: "node" | "way" | "relation"
  id: number
  lat?: number
  lon?: number
  center?: { lat: number; lon: number }
  tags?: Record<string, string>
}

type OverpassResponse = {
  elements: OverpassElement[]
}

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter"

export async function fetchCafesNear(center: GeoPoint, radiusKm: number): Promise<Cafe[]> {
  const radiusM = Math.round(radiusKm * 1000)
  const query = buildQuery(center, radiusM)

  const res = await fetch(OVERPASS_ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: new URLSearchParams({ data: query }),
  })

  if (!res.ok) {
    throw new Error(`Overpass error: ${res.status}`)
  }

  const json = (await res.json()) as OverpassResponse
  const cafes = json.elements
    .map((el) => toCafe(el, center))
    .filter((c): c is Cafe => Boolean(c))
    .filter((c) => c.distanceKm <= radiusKm + 0.05)

  return dedupeByLocation(cafes)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 50)
}

function buildQuery(center: GeoPoint, radiusM: number) {
  const { lat, lon } = center
  return [
    "[out:json][timeout:25];",
    "(",
    `node["amenity"="cafe"](around:${radiusM},${lat},${lon});`,
    `way["amenity"="cafe"](around:${radiusM},${lat},${lon});`,
    `relation["amenity"="cafe"](around:${radiusM},${lat},${lon});`,
    ");",
    "out center tags;",
  ].join("")
}

function toCafe(el: OverpassElement, center: GeoPoint): Cafe | null {
  const location = getLocation(el)
  if (!location) return null

  const tags = el.tags ?? {}
  const name = (tags.name || "").trim() || "Cafe không tên"
  const address = formatAddress(tags)
  const distanceKm = haversineKm(center, location)

  return {
    id: `${el.type}:${el.id}`,
    name,
    location,
    address,
    distanceKm: round2(distanceKm),
    tags: inferTags(tags),
    source: "overpass",
  }
}

function getLocation(el: OverpassElement): GeoPoint | null {
  if (typeof el.lat === "number" && typeof el.lon === "number") {
    return { lat: el.lat, lon: el.lon }
  }
  if (el.center && typeof el.center.lat === "number" && typeof el.center.lon === "number") {
    return { lat: el.center.lat, lon: el.center.lon }
  }
  return null
}

function formatAddress(tags: Record<string, string>) {
  const full = (tags["addr:full"] || "").trim()
  if (full) return full

  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:district"],
    tags["addr:city"],
  ]
    .map((v) => (v || "").trim())
    .filter(Boolean)

  return parts.length ? parts.join(", ") : undefined
}

function inferTags(tags: Record<string, string>) {
  const list: string[] = []
  const internet = (tags.internet_access || tags["internet_access:fee"] || "").toLowerCase()
  if (internet && internet !== "no") list.push("wifi")

  const takeaway = (tags.takeaway || "").toLowerCase()
  if (takeaway === "yes") list.push("takeaway")

  const outdoor = (tags.outdoor_seating || "").toLowerCase()
  if (outdoor === "yes") list.push("ngoài trời")

  return list
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}
