import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { ResetDemoButton } from "../../components/ui.jsx";

export default function TouristLayout() {
  const [lang, setLang] = useState("EN");
  const location = useLocation();
  const isBystander = location.pathname === "/tourist/bystander";

  return (
    <div className="tw-shell">
      <div className="tw-phone">
        <div className="tw-screen">
          {!isBystander && (
            <div className="tw-statusbar">
              <span>9:41</span>
              <div className="tw-statusbar-icons">
                <span className="tw-icon-signal" />
                <span className="tw-icon-wifi" />
                <span className="tw-icon-battery" />
              </div>
            </div>
          )}

          {!isBystander && (
            <div className="tw-header">
              <Link to="/" className="tw-brand">
                <span className="tw-brand-mark">TW</span>
                <span className="tw-brand-text">
                  <span className="tw-brand-name">TripWise</span>
                  <span className="tw-brand-sub">GOVT-BACKED TOURIST REGISTRY</span>
                </span>
              </Link>
              <div className="tw-lang-toggle">
                <button
                  className={`tw-lang-btn ${lang === "EN" ? "tw-lang-active" : ""}`}
                  onClick={() => setLang("EN")}
                >
                  EN
                </button>
                <button
                  className={`tw-lang-btn ${lang === "HI" ? "tw-lang-active" : ""}`}
                  onClick={() => setLang("HI")}
                >
                  हिं
                </button>
              </div>
            </div>
          )}

          <div className="tw-content">
            <Outlet />
          </div>

          {!isBystander && (
            <nav className="tw-tabbar">
              <NavLink to="/tourist" end className="tw-tab">
                <span className="tw-tab-icon">◆</span>
                <span>Trip</span>
              </NavLink>
              <NavLink to="/tourist/alerts" className="tw-tab">
                <span className="tw-tab-icon">▲</span>
                <span>Alerts</span>
              </NavLink>
              <NavLink to="/tourist/scan" className="tw-tab">
                <span className="tw-tab-icon">○</span>
                <span>Scan</span>
              </NavLink>
              <NavLink to="/tourist/sos" className="tw-tab">
                <span className="tw-tab-icon">●</span>
                <span>SOS</span>
              </NavLink>
              <NavLink to="/tourist/id" className="tw-tab">
                <span className="tw-tab-icon">▤</span>
                <span>ID</span>
              </NavLink>
            </nav>
          )}
        </div>
      </div>

      <div className="tw-side-note">
        <p>
          <strong>Demo view:</strong> this simulates a tourist's phone.
          Screens here are a self-contained visual demo — open the Government
          Dashboard in another tab to see the live, backend-driven side of
          the prototype.
        </p>
        <ResetDemoButton />
      </div>
    </div>
  );
}
