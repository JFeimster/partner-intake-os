export function renderComplianceFlags(el, payload) {
  const data = Array.isArray(payload.data) ? payload.data : [];
  el.innerHTML = `
    <div class="module-header">
      <div><h2>Compliance Flags</h2><p class="meta">Restricted-language and disclosure review.</p></div>
      <span class="badge ${payload.source === "fallback" ? "fallback" : ""}">${payload.source}</span>
    </div>
    ${data.map((flag) => `
      <article class="card">
        <strong>${flag.severity ?? "medium"} severity</strong>
        <p class="meta">${flag.phrase ?? "restricted phrase"}</p>
        <p>${flag.action ?? "Manual review required."}</p>
      </article>`).join("")}
  `;
}
