export function renderTrackingAnalytics(el, payload) {
  const data = payload.data ?? {};
  el.innerHTML = `
    <div class="module-header">
      <div><h2>Tracking Analytics</h2><p class="meta">Safe attribution only. No fingerprinting or payout math.</p></div>
      <span class="badge ${payload.source === "fallback" ? "fallback" : ""}">${payload.source}</span>
    </div>
    <div class="kpi">${data.clicks ?? 0}</div><p class="meta">clicks</p>
    <div class="card">Lead started: ${data.lead_started ?? 0}</div>
    <div class="card">Lead submitted: ${data.lead_submitted ?? 0}</div>
  `;
}
