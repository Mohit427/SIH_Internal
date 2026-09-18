const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getState: () => request("/state"),
  reset: () => request("/reset", { method: "POST" }),
  setSiteDensity: (siteId, value) =>
    request(`/sites/${siteId}/density`, {
      method: "POST",
      body: JSON.stringify({ value }),
    }),
  setSiteRate: (siteId, rate) =>
    request(`/sites/${siteId}/rate`, {
      method: "POST",
      body: JSON.stringify({ rate }),
    }),
  getForecast: (siteId) => request(`/sites/${siteId}/forecast`),
  applyAlertAction: (alertId, action) =>
    request(`/alerts/${alertId}/action`, {
      method: "POST",
      body: JSON.stringify({ action }),
    }),
  getVendor: (vendorId) => request(`/vendors/${vendorId}`),
  setVendorStatus: (vendorId, licenseStatus) =>
    request(`/vendors/${vendorId}`, {
      method: "PATCH",
      body: JSON.stringify({ licenseStatus }),
    }),
  createSos: (payload) =>
    request("/sos", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  resolveSos: (sosId) => request(`/sos/${sosId}/resolve`, { method: "POST" }),
};
