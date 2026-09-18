# YatraSense — Smart Tourist Safety & Travel Companion

A working **prototype** for an SIH-style pitch: a tourist-facing mobile web
app and a government command dashboard.

The **Government Command Dashboard** is backed by one live, shared mock
backend (Express + Socket.IO + an in-memory store) — actions taken there
(suspend a vendor, alert officials at a site) update every open Dashboard
tab within a second.

The **Tourist App** is currently a self-contained, click-through visual
demo — its screens hold their own local state and do not read from or write
to that backend. That's a deliberate simplification, made partway through
this prototype, described in full under
[Caveats & known limitations](#caveats--known-limitations) below. It used to
be wired live the same way the Dashboard is, and could be again without much
work — this README is explicit about that trade-off so it doesn't surprise
anyone mid-demo.

Nothing here talks to a real government system, real CCTV, Aadhaar/DigiLocker,
or a real crowd-sensing network. All of that is mocked — see
**"What's real vs simulated"** below, and especially **"Caveats & known
limitations,"** so you can answer that question directly if a judge asks it.

## Quick start

Requires Node.js 18+.

```bash
npm install
npm run dev
```

This starts both the backend (`http://localhost:4000`) and the frontend
(`http://localhost:5173`) together. Open `http://localhost:5173` — you'll
land on a picker for the **Tourist App** and the **Government Command
Dashboard**.

There's a **Reset Demo** button on the Dashboard and the landing page (and,
for consistency, next to the Tourist App phone frame too) that wipes the
backend's mock state — alerts, SOS events, vendor status, itinerary reroutes
— back to the seed data. It only affects what the Dashboard shows; the
Tourist App's screens don't read from that state, so Reset Demo has no
visible effect there.

## Architecture

```
/server   Express + Socket.IO — the single source of truth for the Government Dashboard
/client   React + Vite — Tourist App (self-contained demo) and Government Dashboard (live), same app
```

- **`server/data/seed.js`** — the mock dataset: 5 real Jaipur tourist sites
  (lat/lng, opening hours, starting crowd density), 4 mock vendors, and one
  fictional tourist profile.
- **`server/store.js`** — in-memory state + all mutations (density changes,
  reroutes, alerts, vendor status, SOS events). Every mutation broadcasts the
  full state over a Socket.IO `state:update` event, which is how every open
  Dashboard tab stays in sync in real time.
- **`server/predict.js`** — the crowd forecasting simulator (see below).
- **`server/index.js`** — the REST API + simulation tick loop (every 4s,
  each site's density drifts upward by its configured rate, with jitter).
- **`client/src/state/StateContext.jsx`** — a single Socket.IO connection
  shared by the whole React app; the Government Dashboard reads from one
  live state object. The Tourist App is mounted inside the same provider but
  its screens don't currently consume it.

## The two experiences

### 1. Tourist App (`/tourist`)
Phone-frame web view with a bottom tab bar. Every screen here holds its own
local component state — nothing is fetched from or posted to the backend
(see [Caveats](#caveats--known-limitations)):
- **Trip** — a static 4-stop Jaipur itinerary with colour-coded crowd badges
  and a dismissible "Itinerary updated" banner linking to Alerts.
- **Alerts** — a full-screen crowd advisory ("Amber Fort is critically
  crowded") with a suggested lower-crowd alternate and a "Reroute me" button
  that flips to a confirmation screen. Fixed demo content, not driven by the
  Dashboard's live density numbers.
- **Scan** — a tap-to-scan "Trust Rail" viewfinder that shows a fixed
  verified-guide result or, on demand, a fixed unregistered/overpriced
  result. Not connected to the Dashboard's actual Vendor Registry.
- **SOS** — a big SOS button with a 10-second cancellable countdown, plus a
  cosmetic check-in timer. Pressing it does **not** create a real SOS event
  or notify the Dashboard — it only transitions the screen locally.
- **Bystander** — full-screen high-contrast emergency card: "I AM A
  TOURIST / I NEED HELP / CALL 112" with a Hindi line and hardcoded medical
  fields (blood group, allergy, condition).
- **ID** — a Digital Tourist ID wallet card with a reveal/hide toggle for a
  hardcoded document number. Purely visual.

### 2. Government Command Dashboard (`/dashboard`)
Desktop sidebar layout, live and backend-driven throughout:
- **Live Crowd Map** — Leaflet map (OpenStreetMap free tiles) with all 5
  sites colour-coded green/amber/red by live density, a manual override
  slider per site for live demo control, an active alerts panel with a
  single **Alert Officials on Site** action that logs a timestamped entry to
  the activity feed and nudges that site's density down (a demo
  simplification — see Caveats), and a live activity feed.
- **Vendor Registry** — table of all mock vendors; **Suspend** / **Reinstate**
  / **Mark Verified** updates the vendor's status immediately across every
  open Dashboard tab. (It no longer reflects on the Tourist App's Scan
  screen — see Caveats.)
- **SOS Feed** — lists SOS events from the backend in real time via
  WebSocket, with GPS and the full payload, and a "Mark Resolved" action.
  Since the Tourist App's SOS button is currently local-only, the only way
  to populate this feed today is a direct `POST /api/sos` call — see
  Caveats.

### 3. Shared mock data layer
One in-memory store (`server/store.js`) is the single source of truth for
sites, vendors, itinerary, alerts, and SOS events, and currently backs the
Government Dashboard only. Every Dashboard tab holds one Socket.IO
connection to it and re-renders from the same broadcast state.

### 4. Crowd prediction simulator (`server/predict.js`)
Not a real ST-GNN — deliberately not, per the brief. `projectDensity(current,
rate, minutesAhead)` linearly extrapolates a site's density forward using its
current value and per-tick growth rate, with a mild saturation curve so
growth eases near 100 (more plausible than pure linear). `forecastSite()`
uses this to compute density at +5/+15/+20 minutes and how many minutes
until a site crosses the red ("crowd crush risk") threshold, which drives
the Dashboard's map popups and the `/api/sites/:id/forecast` route. Good
enough to demonstrate the *concept* of short-horizon forecasting live; not a
claim of real predictive modelling.

## What's real vs simulated

| Thing | Status |
|---|---|
| Jaipur site names, coordinates, opening hours | Real places, real lat/lng |
| Map tiles | Real — OpenStreetMap free tier, live tile requests |
| Crowd density scores (Dashboard) | 100% simulated — a server-side tick loop with configurable per-site rates, plus manual sliders for live demo control |
| Crowd forecast ("~15 min ahead") | Simple linear/saturating projection, not a trained model |
| Vendor names, licence IDs, price ranges | Fabricated for the demo |
| Tourist profile (Aditi Sharma), blood group, allergies | Fabricated |
| Real-time sync across Dashboard tabs | Real — Socket.IO, not staged/scripted |
| Tourist App ↔ Dashboard live sync | **Not currently wired** — the Tourist App is a self-contained visual demo (see Caveats) |
| SOS transmission | Backend supports a real HTTP POST + WebSocket broadcast to the Dashboard, but the Tourist App's SOS button doesn't call it right now; no real emergency service is ever contacted either way |
| "112" / dispatch integration | Not implemented — display-only |
| QR codes / vendor verification | Not implemented in the Tourist App's current build — the Scan screen shows fixed demo content instead of scanning or looking anything up |
| Aadhaar / DigiLocker / government ID verification | Not implemented anywhere |

## Caveats & known limitations

This section is meant to be read out loud to a judge. It's split into two
kinds of gaps: things that were simply **out of scope for a prototype** (and
could be built with more time), and things that are **hard for reasons that
don't go away with more engineering time** — legal, physical-world, or
institutional constraints a real deployment would have to navigate.

### Out of scope for this prototype (buildable, given time)

- **Tourist App isn't wired to the backend.** As covered above, the Tourist
  App's screens (Trip, Alerts, Scan, SOS, Bystander, ID) currently hold
  local, hardcoded demo state instead of reading/writing
  `server/store.js` the way the Dashboard does. Earlier in development it
  was wired exactly like the Dashboard (itinerary reroutes driven by live
  site density, Scan results fetched from the real Vendor Registry, SOS
  posting a real event the Dashboard's SOS Feed would receive). Re-wiring
  it is mostly plumbing — the backend routes and store functions it would
  need (`/api/sos`, `/api/vendors/:id`, `/api/state`) already exist and are
  exercised by the Dashboard — it just isn't done in the current build.
- **No persistence.** State lives in one JS object in server memory
  (`server/store.js`); it resets on every server restart and there's no
  database. Fine for a demo you reset between judges; not fine for anything
  real.
- **No authentication or access control.** Anyone who can reach
  `/dashboard` can suspend a vendor or resolve an SOS — there's no login,
  no roles, no audit trail of *who* took an action, only *that* one was
  taken (`server/store.js`'s `logActivity`). A real command dashboard needs
  this before it could be trusted with anything.
- **Single process, no horizontal scaling.** The in-memory store and
  Socket.IO server are one Node process. It's the right shape for a demo
  and the wrong shape for production traffic.
- **EN/HI language toggle is cosmetic.** The Tourist App header has an
  EN/हिं switch; it only changes which pill is highlighted, no strings
  actually translate. Real localization needs every screen translated,
  reviewed by native speakers, and tested — not a toggle.
- **"Works offline" labels are just labels.** The Scan screen says "works
  offline · last registry sync 12 min ago" and the SOS screen says "works
  over SMS if offline" — neither actually has an offline code path. See
  below for why the SMS piece specifically is nontrivial.

### Hard for reasons beyond this prototype's scope

These aren't "we ran out of time" gaps — they're the parts of this pitch
that would take real institutional partnerships, hardware, or legal
groundwork to build for real, regardless of engineering effort.

- **"Hold Gate" / "Open Emergency Corridor" (why they became "Alert
  Officials on Site").** The Dashboard's alert action used to be two
  buttons that implied the system could directly hold a physical gate shut
  or open a physical emergency corridor at a monument from a web dashboard.
  That's not something software can do — gates, barriers, and crowd
  corridors are physical infrastructure operated by on-site personnel, and
  claiming a dashboard button controls them invites an obvious "how,
  exactly?" from a judge. The action is now a single **Alert Officials on
  Site** button that logs a notification — an honest claim (the system can
  flag a site to on-ground staff) rather than an implied one (the system
  controls the site). For the demo, it still nudges that site's density
  down after a short delay, purely so the crowd map visibly responds to a
  button press on stage — that's a demo convenience, not a claim that
  alerting officials guarantees any particular outcome or timing in
  reality.
- **Real crowd density needs real sensing infrastructure.** This prototype
  simulates density with a tick loop and manual sliders. A real system
  needs some combination of CCTV-based crowd counting (compute-heavy
  computer vision, and a legal basis for surveillance at heritage sites),
  telecom cell-tower density data (requires telecom operator partnership),
  or Wi-Fi/Bluetooth probe-request counting (privacy-sensitive, patchy
  coverage indoors/outdoors at forts). Every option here is a multi-party
  infrastructure and data-sharing negotiation, not a coding task.
- **Real SOS/emergency dispatch has a much higher reliability bar.** The
  backend can already accept and broadcast an SOS event over HTTP/WebSocket
  — but a real deployment needs integration with India's actual emergency
  number (112 / ERSS), telecom-grade delivery guarantees, an SMS fallback
  for low-connectivity areas (a genuine offline path, not a label), GPS
  that's usable inside stone forts and narrow heritage-site lanes where
  signal reflects and drifts, and a legal/consent framework for sharing a
  tourist's live location and medical data with police, hotels, and
  emergency contacts. None of that is achievable by one team without
  multi-agency sign-off.
- **Vendor/guide registry verification doesn't survive contact with fraud
  at scale.** The Scan screen's QR-based "Trust Rail" concept is sound, but
  a real version needs cryptographically signed QR codes (a plain ID
  lookup, as this prototype's backend does, can be spoofed by printing any
  QR that encodes an unregistered vendor's ID as if it were a verified
  one), a real onboarding and enforcement pipeline for thousands of guides,
  cabs, and shops across a state, and an ongoing process for handling
  disputes and complaints — all outside what a hackathon prototype can
  stand up.
- **Aadhaar / DigiLocker / government ID verification requires an official
  partnership**, not an integration this prototype could mock in any way
  that would mean something. It needs UIDAI/DigiLocker sign-off, a security
  audit, and compliance with India's Digital Personal Data Protection Act
  before it could touch a real identity document — which is why it's not
  implemented anywhere here, even as a stub.
- **Bystander mode's full medical disclosure is a real privacy trade-off,
  not just a missing feature.** Showing blood group, allergies, and a
  condition to *any* passerby who reads the phone screen is the right
  emergency-first call for a demo, but a production version would need a
  real consent model — what gets shown to an anonymous bystander vs. a
  verified first responder, and whether a tourist can opt out of some
  fields — which is a product and legal design problem, not just a UI one.

## Tech stack

- **Backend:** Express, Socket.IO, in-memory store (no DB setup needed —
  intentional for a demo you might run offline or on flaky venue wifi)
- **Frontend:** React 18, Vite, React Router, react-leaflet, IBM Plex
  Sans/Mono (Tourist App)
- Everything except the OpenStreetMap map tiles and the Google Fonts
  request runs fully offline once `npm install` has completed once.
