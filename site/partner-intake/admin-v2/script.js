import { renderReviewQueue } from "./modules/review-queue.js";
import { renderPartnerProfiles } from "./modules/partner-profiles.js";
import { renderLeadQueue } from "./modules/lead-queue.js";
import { renderTrackingAnalytics } from "./modules/tracking-analytics.js";
import { renderSyncMonitor } from "./modules/sync-monitor.js";
import { renderComplianceFlags } from "./modules/compliance-flags.js";

const mock = {
  review: [
    { title: "CPA referral partner", status: "needs_review", note: "Strong audience fit. Verify consent language." },
    { title: "Affiliate inquiry", status: "needs_info", note: "Missing traffic source details." }
  ],
  partners: [
    { name: "Ledger Lane Advisory", tier: "tier_2", risk: "low", next: "Send onboarding checklist" },
    { name: "Veteran Builder Network", tier: "tier_1_review", risk: "medium", next: "Schedule strategic review" }
  ],
  leads: [
    { company: "Demo HVAC Co.", status: "received_for_review", route: "manual_review" }
  ],
  tracking: { clicks: 42, lead_started: 8, lead_submitted: 3 },
  sync: { health: "attention_required", failed_retryable: 1, needs_review: 1 },
  compliance: [
    { severity: "high", phrase: "guaranteed approval", action: "Rewrite required" }
  ]
};

async function safeFetch(path, fallback) {
  try {
    const res = await fetch(path, { credentials: "include" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    return { data: payload.data ?? payload, source: "api" };
  } catch (error) {
    return { data: fallback, source: "fallback", error: error.message };
  }
}

function renderMiniModule(id, title, items) {
  const el = document.getElementById(id);
  el.innerHTML = `
    <div class="module-header">
      <div><h2>${title}</h2><p class="meta">Future API module; fallback-safe shell.</p></div>
      <span class="badge fallback">mock</span>
    </div>
    ${items.map((item) => `<div class="card">${item}</div>`).join("")}
  `;
}

async function boot() {
  const review = await safeFetch("/api/admin/review-queue", mock.review);
  const partners = await safeFetch("/api/admin/partners", mock.partners);
  const leads = await safeFetch("/api/admin/leads", mock.leads);
  const tracking = await safeFetch("/api/tracking/summary", mock.tracking);
  const sync = await safeFetch("/api/admin/sync-status", mock.sync);
  const compliance = await safeFetch("/api/admin/compliance-queue", mock.compliance);

  renderReviewQueue(document.getElementById("review-queue"), review);
  renderPartnerProfiles(document.getElementById("partner-profiles"), partners);
  renderLeadQueue(document.getElementById("lead-queue"), leads);
  renderTrackingAnalytics(document.getElementById("tracking-analytics"), tracking);
  renderSyncMonitor(document.getElementById("sync-monitor"), sync);
  renderComplianceFlags(document.getElementById("compliance-flags"), compliance);

  renderMiniModule("gpt-action-logs", "GPT Action Logs", ["No failed Action calls in fallback data.", "Wire to /api/admin/action-logs later."]);
  renderMiniModule("tally-intake-monitor", "Tally Intake Monitor", ["Latest webhook status placeholder.", "Do not expose Tally webhook endpoint to GPT Actions."]);
  renderMiniModule("operator-notes", "Operator Notes", ["Notes metadata only. No private notes in browser fallback."]);
  renderMiniModule("launch-qa-status", "Launch QA Status", ["Internal QA green/yellow/red checklist placeholder."]);
}

boot();
