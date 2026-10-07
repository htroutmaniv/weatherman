# Weatherman

React + TypeScript data console for interview / portfolio practice.

**v1 goal:** ingest real-world feeds into a normalized client store, render a simple operator-style console (source list + detail panel). Abortable fetch, loading/error states, no secrets in the repo.

**Later:** optional Three.js panel driven from the same store (tracks / globe), same pattern as production graphics FE — canvas mounts once, rAF reads the store, React is chrome.

## Stack

- Vite + React 19 + TypeScript
- Planned feeds: weather (Open-Meteo, no key) + one secondary API

## Scripts

```bash
npm install
npm run dev
npm run build
```

## Env

Copy `.env.example` → `.env.local` when a keyed API is added. Vite only exposes vars prefixed with `VITE_`.
