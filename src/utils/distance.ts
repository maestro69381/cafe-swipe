import type { GeoPoint } from "@/types"

export function haversineKm(a: GeoPoint, b: GeoPoint) {
  const R = 6371
  const dLat = degToRad(b.lat - a.lat)
  const dLon = degToRad(b.lon - a.lon)
  const lat1 = degToRad(a.lat)
  const lat2 = degToRad(b.lat)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLon = Math.sin(dLon / 2)

  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

