import { nanoid } from "nanoid";
import { freshSeed } from "./data/seed.js";
import { forecastSite, densityStatus, AMBER_THRESHOLD, RED_THRESHOLD, TICK_INTERVAL_SECONDS } from "./predict.js";

let state = freshSeed();
const listeners = new Set();

export function onChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  for (const fn of listeners) fn(getState());
}

function logActivity(message, meta = {}) {
  state.activityLog.unshift({
    id: nanoid(8),
    message,
    meta,
    timestamp: new Date().toISOString(),
  });
  state.activityLog = state.activityLog.slice(0, 100);
}

export function getState() {
  return state;
}

export function resetState() {
  state = freshSeed();
  emit();
  return state;
}

function findSite(siteId) {
  return state.sites.find((s) => s.id === siteId);
}

function currentStopSiteId() {
  const { stopIds, activeIndex } = state.itinerary;
  return stopIds[activeIndex];
}

// Pick the lowest-density site that is NOT already in the itinerary as a
// reroute alternate.
function pickAlternateSite(excludeIds) {
  const candidates = state.sites
    .filter((s) => !excludeIds.includes(s.id))
    .sort((a, b) => a.currentDensity - b.currentDensity);
  return candidates[0] || null;
}

function maybeRerouteForSite(site) {
  const status = densityStatus(site.currentDensity);
  if (status !== "red") return;
  if (currentStopSiteId() !== site.id) return;

  const alreadyActive = state.alerts.some(
    (a) => a.siteId === site.id && a.type === "crowd_crush_risk" && !a.resolved
  );

  const alternate = pickAlternateSite(state.itinerary.stopIds);

  if (!alreadyActive) {
    const forecast = forecastSite(site);
    state.alerts.unshift({
      id: nanoid(8),
      siteId: site.id,
      type: "crowd_crush_risk",
      severity: "red",
      message: `Crowd crush risk forecast in ~15 min at ${site.name}`,
      forecast,
      resolved: false,
      createdAt: new Date().toISOString(),
      actions: [],
    });
    logActivity(`Red alert raised at ${site.name} (density ${site.currentDensity})`, {
      siteId: site.id,
    });
  }

  if (alternate) {
    const { stopIds, activeIndex } = state.itinerary;
    const alreadyRerouted = stopIds[activeIndex] === alternate.id;
    if (!alreadyRerouted) {
      const fromSiteName = site.name;
      const newStopIds = [...stopIds];
      newStopIds[activeIndex] = alternate.id;
      state.itinerary.stopIds = newStopIds;
      state.itinerary.rerouteLog.unshift({
        id: nanoid(8),
        from: fromSiteName,
        to: alternate.name,
        reason: `Crowd rising at ${fromSiteName}`,
        timestamp: new Date().toISOString(),
      });
      logActivity(`Tourist itinerary rerouted: ${fromSiteName} -> ${alternate.name}`, {
        from: site.id,
        to: alternate.id,
      });
    }
  }
}

export function tickSimulation() {
  for (const site of state.sites) {
    const jitter = 0.7 + Math.random() * 0.6; // 0.7x - 1.3x
    const next = site.currentDensity + site.rate * jitter;
    site.currentDensity = Math.max(0, Math.min(100, Math.round(next * 10) / 10));
    maybeRerouteForSite(site);
  }
  emit();
}

export function setSiteDensity(siteId, value) {
  const site = findSite(siteId);
  if (!site) return null;
  site.currentDensity = Math.max(0, Math.min(100, value));
  maybeRerouteForSite(site);
  emit();
  return site;
}

export function setSiteRate(siteId, rate) {
  const site = findSite(siteId);
  if (!site) return null;
  site.rate = Math.max(0, rate);
  emit();
  return site;
}

export function applyAlertAction(alertId, action) {
  const alert = state.alerts.find((a) => a.id === alertId);
  if (!alert) return null;
  const site = findSite(alert.siteId);

  const label = "Alert Officials on Site";

  alert.actions.push({
    id: nanoid(8),
    action,
    label,
    timestamp: new Date().toISOString(),
  });

  if (site) {
    site.currentDensity = Math.max(0, site.currentDensity - 15);
    site.rate = Math.max(0.3, site.rate * 0.6);
    if (densityStatus(site.currentDensity) !== "red") {
      alert.resolved = true;
    }
  }

  logActivity(`Officials alerted on site at ${site ? site.name : alert.siteId}`, {
    alertId,
    action,
  });

  emit();
  return alert;
}

export function setVendorLicenseStatus(vendorId, licenseStatus) {
  const vendor = state.vendors.find((v) => v.id === vendorId);
  if (!vendor) return null;
  vendor.licenseStatus = licenseStatus;
  logActivity(`Vendor "${vendor.name}" marked ${licenseStatus}`, { vendorId, licenseStatus });
  emit();
  return vendor;
}

export function getVendorProfile(vendorId) {
  return state.vendors.find((v) => v.id === vendorId) || null;
}

export function createSosEvent({ type, gps, note }) {
  const event = {
    id: nanoid(10),
    type, // 'manual' | 'auto_deadman'
    status: "active",
    createdAt: new Date().toISOString(),
    tourist: state.touristProfile,
    gps,
    note: note || null,
    payload: {
      name: state.touristProfile.name,
      touristId: state.touristProfile.touristId,
      gps,
      lastMovement: note || "No recent movement data",
      medical: {
        bloodGroup: state.touristProfile.bloodGroup,
        allergies: state.touristProfile.allergies,
      },
      emergencyContact: state.touristProfile.emergencyContact,
      triggeredAt: new Date().toISOString(),
      triggerType: type,
    },
  };
  state.sosEvents.unshift(event);
  logActivity(
    `SOS (${type === "auto_deadman" ? "auto dead-man switch" : "manual"}) triggered by ${state.touristProfile.name}`,
    { sosId: event.id }
  );
  emit();
  return event;
}

export function resolveSosEvent(sosId) {
  const event = state.sosEvents.find((e) => e.id === sosId);
  if (!event) return null;
  event.status = "resolved";
  logActivity(`SOS ${sosId} marked resolved`, { sosId });
  emit();
  return event;
}

export { AMBER_THRESHOLD, RED_THRESHOLD, TICK_INTERVAL_SECONDS };
