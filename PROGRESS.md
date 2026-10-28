# Weatherman — progress

Last updated: **2026-10-28** (Wed — C12 done)

## Current focus

**C13 polish** (skip missing news image, small cleanup), then **C7 deploy**.

## Chunk status

| ID | Chunk | Status | Notes |
|----|--------|--------|-------|
| C0 | Repo hygiene | done | Vite React-TS scaffold; GitHub `htroutmaniv/weatherman`; env example + README |
| C1 | Shell layout | done | Flex shell; body/#root margin reset |
| C2 | Weather by ZIP (live) | done | Zippopotam → lat/lon; Open-Meteo current in °F / mph; `WeatherCard` |
| C8 | Daily forecast cards | done | Open-Meteo `daily` + `timezone=auto`; one `WeatherCard` per day; optional high/low; weekday from `time` |
| C3 | Abort + ZIP validation polish | done | ZIP abort + forecast effect abort. `AbortError` ignored. Bad ZIP clears cards and shows a message. |
| C4 | Abort + race safety | pending | |
| C5 | Normalize + display | pending | |
| C6 | Location input | pending | |
| C9 | Hourly forecast | done | `forecast_hours=12`, hour label, sunrise/sunset, night icons, refresh button calls the same forecast fetch |
| C11 | Browser location | done | On mount, `getCurrentPosition` → BigDataCloud postcode → `requestLocationData(postcode)`. Zippopotam `place name` is the city. Denied permission leaves the field empty. |
| C10 | News ticker | done | Free News API `q=place+state`. `NewsCard` row: image is the article link (`target=_blank`). Title and description on the card. |
| C12 | Pages + shared ZIP toolbar | done | React Router. `App` layout + `ZipcodeHeader`. `WeatherPage` / `NewsPage` via `Outlet` + `useOutletContext`. Sidebar `NavLink`s. |
| C13 | Small polish | in progress | ZIP argument fix done. `TimeUtilities.ts` shared by both cards. News card shows published weekday + time. Still open: skip a missing image. |
| C7 | Deploy | pending | After the pages. Production build + public URL in the README |

## Session log

### 2026-10-07 Wed
- Created `weatherman` dir; Vite React-TS scaffold; initial commit; pushed to GitHub
- Agreed: Harold codes; agent chunks + reviews; plan/progress files track Wed FE work
- learn-07 Q1 done earlier same day; Q2 parked in favor of this project as ongoing FE vehicle
- **Next:** C1 shell layout
- C1 done (shell + margin reset). **Next:** C2 weather skeleton

### 2026-10-08 Thu
- C2 done: ZIP input, Zippopotam place, Open-Meteo current conditions, weather-code labels, `WeatherCard` component, types in `Types.ts`
- Layout fix: drop the 75% padding; `marginLeft: auto` keeps the zip controls on screen
- **Next session:** daily forecast — Open-Meteo `daily=...` plus `timezone=auto`, one `WeatherCard` per day. Design the card so a time label works for daily now and hourly later.
- C8 done same day: 7-day row reuses `WeatherCard`, optional high/low, weekday label from `daily.time`.

### 2026-10-12 Mon
- C3 done: Zippopotam abort via ref, Open-Meteo abort in the location effect, `AbortError` ignored, bad ZIP clears cards.
- Refresh interval: effect depends on `location` so the timer closes over the current city. Empty deps froze the first render's `location`.

### 2026-10-14 Wed
- C9 done: hourly row, sunrise/sunset on the daily fields, night icons between 9pm and 9am, refresh button via an `onRefresh` prop. `HourlyWeather` and `WeeklyWeather` are their own components. `WeeklyWeather` must not reference `location` unless it is passed in.

### 2026-10-28 Wed
- **C12** done: `react-router`, nested routes, `ZipcodeHeader`, `WeatherPage` / `NewsPage`, outlet context, sidebar `NavLink`s.
- Last-updated / refresh still on the layout (shows on both pages). Fine for now; can move onto weather-only later.
- **Next:** C13 polish, then C7 deploy.

### 2026-10-16 Fri
- `requestLocationData` uses the zip argument. Browser passes the postcode string; the button passes state.
- Date formatting lives in `src/TimeUtilities.ts`. Weather cards and news cards both import it. News shows published weekday and time.
- **C12** router split deferred past True Anomaly HM.

### 2026-10-15 Thu
- C11 done: browser geolocation seeds the ZIP. The postcode is passed into `requestLocationData` so the fetch does not read the stale `zipcode` state. Location and the news query both use Zippopotam's place name.
- C10 done: local headlines in a horizontal `NewsCard` row. The image links to the article; the card body does not.
- **Next session:** C12. Separate weather and news pages, sidebar navigation, shared ZIP toolbar.


## Blockers

- None

## Decisions

- v1: US ZIP → Zippopotam.us → Open-Meteo. Temperature °F, wind mph. `timezone=auto` when adding daily/hourly so day labels are local.
- Agent does not write project app code unless Harold asks
- Place name always comes from Zippopotam, including when the browser only supplied a postcode.
- C12 (Wed Oct 21): declarative React Router. Layout route owns zip and location. `Outlet` renders the page. `useOutletContext` passes `location`.
- News: Free News API, keyword query on place + state. 3D still post-v1.
