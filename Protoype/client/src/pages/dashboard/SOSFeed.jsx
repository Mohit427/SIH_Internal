import { useAppState } from "../../state/StateContext.jsx";
import { api } from "../../api.js";

export default function SOSFeed() {
  const { state } = useAppState();
  const { sosEvents } = state;

  return (
    <div className="sos-feed-view">
      <div className="map-view-header">
        <h2>Live SOS Feed</h2>
        <p className="hint-text">
          SOS events created via the backend API appear here in real time
          over WebSocket. The Tourist App's SOS screen is currently a
          self-contained visual demo and does not post here — see the
          README's "Caveats" section.
        </p>
      </div>

      {sosEvents.length === 0 && (
        <div className="empty-state">
          No SOS events yet. POST to <code>/api/sos</code> to simulate one.
        </div>
      )}

      <div className="sos-feed-list">
        {sosEvents.map((event) => (
          <div key={event.id} className={`sos-feed-card sos-status-${event.status}`}>
            <div className="sos-feed-top">
              <div>
                <span className={`badge ${event.type === "manual" ? "badge-red" : "badge-amber"}`}>
                  {event.type === "manual" ? "Manual SOS" : "Auto: Dead-man Switch"}
                </span>
                <span className="sos-feed-time">
                  {new Date(event.createdAt).toLocaleTimeString()}
                </span>
              </div>
              {event.status === "active" ? (
                <button className="btn btn-safe btn-sm" onClick={() => api.resolveSos(event.id)}>
                  Mark Resolved
                </button>
              ) : (
                <span className="badge badge-green">Resolved</span>
              )}
            </div>

            <div className="sos-feed-body">
              <div className="sos-feed-loc">
                📍 {event.gps.lat}, {event.gps.lng}
              </div>
              <pre className="json-payload">{JSON.stringify(event.payload, null, 2)}</pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
