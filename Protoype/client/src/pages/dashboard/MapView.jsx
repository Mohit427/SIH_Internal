import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import { useAppState } from "../../state/StateContext.jsx";
import { api } from "../../api.js";
import { densityStatus } from "../../components/ui.jsx";

const STATUS_COLOR = { green: "#16a34a", amber: "#d97706", red: "#dc2626" };

function siteIcon(status) {
  return L.divIcon({
    className: "site-marker-icon",
    html: `<span class="site-marker-dot" style="background:${STATUS_COLOR[status]}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

// Same simple saturating projection the server uses, duplicated here for
// instant popup display without a round trip.
function projectDensity(current, rate, minutesAhead) {
  const ticks = (minutesAhead * 60) / 4;
  const headroom = 100 - current;
  const factor = Math.max(0.35, headroom / 100);
  return Math.max(0, Math.min(100, Math.round(current + rate * ticks * factor)));
}

export default function MapView() {
  const { state } = useAppState();
  const { sites, alerts, activityLog } = state;
  const center = useMemo(() => [26.9346, 75.8322], []);

  const activeAlerts = alerts.filter((a) => !a.resolved);

  return (
    <div className="map-view">
      <div className="map-view-header">
        <h2>Live Crowd Map — Jaipur Circuit</h2>
        <p className="hint-text">
          Markers colour-coded by simulated crowd density. Tiles from
          OpenStreetMap (free tier).
        </p>
      </div>

      <div className="map-view-grid">
        <div className="map-container-wrap">
          <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sites.map((site) => {
              const status = densityStatus(site.currentDensity);
              return (
                <Marker key={site.id} position={[site.lat, site.lng]} icon={siteIcon(status)}>
                  <Tooltip direction="top" offset={[0, -10]}>
                    {site.name} · {Math.round(site.currentDensity)}
                  </Tooltip>
                  <Popup>
                    <strong>{site.name}</strong>
                    <div>{site.category}</div>
                    <div>Open {site.openHours}</div>
                    <div>
                      Current density: <strong>{Math.round(site.currentDensity)}</strong> (
                      {status})
                    </div>
                    <div>
                      Projected in 15 min:{" "}
                      <strong>{projectDensity(site.currentDensity, site.rate, 15)}</strong>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          <div className="map-legend">
            <span>
              <i className="legend-dot" style={{ background: STATUS_COLOR.green }} /> Calm
            </span>
            <span>
              <i className="legend-dot" style={{ background: STATUS_COLOR.amber }} /> Busy
            </span>
            <span>
              <i className="legend-dot" style={{ background: STATUS_COLOR.red }} /> Crowd Risk
            </span>
          </div>
        </div>

        <div className="map-side-panel">
          <SiteControlPanel sites={sites} />

          <div className="panel-block">
            <h3>Active Alerts</h3>
            {activeAlerts.length === 0 && <p className="hint-text">No active alerts.</p>}
            {activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>

          <div className="panel-block">
            <h3>Activity Feed</h3>
            <ul className="activity-feed">
              {activityLog.slice(0, 12).map((entry) => (
                <li key={entry.id}>
                  <span className="activity-time">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  {entry.message}
                </li>
              ))}
              {activityLog.length === 0 && <li className="hint-text">No activity yet.</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCard({ alert }) {
  return (
    <div className="alert-card">
      <div className="alert-card-title">{alert.message}</div>
      <div className="alert-card-actions">
        <button
          className="btn btn-alert-officials"
          onClick={() => api.applyAlertAction(alert.id, "alert_officials")}
        >
          Alert Officials on Site
        </button>
      </div>
      {alert.actions.length > 0 && (
        <ul className="alert-card-log">
          {alert.actions.map((a) => (
            <li key={a.id}>
              {new Date(a.timestamp).toLocaleTimeString()} — {a.label} sent
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SiteControlPanel({ sites }) {
  return (
    <div className="panel-block">
      <h3>Manual density override</h3>
      <p className="hint-text">Drive the demo directly from here if needed.</p>
      {sites.map((site) => {
        const status = densityStatus(site.currentDensity);
        return (
          <div key={site.id} className="site-control-row">
            <div className="site-control-label">
              <span className={`dot-status dot-${status}`} />
              {site.name}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={site.currentDensity}
              onChange={(e) => api.setSiteDensity(site.id, Number(e.target.value))}
            />
            <span className="site-control-value">{Math.round(site.currentDensity)}</span>
          </div>
        );
      })}
    </div>
  );
}
