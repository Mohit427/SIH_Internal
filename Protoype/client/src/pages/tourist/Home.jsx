import { useState } from "react";
import { Link } from "react-router-dom";

const STOPS = [
  {
    time: "09:10",
    name: "Hawa Mahal",
    crowd: "LOW",
    tone: "green",
    note: "Photo stop, 25 min. Entry via Gate 2 — shorter queue.",
  },
  {
    time: "10:40",
    name: "Nahargarh Fort",
    crowd: "MODERATE",
    tone: "amber",
    note: "Swapped in for Amber Fort. 8 min detour, guide informed.",
    isNew: true,
  },
  {
    time: "13:00",
    name: "Jantar Mantar",
    crowd: "LOW",
    tone: "green",
    note: "Shaded seating near the sundial. Water refill point inside.",
  },
  {
    time: "18:30",
    name: "Amber Fort — light show",
    crowd: "HIGH AT 16:00",
    tone: "red",
    note: "Moved to the evening slot. Tickets re-issued, no fee.",
  },
];

export default function Home() {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="tw-trip">
      <div className="tw-trip-hero">
        <div className="tw-trip-hero-route" />
        <div className="tw-trip-live-badge">
          <span className="tw-blink-dot" />
          LIVE · JAIPUR
        </div>
        <div className="tw-trip-day-badge">DAY 3 / 5</div>
      </div>

      <div className="tw-trip-body">
        {showBanner && (
          <div className="tw-update-banner">
            <span className="tw-update-banner-icon">↻</span>
            <div className="tw-update-banner-body">
              <div className="tw-update-banner-title">Itinerary updated</div>
              <div className="tw-update-banner-text">
                Rerouted due to crowding at Amber Fort. Evening slot booked
                instead.
              </div>
              <Link to="/tourist/alerts" className="tw-update-banner-link">
                See what changed
              </Link>
            </div>
            <button
              className="tw-update-banner-close"
              onClick={() => setShowBanner(false)}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        <div className="tw-trip-header-row">
          <span className="tw-trip-date">Today · Wed 19 Aug</span>
          <span className="tw-trip-count">{STOPS.length} STOPS</span>
        </div>

        <div className="tw-timeline">
          {STOPS.map((stop) => (
            <div key={stop.name} className="tw-timeline-row">
              <span className={`tw-timeline-dot tw-dot-${stop.tone}`} />
              <div className="tw-stop-card">
                <div className="tw-stop-top">
                  <span className="tw-stop-time">{stop.time}</span>
                  <span className={`tw-stop-crowd tw-crowd-${stop.tone}`}>
                    <span className="tw-stop-crowd-dot" />
                    {stop.crowd}
                  </span>
                  {stop.isNew && <span className="tw-stop-new">NEW</span>}
                </div>
                <div className="tw-stop-name">{stop.name}</div>
                <div className="tw-stop-note">{stop.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
