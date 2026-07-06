(function () {
  const status = document.querySelector("[data-admin-status]");
  const queue = document.querySelector("[data-review-queue]");
  const warning = document.querySelector("[data-admin-warning]");
  const logoutButton = document.querySelector("[data-logout]");

  const fallbackRecords = [
    {
      partner_id: "static_demo_partner",
      display_name: "Static Demo Partner",
      company: "Demo Co",
      partner_type: "referral_partner",
      partner_tier: "tier_3",
      onboarding_path: "education_first_partner",
      status: "static_demo_only",
      risk_level: "medium",
      score: 52,
      manual_review_required: true,
      risk_flags: ["api_unavailable", "static_demo_mode"],
      recommended_decision: "do_not_use_for_production",
      next_action: "Configure /api/admin/session and /api/admin/review-queue before relying on this dashboard.",
      reviewer_notes: "Fallback static fixture only."
    }
  ];

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.className = `status ${type || ""}`.trim();
  }

  function renderWarning(message) {
    if (!warning) return;
    warning.hidden = false;
    warning.textContent = message;
  }

  function tagList(items) {
    return (items || []).map((item) => `<span class="queue-tag">${escapeHtml(item)}</span>`).join("");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function render(records) {
    if (!queue) return;
    queue.innerHTML = records.map((record) => `
      <article class="queue-item">
        <div class="queue-topline">
          <h2>${escapeHtml(record.display_name || record.company || record.partner_id)}</h2>
          <span class="score">Score ${escapeHtml(record.score || "n/a")}</span>
        </div>
        <p class="muted">${escapeHtml(record.company || "No company")} · ${escapeHtml(record.partner_type)} · ${escapeHtml(record.partner_tier)}</p>
        <dl>
          <div><dt>Status</dt><dd>${escapeHtml(record.status)}</dd></div>
          <div><dt>Risk</dt><dd>${escapeHtml(record.risk_level)}</dd></div>
          <div><dt>Path</dt><dd>${escapeHtml(record.onboarding_path)}</dd></div>
          <div><dt>Decision</dt><dd>${escapeHtml(record.recommended_decision)}</dd></div>
        </dl>
        <p><strong>Next action:</strong> ${escapeHtml(record.next_action)}</p>
        <div class="tag-row">${tagList(record.risk_flags)}</div>
        <p class="muted">${escapeHtml(record.reviewer_notes || "")}</p>
      </article>
    `).join("");
  }

  async function loadQueue() {
    setStatus("Loading protected review queue…", "");
    try {
      const response = await fetch("/api/admin/review-queue", {
        method: "GET",
        credentials: "include",
        headers: { "Accept": "application/json" }
      });

      if (response.status === 401) {
        setStatus("Admin session required. Redirecting to login…", "error");
        window.setTimeout(() => {
          window.location.href = "./login.html";
        }, 650);
        return;
      }

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) {
        throw new Error(payload?.error?.message || "Review queue API failed.");
      }

      setStatus(`Loaded ${payload.total || 0} protected review records.`, "ok");
      renderWarning(payload.warning || "Protected admin route loaded. Use sample/internal data only.");
      render(payload.records || []);
    } catch (error) {
      setStatus("Protected API unavailable. Showing static fallback fixture.", "error");
      renderWarning("Fallback static demo mode. Do not treat this data as authenticated or production-backed.");
      render(fallbackRecords);
    }
  }

  async function logout() {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    } finally {
      window.location.href = "./login.html";
    }
  }

  if (logoutButton) logoutButton.addEventListener("click", logout);

  const style = document.createElement("style");
  style.textContent = `
    .review-card { width: min(1020px, 100%); }
    .review-header { display:flex; gap:18px; justify-content:space-between; align-items:flex-start; }
    .review-header button { width:auto; min-width:110px; }
    .queue { display:grid; gap:16px; margin-top:22px; }
    .queue-item { border:1px solid var(--line); background:rgba(255,255,255,0.045); border-radius:22px; padding:20px; }
    .queue-topline { display:flex; justify-content:space-between; gap:16px; align-items:start; }
    .queue-topline h2 { margin:0; font-size:1.25rem; }
    .score { border:1px solid var(--line); border-radius:999px; padding:6px 10px; color:var(--accent); white-space:nowrap; }
    .muted { color:var(--muted); }
    dl { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; margin:16px 0; }
    dt { color:var(--muted); font-size:.78rem; text-transform:uppercase; letter-spacing:.1em; }
    dd { margin:4px 0 0; font-weight:800; }
    .tag-row { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
    .queue-tag { border:1px solid var(--line); border-radius:999px; padding:6px 9px; color:var(--muted); font-size:.86rem; }
    @media (max-width: 720px) { .review-header,.queue-topline { flex-direction:column; } dl { grid-template-columns:1fr; } }
  `;
  document.head.appendChild(style);

  loadQueue();
})();
