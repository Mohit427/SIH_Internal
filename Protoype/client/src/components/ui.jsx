import { useAppState } from "../state/StateContext.jsx";

export function densityStatus(density) {
  if (density >= 85) return "red";
  if (density >= 60) return "amber";
  return "green";
}

const STATUS_LABEL = { green: "Calm", amber: "Busy", red: "Crowd Risk" };

export function DensityBadge({ density }) {
  const status = densityStatus(density);
  return (
    <span className={`badge badge-${status}`}>
      {STATUS_LABEL[status]} · {Math.round(density)}
    </span>
  );
}

export function DensityBar({ density }) {
  const status = densityStatus(density);
  return (
    <div className="density-bar-track">
      <div
        className={`density-bar-fill fill-${status}`}
        style={{ width: `${Math.min(100, density)}%` }}
      />
    </div>
  );
}

export function ConnectionDot() {
  const { connected } = useAppState();
  return (
    <span className="connection-dot" title={connected ? "Live" : "Reconnecting..."}>
      <span className={`dot ${connected ? "dot-live" : "dot-off"}`} />
      {connected ? "Live" : "Reconnecting"}
    </span>
  );
}

export function ResetDemoButton({ className = "" }) {
  const { reset } = useAppState();
  const onClick = () => {
    if (confirm("Reset all demo state? This clears alerts, SOS events and itinerary changes.")) {
      reset();
    }
  };
  return (
    <button className={`btn btn-ghost ${className}`} onClick={onClick} title="Reset all mock state">
      ↺ Reset Demo
    </button>
  );
}

export function VendorStatusBadge({ status }) {
  const map = {
    verified: { label: "Verified", cls: "badge-green" },
    unregistered: { label: "Unregistered", cls: "badge-amber" },
    suspended: { label: "Suspended", cls: "badge-red" },
  };
  const cfg = map[status] || { label: status, cls: "badge-amber" };
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>;
}
