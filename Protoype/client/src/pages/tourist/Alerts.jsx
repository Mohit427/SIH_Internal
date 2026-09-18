import { useState } from "react";
import { Link } from "react-router-dom";

export default function Alerts() {
  const [rerouted, setRerouted] = useState(false);

  if (rerouted) {
    return (
      <div className="tw-alert-confirm">
        <div className="tw-alert-confirm-icon">✓</div>
        <h1>Itinerary updated</h1>
        <p>
          Amber Fort moved to 18:30 for the light show. Your guide and cab
          were notified.
        </p>
        <Link to="/tourist" className="tw-btn-saffron">
          Back to today's plan
        </Link>
      </div>
    );
  }

  return (
    <div className="tw-alert-screen">
      <div className="tw-alert-top">
        <span className="tw-alert-live-pill">
          <span className="tw-blink-dot" />
          LIVE CROWD ADVISORY
        </span>
        <span className="tw-alert-time">16:12 IST</span>
      </div>

      <div className="tw-alert-icon-wrap">
        <span className="tw-alert-icon-pulse" />
        <span className="tw-alert-icon">!</span>
      </div>

      <h1 className="tw-alert-title">Amber Fort is critically crowded</h1>
      <p className="tw-alert-body">
        Footfall at Gate 1 is 2.4× safe capacity.
        <br />
        Tourist Police advise avoiding the ramp until 17:30.
      </p>

      <div className="tw-suggest-card">
        <div className="tw-suggest-label">SUGGESTED INSTEAD</div>
        <div className="tw-suggest-row">
          <div className="tw-suggest-thumb">SITE</div>
          <div className="tw-suggest-info">
            <div className="tw-suggest-name">Nahargarh Fort</div>
            <div className="tw-suggest-meta">
              <span className="tw-crowd-pill tw-crowd-green">
                <span className="tw-stop-crowd-dot" />
                LOW CROWD
              </span>
              <span className="tw-suggest-detour">8 min detour</span>
            </div>
          </div>
        </div>
        <div className="tw-suggest-route">
          <span className="tw-route-dot tw-route-dot-navy" />
          <span className="tw-route-line" />
          <span className="tw-route-label">2.1 km · cab held</span>
          <span className="tw-route-line tw-route-line-saffron" />
          <span className="tw-route-dot tw-route-dot-saffron" />
        </div>
      </div>

      <div className="tw-alert-actions">
        <button className="tw-btn-navy-block" onClick={() => setRerouted(true)}>
          Reroute me
        </button>
        <Link to="/tourist" className="tw-btn-text-block">
          Keep my plan
        </Link>
      </div>
    </div>
  );
}
