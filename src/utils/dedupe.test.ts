import { describe, expect, it } from "vitest"
import { dedupeByLocation } from "@/utils/dedupe"
import type { Cafe } from "@/types"

describe("dedupeByLocation", () => {
  it("loại trùng theo tọa độ + tên (làm tròn)", () => {
    const base: Omit<Cafe, "id"> = {
      name: "A",
      location: { lat: 10.123456, lon: 106.123456 },
      distanceKm: 1,
      tags: [],
      source: "mock",
    }

    const cafes: Cafe[] = [
      { ...base, id: "1" },
      { ...base, id: "2", location: { lat: 10.1234561, lon: 106.1234562 } },
      { ...base, id: "3", name: "B" },
    ]

    const out = dedupeByLocation(cafes)
    expect(out).toHaveLength(2)
    expect(out.map((c) => c.name).sort()).toEqual(["A", "B"])
  })
})

