import type { Cafe, GeoPoint } from "@/types"
import { haversineKm } from "@/utils/distance"

export function createMockCafes(center: GeoPoint, radiusKm: number): Cafe[] {
  const names = [
    "Bơm Brew",
    "Nắng Đậu",
    "Ngõ Nhỏ",
    "Rang Rắc",
    "Cà Phê Mềm",
    "Sổ Tay",
    "Hạt Vàng",
    "Mây Latte",
    "Góc Cửa Sổ",
    "Bệt & Bạn",
  ]

  return names.map((name, idx) => {
    const location = offsetPoint(center, 0.2 + ((idx + 1) / (names.length + 2)) * (radiusKm * 0.9), idx * 37)
    return {
      id: `mock:${idx}`,
      name,
      location,
      address: "Dữ liệu minh hoạ (offline)",
      distanceKm: round2(haversineKm(center, location)),
      tags: idx % 2 === 0 ? ["wifi"] : [],
      source: "mock",
    }
  })
}

function offsetPoint(center: GeoPoint, distanceKm: number, bearingDeg: number): GeoPoint {
  const R = 6371
  const d = distanceKm / R
  const brng = degToRad(bearingDeg)
  const lat1 = degToRad(center.lat)
  const lon1 = degToRad(center.lon)

  const lat2 = Math.asin(Math.sin(lat1) * Math.cos(d) + Math.cos(lat1) * Math.sin(d) * Math.cos(brng))
  const lon2 =
    lon1 +
    Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(lat1), Math.cos(d) - Math.sin(lat1) * Math.sin(lat2))

  return { lat: radToDeg(lat2), lon: radToDeg(lon2) }
}

function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

function radToDeg(rad: number) {
  return (rad * 180) / Math.PI
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

