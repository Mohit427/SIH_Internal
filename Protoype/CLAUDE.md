# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

YatraSense — an SIH-pitch prototype: a tourist-facing web app and a government
command dashboard, both driven by one shared, live mock backend. An action in
the dashboard (suspend a vendor, hold a gate) is visible in the tourist app
within a second, and vice versa (an SOS from the tourist app appears
instantly in the dashboard's live feed). This is a demo artifact for judges,
not a production system — see "What's real vs simulated" in
[README.md](README.md) before treating anything (crowd prediction, SOS
dispatch, vendor verification) as more than a mock.

## Commands

```bash
npm install     # from repo root — installs both workspaces (server, client)
npm run dev     # runs backend (:4000) and frontend (:5173) together via concurrently
```

There is no build step needed for the demo (Vite dev server + `node --watch`).
`client` has `npm run build` / `npm run preview` (Vite) if a production
bundle is ever needed. There are no lint or test scripts configured in either
package — don't assume `npm test` or `npm run lint` exist.

To run one side only: `npm run dev --workspace=server` or
`npm run dev --workspace=client`.

## Architecture

This is an npm workspaces monorepo: `/server` (Express + Socket.IO) and
`/client` (React + Vite), listed as workspaces in the root
[package.json](package.json).

**The core pattern: one mutable in-memory store, broadcast over Socket.IO,
read by both frontend views.** There is no database and no separate state per
view — this is what makes cross-screen cause-and-effect (dashboard action →
tourist app update, or SOS → dashboard feed) work live without polling or
manual sync logic.

- [server/store.js](server/store.js) — the single source of truth. Holds all
  state (sites, vendors, itinerary, alerts, SOS events, activity log) as one
  module-level object, and every exported mutation function (`setSiteDensity`,
  `applyAlertAction`, `setVendorLicenseStatus`, `createSosEvent`, etc.) calls
  `emit()` at the end, which fans out to `onChange` listeners. When adding a
  new mutation, follow this same shape: find/validate, mutate `state`, call
  `logActivity(...)` if it's demo-relevant, call `emit()`, return the changed
  entity.
- [server/index.js](server/index.js) — wires `onChange` to
  `io.emit("state:update", state)`, so *every* mutation — regardless of
  entry point — pushes the full state tree to all connected clients. Also
  defines the REST routes (thin wrappers over store functions) and the
  simulation tick loop (`setInterval(tickSimulation, TICK_INTERVAL_SECONDS * 1000)`,
  currently every 4s).
- [server/predict.js](server/predict.js) — crowd forecasting. Deliberately
  not a real model: `projectDensity()` linearly extrapolates a site's density
  using its current value and per-tick rate, with a saturation curve near
  100. `forecastSite()` builds the +5/+15/+20 min forecast and computes
  `minutesToRed`. `densityStatus()` maps a density number to
  green/amber/red via `AMBER_THRESHOLD` (60) / `RED_THRESHOLD` (85).
- [server/data/seed.js](server/data/seed.js) — `freshSeed()` returns the
  mock dataset (5 Jaipur sites, 4 vendors, 1 tourist profile). `resetState()`
  in store.js just calls this again — this is what the "Reset Demo" button
  hits.
- Auto-reroute logic lives in `maybeRerouteForSite()` in store.js: when a
  site the tourist is *currently at* goes red, it raises a `crowd_crush_risk`
  alert and swaps that itinerary stop for the lowest-density site not
  already in the itinerary. This runs both from the simulation tick and from
  manual density overrides (`setSiteDensity`), so demo sliders and the
  background sim produce identical behavior.

- [client/src/state/StateContext.jsx](client/src/state/StateContext.jsx) —
  one Socket.IO connection for the whole React app (`AppStateProvider`),
  exposing `{ state, connected, reset }` via `useAppState()`. Every screen
  reads from this single live `state` object rather than fetching its own
  slice — there's no per-screen data fetching for live state. A one-time
  `api.getState()` REST call on mount is a fallback for a flaky initial
  socket connection.
- [client/src/api.js](client/src/api.js) — thin REST client (`api.*`
  functions) for actions (mutations); reads of live state come from the
  socket, not from calling these getters repeatedly.
- [client/vite.config.js](client/vite.config.js) — proxies `/api` and
  `/socket.io` (with `ws: true`) to `http://localhost:4000`, so the client
  always talks to relative paths, never a hardcoded backend URL.
- [client/src/App.jsx](client/src/App.jsx) — route tree: `/` (picker),
  `/tourist/*` (Itinerary/Scan/SOS/Bystander under `TouristLayout`),
  `/dashboard/*` (Map/Vendors/SOS Feed under `DashboardLayout`).

### Adding a new piece of live state

To add something new that both views should see in real time: add it to the
seed shape in `seed.js`, add a mutation function in `store.js` that mutates
`state` and calls `emit()`, add a REST route in `index.js` that calls it, add
a client method in `api.js`, and read the resulting value straight off
`useAppState().state` in whichever screen(s) need it — no additional wiring
required for it to reach the other view.

## Full architecture and module writeup

[README.md](README.md) has a complete description of all four modules
(Tourist App, Government Dashboard, shared mock data layer, crowd prediction
simulator) and a table of what's real vs. simulated in the demo (map tiles
and site coordinates are real; crowd density, forecasts, vendor data, and SOS
dispatch are all mocked). Read it before making claims about what this
prototype does or doesn't actually do.
