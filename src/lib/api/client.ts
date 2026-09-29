/**
 * BHOO-MITRA AI — Reusable API Client with Safe Demo Fallback
 *
 * Connects to the FastAPI backend (http://localhost:8000/api) when available.
 * Automatically falls back to local synthetic demonstration data if the API server
 * is offline or unreachable.
 *
 * Health response now includes:
 *   api: "healthy"
 *   database: "connected" | "unavailable"
 *   postgis: "enabled" | "disabled" | "unavailable"
 *   repository: "postgres" | "mock"
 */

export const API_BASE_URL =
  ((import.meta.env as Record<string, string>)["VITE_API_URL"] as string) || "http://localhost:8000/api";

export type ApiConnectionState = "CONNECTED" | "DEMO_MODE" | "CHECKING";

export interface SystemHealthStatus {
  api: "healthy" | "unavailable";
  database: "connected" | "unavailable";
  postgis: "enabled" | "disabled" | "unavailable";
  repository: "postgres" | "mock";
}

const DEFAULT_HEALTH: SystemHealthStatus = {
  api: "unavailable",
  database: "unavailable",
  postgis: "unavailable",
  repository: "mock",
};

let globalApiConnectionState: ApiConnectionState = "CHECKING";
let globalHealthStatus: SystemHealthStatus = DEFAULT_HEALTH;

const connectionListeners: Array<(state: ApiConnectionState) => void> = [];
const healthListeners: Array<(status: SystemHealthStatus) => void> = [];

export function subscribeApiConnectionStatus(
  listener: (state: ApiConnectionState) => void
): () => void {
  connectionListeners.push(listener);
  listener(globalApiConnectionState);
  return () => {
    const idx = connectionListeners.indexOf(listener);
    if (idx >= 0) connectionListeners.splice(idx, 1);
  };
}

export function subscribeHealthStatus(
  listener: (status: SystemHealthStatus) => void
): () => void {
  healthListeners.push(listener);
  listener(globalHealthStatus);
  return () => {
    const idx = healthListeners.indexOf(listener);
    if (idx >= 0) healthListeners.splice(idx, 1);
  };
}

export function getHealthStatus(): SystemHealthStatus {
  return globalHealthStatus;
}

function updateApiState(newState: ApiConnectionState) {
  if (globalApiConnectionState !== newState) {
    globalApiConnectionState = newState;
    connectionListeners.forEach((fn) => fn(newState));
  }
}

function updateHealthStatus(status: SystemHealthStatus) {
  globalHealthStatus = status;
  healthListeners.forEach((fn) => fn(status));
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch(`${API_BASE_URL.replace(/\/api$/, "")}/api/health`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data.status === "healthy" || data.api === "healthy") {
        updateApiState("CONNECTED");
        updateHealthStatus({
          api: "healthy",
          database: data.database === "connected" ? "connected" : "unavailable",
          postgis: data.postgis === "enabled" ? "enabled" : data.postgis === "disabled" ? "disabled" : "unavailable",
          repository: data.repository === "postgres" ? "postgres" : "mock",
        });
        return true;
      }
    }
  } catch (_err) {
    // Backend unavailable
  }

  updateApiState("DEMO_MODE");
  updateHealthStatus(DEFAULT_HEALTH);
  return false;
}

// Initial health check run
checkBackendHealth();

/**
 * Executes API request with automatic local fallback if backend is unreachable
 */
export async function fetchWithFallback<T>(
  endpoint: string,
  localFallbackFn: () => Promise<T>,
  options?: RequestInit
): Promise<T> {
  // If backend is known to be offline in DEMO_MODE, return local synthetic data immediately for instant zero-lag UI
  if (globalApiConnectionState === "DEMO_MODE") {
    return await localFallbackFn();
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600); // 600ms max timeout for instant responsiveness

    const token = typeof window !== "undefined" ? localStorage.getItem("bhoomitra_access_token") : null;
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...authHeaders,
        ...(options?.headers || {}),
      },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data !== undefined) {
        updateApiState("CONNECTED");
        return json.data as T;
      }
    }
  } catch (_err) {
    // API request failed or timed out -> Fallback to local demo store instantly
  }

  updateApiState("DEMO_MODE");
  return await localFallbackFn();
}
