import { Link } from "react-router-dom";
import { ResetDemoButton } from "../components/ui.jsx";

export default function Landing() {
  return (
    <div className="landing">
      <div className="landing-card">
        <h1>TripWise</h1>
        <p className="landing-tagline">
          Smart Tourist Safety &amp; Travel Companion — SIH Prototype
        </p>
        <p className="landing-note">
          Pick a view below. Both views share one live mock backend, so
          actions in the Government Dashboard instantly reflect in the
          Tourist App, and vice versa.
        </p>

        <div className="landing-links">
          <Link to="/tourist" className="landing-tile tile-tourist">
            <span className="tile-icon">📱</span>
            <span className="tile-title">Tourist App</span>
            <span className="tile-desc">
              Mobile-width view: itinerary, QR vendor verification, SOS &amp;
              bystander mode.
            </span>
          </Link>
          <Link to="/dashboard" className="landing-tile tile-dashboard">
            <span className="tile-icon">🖥️</span>
            <span className="tile-title">Government Command Dashboard</span>
            <span className="tile-desc">
              Desktop view: live crowd map, vendor registry, real-time SOS
              feed.
            </span>
          </Link>
        </div>

        <div className="landing-footer">
          <ResetDemoButton />
        </div>
      </div>
    </div>
  );
}
