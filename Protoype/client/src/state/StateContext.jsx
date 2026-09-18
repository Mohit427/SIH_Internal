import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { api } from "../api";

const StateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io({ path: "/socket.io" });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("state:update", (nextState) => setState(nextState));

    // Fallback in case the socket connection is flaky on stage.
    api.getState().then(setState).catch(() => {});

    return () => socket.disconnect();
  }, []);

  const value = { state, connected, reset: () => api.reset() };

  return <StateContext.Provider value={value}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
