export function renderPartnerProfiles(el, payload) {
  const data = Array.isArray(payload.data) ? payload.data : [];
  el.innerHTML = `
    <div class="module-header">
      <div><h2>Partner Profiles</h2><p class="meta">Tier, risk, and next-action snapshot.</p></div>
      <span class="badge ${payload.source === "fallback" ? "fallback" : ""}">${payload.source}</span>
    </div>
    ${data.map((partner) => `
      <article class="card">
        <strong>${partner.name ?? partner.display_name ?? "Partner"}</strong>
        <p class="meta">Tier: ${partner.tier ?? partner.partner_tier ?? "review"} · Risk: ${partner.risk ?? partner.risk_level ?? "unknown"}</p>
        <p>${partner.next ?? partner.next_action ?? "No next action set."}</p>
      </article>`).join("")}
  `;
}
