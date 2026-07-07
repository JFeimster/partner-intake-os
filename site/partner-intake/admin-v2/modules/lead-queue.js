export function renderLeadQueue(el, payload) {
  const data = Array.isArray(payload.data) ? payload.data : [];
  el.innerHTML = `
    <div class="module-header">
      <div><h2>Lead Queue</h2><p class="meta">Lead submissions received for review.</p></div>
      <span class="badge ${payload.source === "fallback" ? "fallback" : ""}">${payload.source}</span>
    </div>
    ${data.map((lead) => `
      <article class="card">
        <strong>${lead.company ?? "Submitted lead"}</strong>
        <p class="meta">${lead.status ?? "received_for_review"} · ${lead.route ?? "manual_review"}</p>
        <p>Funding options may vary. No approval, rates, terms, or timelines are guaranteed.</p>
      </article>`).join("")}
  `;
}
