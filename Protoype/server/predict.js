// Lightweight stand-in for a "real" ST-GNN crowd forecasting model.
// Projects a site's density forward in time using its current density and
// its per-tick growth rate. This is intentionally simple linear/saturating
// extrapolation -- enough to demonstrate the *concept* of short-horizon
// forecasting live, without any real sensor data or trained model.

export const TICK_INTERVAL_SECONDS = 4;
export const AMBER_THRESHOLD = 60;
export const RED_THRESHOLD = 85;

/**
 * Project density forward by `minutesAhead` minutes, given the current
 * density and the site's per-tick rate. Uses a mild saturation curve so
 * density eases as it approaches 100 (more realistic than pure linear).
 */
export function projectDensity(currentDensity, rate, minutesAhead) {
  const ticksAhead = (minutesAhead * 60) / TICK_INTERVAL_SECONDS;
  const headroom = 100 - currentDensity;
  const saturationFactor = Math.max(0.35, headroom / 100); // slows growth near the ceiling
  const projected = currentDensity + rate * ticksAhead * saturationFactor;
  return Math.max(0, Math.min(100, Math.round(projected)));
}

/**
 * Build a short forecast summary for a site: density at +5/+15/+20 min,
 * and whether/when it's projected to cross the red (crowd-crush-risk)
 * threshold.
 */
export function forecastSite(site) {
  const horizons = [5, 15, 20].map((minutesAhead) => ({
    minutesAhead,
    projectedDensity: projectDensity(site.currentDensity, site.rate, minutesAhead),
  }));

  let minutesToRed = null;
  if (site.rate > 0 && site.currentDensity < RED_THRESHOLD) {
    for (let m = 1; m <= 60; m++) {
      if (projectDensity(site.currentDensity, site.rate, m) >= RED_THRESHOLD) {
        minutesToRed = m;
        break;
      }
    }
  } else if (site.currentDensity >= RED_THRESHOLD) {
    minutesToRed = 0;
  }

  return { siteId: site.id, horizons, minutesToRed };
}

export function densityStatus(density) {
  if (density >= RED_THRESHOLD) return "red";
  if (density >= AMBER_THRESHOLD) return "amber";
  return "green";
}
