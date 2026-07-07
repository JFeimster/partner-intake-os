(function () {
  const PREFIX = "partner_intake_safe_";
  const FORBIDDEN = [
    "token", "session", "api_key", "apikey", "secret", "password", "pii",
    "lead", "borrower", "contact", "hubspot", "notion", "tally",
    "audit", "approval", "commission", "payout"
  ];
  const ALLOWED_KEYS = new Set([
    "dashboard_filters",
    "selected_tab",
    "collapsed_sidebar",
    "draft_campaign_name",
    "draft_utm_values",
    "recent_tracking_link",
    "theme_preference",
    "dismissed_ui_notices",
    "onboarding_checklist_state"
  ]);

  function assertSafeKey(key) {
    const normalized = String(key || "").toLowerCase();
    if (!ALLOWED_KEYS.has(normalized)) throw new Error("localStorage key is not allowed: " + key);
    if (FORBIDDEN.some((term) => normalized.includes(term))) throw new Error("Forbidden localStorage key: " + key);
  }

  function setSafe(key, value) {
    assertSafeKey(key);
    const payload = {
      value: value,
      saved_at: new Date().toISOString(),
      warning: "safe UX state only; do not store sensitive data"
    };
    localStorage.setItem(PREFIX + key, JSON.stringify(payload));
  }

  function getSafe(key) {
    assertSafeKey(key);
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    try { return JSON.parse(raw).value; } catch (_) { return null; }
  }

  function clearSafe() {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  }

  window.PartnerLocalStore = { setSafe, getSafe, clearSafe };
})();
