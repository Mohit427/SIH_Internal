import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import TouristLayout from "./pages/tourist/TouristLayout.jsx";
import Home from "./pages/tourist/Home.jsx";
import Alerts from "./pages/tourist/Alerts.jsx";
import Scan from "./pages/tourist/Scan.jsx";
import SOS from "./pages/tourist/SOS.jsx";
import Bystander from "./pages/tourist/Bystander.jsx";
import IdCard from "./pages/tourist/IdCard.jsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import MapView from "./pages/dashboard/MapView.jsx";
import Vendors from "./pages/dashboard/Vendors.jsx";
import SOSFeed from "./pages/dashboard/SOSFeed.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/tourist" element={<TouristLayout />}>
        <Route index element={<Home />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="scan" element={<Scan />} />
        <Route path="sos" element={<SOS />} />
        <Route path="id" element={<IdCard />} />
        <Route path="bystander" element={<Bystander />} />
      </Route>

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<MapView />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="sos" element={<SOSFeed />} />
      </Route>
    </Routes>
  );
}
