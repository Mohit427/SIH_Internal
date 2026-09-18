import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SOS() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("idle"); // idle | confirm | sent
  const [count, setCount] = useState(10);
  const [checkInMin, setCheckInMin] = useState(42);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase !== "confirm") return;
    timerRef.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setPhase("sent");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const pressSos = () => {
    setCount(10);
    setPhase("confirm");
  };

  const cancelSos = () => {
    clearInterval(timerRef.current);
    setPhase("idle");
  };

  if (phase === "confirm") {
    return (
      <div className="tw-sos-confirm">
        <div className="tw-sos-confirm-label">SENDING EMERGENCY ALERT</div>
        <div
          className="tw-sos-ring"
          style={{ background: `conic-gradient(#A3241C ${(count / 10) * 100}%, rgba(255,255,255,.12) 0)` }}
        >
          <div className="tw-sos-ring-inner">
            <span className="tw-sos-count">{count}</span>
            <span className="tw-sos-seconds">SECONDS</span>
          </div>
        </div>
        <p>
          Police, your two emergency contacts and Hotel Rambagh Gate will
          receive your live location.
        </p>
        <button className="tw-btn-white-block" onClick={cancelSos}>
          Cancel — I'm safe
        </button>
      </div>
    );
  }

  if (phase === "sent") {
    return (
      <div className="tw-sos-sent">
        <div className="tw-sos-sent-top">
          <span className="tw-blink-dot tw-blink-dot-red" />
          SOS ACTIVE · 00:42
        </div>
        <h1>Help is on the way</h1>
        <p>
          Unit PCR-14 acknowledged, 4 min away. Stay where you are if it is
          safe.
        </p>
        <div className="tw-sos-steps">
          <div className="tw-sos-step">
            <span className="tw-step-check">✓</span>
            <span className="tw-step-text">Tourist Police notified</span>
            <span className="tw-step-time">16:14</span>
          </div>
          <div className="tw-sos-step">
            <span className="tw-step-check">✓</span>
            <span className="tw-step-text">Contacts sent live location</span>
            <span className="tw-step-time">16:14</span>
          </div>
        </div>
        <div className="tw-flex-spacer" />
        <button className="tw-btn-saffron-block" onClick={() => navigate("/tourist/bystander")}>
          Show bystander screen
        </button>
        <button className="tw-btn-ghost-block" onClick={() => setPhase("idle")}>
          End emergency
        </button>
      </div>
    );
  }

  const pct = Math.max(6, Math.min(100, Math.round((checkInMin / 90) * 100)));

  return (
    <div className="tw-sos-idle">
      <div className="tw-sos-location-pill">
        <span className="tw-blink-dot" />
        <span className="tw-sos-location-text">
          Location shared with <strong>Jaipur Tourist Police</strong>
        </span>
        <span className="tw-sos-gps">GPS ±6m</span>
      </div>

      <div className="tw-sos-center">
        <button className="tw-sos-button" onClick={pressSos}>
          <span className="tw-sos-button-pulse" />
          <span className="tw-sos-button-label">SOS</span>
          <span className="tw-sos-button-caption">TAP TO ALERT</span>
        </button>
        <div className="tw-sos-caption">
          <div className="tw-sos-caption-title">Sends police, your contacts and hotel</div>
          <div className="tw-sos-caption-note">
            10 seconds to cancel · works over SMS if offline
          </div>
        </div>
      </div>

      <div className="tw-checkin-card">
        <div className="tw-checkin-top">
          <div>
            <div className="tw-checkin-label">CHECK-IN TIMER</div>
            <div className="tw-checkin-value">{checkInMin}:18</div>
          </div>
          <button className="tw-checkin-extend" onClick={() => setCheckInMin((m) => Math.min(90, m + 30))}>
            +30 min
          </button>
        </div>
        <div className="tw-checkin-bar">
          <span className="tw-checkin-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="tw-checkin-hint">
          If you don't check in, we alert your contacts automatically.
        </div>
      </div>

      <div className="tw-sos-secondary">
        <a href="tel:112" className="tw-btn-outline-block">
          Call 112
        </a>
        <button className="tw-btn-outline-block" onClick={() => navigate("/tourist/bystander")}>
          Bystander screen
        </button>
      </div>
    </div>
  );
}
