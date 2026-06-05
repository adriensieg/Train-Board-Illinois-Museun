import type { Departure, DepartureCreate, DepartureUpdate, AuthStatus } from "@/types/departure";

const BASE = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Departures ────────────────────────────────────────────────────────────────
export const api = {
  departures: {
    list: () => request<Departure[]>("/departures"),
    create: (body: DepartureCreate) =>
      request<Departure>("/departures", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: DepartureUpdate) =>
      request<Departure>(`/departures/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    remove: (id: string) =>
      request<void>(`/departures/${id}`, { method: "DELETE" }),
  },

  auth: {
    me: () => request<AuthStatus>("/auth/me"),
    setup: () => request<{ qr_b64: string; secret: string }>("/auth/setup"),
    login: (code: string) =>
      request<{ ok: boolean }>("/auth/login", { method: "POST", body: JSON.stringify({ code }) }),
    logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  },
};
