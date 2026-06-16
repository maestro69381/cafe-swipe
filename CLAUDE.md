# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server
npm run build      # tsc type-check + Vite production build
npm run check      # type-check only (no emit)
npm run lint       # ESLint
npm run test       # Vitest (run once, no watch)
```

Run a single test file:
```bash
npx vitest run src/utils/dedupe.test.ts
```

## Architecture

This is a mobile-styled React SPA that lets users swipe through nearby cafes (Tinder-style). It renders inside a `PhoneFrame` wrapper to simulate a phone UI on desktop.

**Data flow:**
1. `AppShell` mounts → calls `store.hydrate()` to load localStorage (likes, dislikes, settings)
2. User grants geolocation → `store.requestLocation()` sets `position`
3. `Discover` page reacts to `position`/settings changes → calls `store.loadCafes()`
4. `loadCafes` hits the Overpass API (OpenStreetMap) with a Flux-style query for `amenity=cafe` within the radius; on network failure it falls back to `createMockCafes`
5. Results are deduped by rounded lat/lon + name, sorted by distance, capped at 50
6. `SwipeDeck` renders the current and next card; drag >140px triggers like/dislike animations via framer-motion

**State — single Zustand store** ([src/store/useCafeSwipeStore.ts](src/store/useCafeSwipeStore.ts)):
- `status`: `"idle" | "locating" | "loading" | "ready" | "error"`
- `cafes` + `index`: the current deck; advancing the index is how swiping works
- `likes: Cafe[]`, `dislikes: string[]` (IDs only): persisted to `localStorage` keys `cafeswipe.*`
- `lastAction`: enables single-step undo
- `settings.radiusKm` (1–5) and `settings.filters.wifi` are also persisted

**Path aliases:** `@/` maps to `src/` (configured in both `tsconfig.json` and `vite-tsconfig-paths`).

**Styling:** Tailwind CSS with custom CSS variables for the color palette (`--mint`, `--coffee`, `--sun-1`, etc.) defined in [src/index.css](src/index.css). Use `clsx` + `tailwind-merge` via [src/lib/utils.ts](src/lib/utils.ts) for conditional class names.

**UI language:** Vietnamese — all user-facing strings are in Vietnamese. Keep new strings consistent.

**Theme:** `useTheme` hook toggles `light`/`dark` class on `<html>` and persists to `localStorage`.

**Tests:** Vitest + jsdom + `@testing-library/react`. Test files live next to the code they test (`*.test.ts`). Setup file: [vitest.setup.ts](vitest.setup.ts).
