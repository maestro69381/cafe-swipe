export type GeoPoint = {
  lat: number
  lon: number
}

export type Cafe = {
  id: string
  name: string
  location: GeoPoint
  address?: string
  distanceKm: number
  tags: string[]
  source: "overpass" | "mock"
}

export type UserSettings = {
  radiusKm: 1 | 2 | 3 | 4 | 5
  filters: {
    wifi: boolean
  }
}

