// In production, set VITE_API_URL to your deployed backend's base URL
// (e.g. https://log-analyzer-server.vercel.app). In local dev it's empty
// and Vite's dev-server proxy (see vite.config.js) forwards /api to
// http://localhost:8080.
const BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  health: () => request("/health"),
  ingestLogs: (entries) =>
    request("/logs", { method: "POST", body: JSON.stringify(entries) }),
  listLogs: (params = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    ).toString();
    return request(`/logs${qs ? `?${qs}` : ""}`);
  },
  getLog: (id) => request(`/logs/${id}`),
  retryExplanation: (id) => request(`/logs/${id}/explain`, { method: "POST" }),
  getStats: () => request("/logs/stats"),
};
