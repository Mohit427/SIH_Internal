import express from "express";
import cors from "cors";
import http from "node:http";
import { Server as SocketIOServer } from "socket.io";
import {
  getState,
  resetState,
  tickSimulation,
  setSiteDensity,
  setSiteRate,
  applyAlertAction,
  setVendorLicenseStatus,
  getVendorProfile,
  createSosEvent,
  resolveSosEvent,
  onChange,
  TICK_INTERVAL_SECONDS,
} from "./store.js";
import { forecastSite } from "./predict.js";

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

onChange((state) => {
  io.emit("state:update", state);
});

io.on("connection", (socket) => {
  socket.emit("state:update", getState());
});

// ---- Routes -----------------------------------------------------------

app.get("/api/state", (req, res) => {
  res.json(getState());
});

app.post("/api/reset", (req, res) => {
  res.json(resetState());
});

app.post("/api/sites/:id/density", (req, res) => {
  const { value } = req.body;
  if (typeof value !== "number") {
    return res.status(400).json({ error: "value (number) is required" });
  }
  const site = setSiteDensity(req.params.id, value);
  if (!site) return res.status(404).json({ error: "site not found" });
  res.json(site);
});

app.post("/api/sites/:id/rate", (req, res) => {
  const { rate } = req.body;
  if (typeof rate !== "number") {
    return res.status(400).json({ error: "rate (number) is required" });
  }
  const site = setSiteRate(req.params.id, rate);
  if (!site) return res.status(404).json({ error: "site not found" });
  res.json(site);
});

app.get("/api/sites/:id/forecast", (req, res) => {
  const state = getState();
  const site = state.sites.find((s) => s.id === req.params.id);
  if (!site) return res.status(404).json({ error: "site not found" });
  res.json(forecastSite(site));
});

app.post("/api/alerts/:id/action", (req, res) => {
  const { action } = req.body;
  if (!["alert_officials"].includes(action)) {
    return res.status(400).json({ error: "invalid action" });
  }
  const alert = applyAlertAction(req.params.id, action);
  if (!alert) return res.status(404).json({ error: "alert not found" });
  res.json(alert);
});

app.get("/api/vendors/:id", (req, res) => {
  const vendor = getVendorProfile(req.params.id);
  if (!vendor) return res.status(404).json({ error: "vendor not found" });
  res.json(vendor);
});

app.patch("/api/vendors/:id", (req, res) => {
  const { licenseStatus } = req.body;
  if (!["verified", "unregistered", "suspended"].includes(licenseStatus)) {
    return res.status(400).json({ error: "invalid licenseStatus" });
  }
  const vendor = setVendorLicenseStatus(req.params.id, licenseStatus);
  if (!vendor) return res.status(404).json({ error: "vendor not found" });
  res.json(vendor);
});

app.post("/api/sos", (req, res) => {
  const { type, gps, note } = req.body;
  if (!["manual", "auto_deadman"].includes(type)) {
    return res.status(400).json({ error: "invalid sos type" });
  }
  const event = createSosEvent({ type, gps, note });
  res.status(201).json(event);
});

app.post("/api/sos/:id/resolve", (req, res) => {
  const event = resolveSosEvent(req.params.id);
  if (!event) return res.status(404).json({ error: "sos event not found" });
  res.json(event);
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, tickIntervalSeconds: TICK_INTERVAL_SECONDS });
});

// ---- Simulation loop ---------------------------------------------------

setInterval(() => {
  tickSimulation();
}, TICK_INTERVAL_SECONDS * 1000);

server.listen(PORT, () => {
  console.log(`YatraSense mock server listening on http://localhost:${PORT}`);
});
