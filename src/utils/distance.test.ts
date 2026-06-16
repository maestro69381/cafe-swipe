import { describe, expect, it } from "vitest"
import { haversineKm } from "@/utils/distance"

describe("haversineKm", () => {
  it("tính khoảng cách gần đúng theo kinh tuyến", () => {
    const km = haversineKm({ lat: 0, lon: 0 }, { lat: 0, lon: 1 })
    expect(km).toBeGreaterThan(110)
    expect(km).toBeLessThan(112.5)
  })

  it("bằng 0 khi cùng điểm", () => {
    const km = haversineKm({ lat: 10.123, lon: 106.456 }, { lat: 10.123, lon: 106.456 })
    expect(km).toBe(0)
  })
})

