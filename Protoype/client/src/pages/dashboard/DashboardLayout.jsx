import { NavLink, Outlet, Link } from "react-router-dom";
import { ConnectionDot, ResetDemoButton } from "../../components/ui.jsx";
import { useAppState } from "../../state/StateContext.jsx";

export default function DashboardLayout() {
  const { state } = useAppState();

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link to="/" className="dashboard-brand">
          <span className="dashboard-brand-mark">TW</span>
          TripWise
        </Link>
        <div className="dashboard-brand-sub">Command Dashboard</div>

        <nav className="dashboard-nav">
          <NavLink to="/dashboard" end className="dashboard-nav-link">
            🗺️ Live Crowd Map
          </NavLink>
          <NavLink to="/dashboard/vendors" className="dashboard-nav-link">
            🏪 Vendor Registry
          </NavLink>
          <NavLink to="/dashboard/sos" className="dashboard-nav-link">
            🆘 SOS Feed
            {state?.sosEvents.some((e) => e.status === "active") && (
              <span className="nav-dot" />
            )}
          </NavLink>
        </nav>

        <div className="dashboard-sidebar-footer">
          <ConnectionDot />
          <ResetDemoButton />
        </div>
      </aside>

      <main className="dashboard-main">
        {state ? <Outlet /> : <div className="loading">Connecting to mock backend...</div>}
      </main>
    </div>
  );
}
