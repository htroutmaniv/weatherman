# Weatherman — plan

Portfolio React console. Harold builds; agent guides in chunks and **does not write app code unless asked**.

## North star

Operator-style data console: ingest real APIs → normalize → client store → UI. Later optional Three.js panel from the same store (canvas once, rAF reads store, React = chrome).

## Constraints

- Ship a **thin v1** before adding sources or 3D
- Secrets only in `.env.local` (never commit)
- **Daily:** short Weatherman chunk (15–45 min) alongside DSA
- **Wednesdays:** heavier FE block on Weatherman
- DSA continues non-Wed (and light Wed only if FE is done)
- Prefer asking for help over silent thrash; agent gives tasks + review, not drive-by scaffolds

## v1 scope (done when all checked in PROGRESS)

1. App shell: layout with source list + main panel
2. Weather by **US ZIP**: geocode ZIP → lat/lon, then forecast (no-key path preferred)
3. Fetch with loading / error / success; abort on unmount or source change
4. Normalize API payload into a small typed model
5. Display current conditions (+ optional simple forecast strip)
6. README: what it is, how to run, screenshot optional
7. Deployed demo URL (Vercel/Netlify) linked from README

## Explicitly later (not v1)

- Second API (news / flights / etc.)
- Three.js / globe / tracks
- Auth, accounts, fancy design system
- Perfect pixel polish

## Wednesday session pattern

1. Read `PROGRESS.md` — pick next open chunk
2. Harold implements (agent: hints/review on request only)
3. End of session: update `PROGRESS.md` (what landed, what’s next, blockers)
4. Commit when a chunk is meaningfully done

## Chunk backlog (ordered)

See `PROGRESS.md` for status. Definitions:

| ID | Chunk | Acceptance |
|----|--------|------------|
| C0 | Repo hygiene | `.env.example` ok; README accurate; `npm run dev` / `build` work |
| C1 | Shell layout | Sidebar + main panel; placeholder copy; no real fetch yet |
| C2 | Weather by ZIP (live) | Input ZIP; geocode; fetch forecast; loading/error; show current conditions |
| C3 | Abort + polish | AbortController; clearer errors; empty/invalid ZIP handling |
| C4 | Abort + race safety | AbortController on unmount / re-fetch; no stale setState |
| C5 | Normalize + display | Typed model; main panel shows temp, weather code/label, wind, updated-at |
| C6 | Location input | User can change location (query or lat/lon); refetch |
| C7 | Deploy | Production build hosted; README link |

## Stack notes

- Vite + React 19 + TypeScript (already scaffolded)
- **Recommended (no API key):**
  1. ZIP → lat/lon: [Zippopotam.us](https://api.zippopotam.us/) `GET /us/{zip}`
  2. Forecast: [Open-Meteo](https://open-meteo.com/en/docs) `GET /v1/forecast?latitude=&longitude=&current=...`
- **Alternative (one API, free key):** [OpenWeatherMap](https://openweathermap.org/current) `zip={zip},us&appid=...` — put key in `.env.local` as `VITE_OPENWEATHER_API_KEY`
