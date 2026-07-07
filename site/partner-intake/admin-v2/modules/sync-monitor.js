export function renderSyncMonitor(el, payload) {
  const data = Array.isArray(payload.data?.summaries) ? payload.data.summaries[0] : payload.data;
  el.innerHTML = `
    <div class="module-header">
      <div><h2>Sync Monitor</h2><p class="meta">Notion + HubSpot sync health.</p></div>
      <span class="badge ${payload.source === "fallback" ? "fallback" : ""}">${payload.source}</span>
    </div>
    <div class="kpi">${data.health ?? "unknown"}</div>
    <div class="card">Retryable failures: ${data.failed_retryable ?? 0}</div>
    <div class="card">Needs review: ${data.needs_review ?? 0}</div>
  `;
}
