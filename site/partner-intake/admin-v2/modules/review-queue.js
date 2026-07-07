export function renderReviewQueue(el, payload) {
  const source = payload.source === "api" ? "api" : "fallback";
  const data = Array.isArray(payload.data) ? payload.data : [];
  el.innerHTML = `
    <div class="module-header">
      <div><h2>Review Queue</h2><p class="meta">Partner and lead review decisions requiring human attention.</p></div>
      <span class="badge ${source === "fallback" ? "fallback" : ""}">${source}</span>
    </div>
    ${data.map((item) => `
      <article class="card">
        <strong>${item.title ?? item.display_name ?? "Review item"}</strong>
        <p class="meta">${item.status ?? "needs_review"}</p>
        <p>${item.note ?? item.next_action ?? "Manual review required."}</p>
      </article>`).join("")}
  `;
}
