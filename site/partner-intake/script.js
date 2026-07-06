const DATA_FILES = {
  profile: "data/sample-partner-profile.json",
  onboarding: "data/sample-onboarding-plan.json",
  resources: "data/sample-resource-recommendations.json",
  campaigns: "data/sample-campaign-recommendations.json",
  admin: "data/sample-admin-review-card.json"
};

const $ = (selector) => document.querySelector(selector);

function titleCase(value = "") {
  return String(value)
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatScore(value) {
  if (value === undefined || value === null || Number.isNaN(Number(value))) return "—";
  return `${Number(value)}/100`;
}

function safeText(value, fallback = "—") {
  if (Array.isArray(value)) return value.length ? value.join(", ") : fallback;
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Unable to load ${path}: ${response.status}`);
  }
  return response.json();
}

function createDetail(label, value) {
  const wrapper = document.createElement("div");
  const dt = document.createElement("dt");
  const dd = document.createElement("dd");
  dt.textContent = label;
  dd.textContent = safeText(value);
  wrapper.append(dt, dd);
  return wrapper;
}

function renderPartnerProfile(profile) {
  const partner = profile.partner || {};
  const scorecard = profile.scorecard || {};

  $("#partner-title").textContent = safeText(partner.display_name, "Unknown partner");
  $("#partnerStatus").textContent = titleCase(partner.status || "pending review");
  $("#heroTier").textContent = titleCase(partner.partner_tier || "—");
  $("#heroRisk").textContent = titleCase(partner.risk_level || "—");
  $("#heroScore").textContent = formatScore(scorecard.overall_score);
  $("#nextAction").textContent = safeText(partner.next_action, "Review partner record and assign next action.");
  $("#onboardingPath").textContent = titleCase(partner.onboarding_path || "review");

  const details = $("#partnerDetails");
  details.replaceChildren(
    createDetail("Company", partner.company),
    createDetail("Partner type", titleCase(partner.partner_type)),
    createDetail("Primary audience", titleCase(partner.primary_audience)),
    createDetail("Secondary audiences", partner.secondary_audiences),
    createDetail("Lead source", partner.lead_source),
    createDetail("Created", partner.created_at)
  );

  renderScorecard(scorecard);
}

function renderScorecard(scorecard) {
  const scores = [
    ["Urgency", scorecard.urgency_score],
    ["Audience fit", scorecard.audience_fit_score],
    ["Trust", scorecard.trust_score],
    ["Revenue potential", scorecard.revenue_potential_score],
    ["Activation speed", scorecard.activation_speed_score],
    ["Strategic value", scorecard.strategic_value_score],
    ["Compliance safety", scorecard.compliance_safety_score]
  ];

  const list = $("#scorecardList");
  list.replaceChildren();

  scores.forEach(([label, rawScore]) => {
    const score = Math.max(0, Math.min(100, Number(rawScore || 0)));
    const row = document.createElement("div");
    row.className = "score-row";
    row.innerHTML = `
      <div class="score-label"><span>${label}</span><strong>${score}</strong></div>
      <div class="score-bar" aria-label="${label} score ${score} out of 100"><span style="width: ${score}%"></span></div>
    `;
    list.append(row);
  });
}

function renderOnboarding(onboarding) {
  const preview = $("#timelinePreview");
  const phases = [
    ["First 24 hours", onboarding.first_24_hours],
    ["First 7 days", onboarding.first_7_days],
    ["First 30 days", onboarding.first_30_days]
  ];

  preview.replaceChildren();
  phases.forEach(([label, items]) => {
    const item = document.createElement("div");
    item.className = "timeline-item";
    const firstItem = Array.isArray(items) ? items[0] : items;
    item.innerHTML = `<span>${label}</span><p>${safeText(firstItem, "No task assigned yet.")}</p>`;
    preview.append(item);
  });
}

function renderResources(resourcesPayload) {
  const resources = resourcesPayload.resources || [];
  const grid = $("#resourceGrid");
  $("#resourceCount").textContent = `${resources.length} assets`;
  grid.replaceChildren();

  resources.forEach((resource) => {
    const card = document.createElement("article");
    card.className = "resource-item";
    card.innerHTML = `
      <h4>${safeText(resource.title)}</h4>
      <p>${safeText(resource.description)}</p>
      <div class="card-meta">
        <span>${safeText(resource.resource_type)}</span>
        <span>${titleCase(resource.priority || "standard")}</span>
        <span>${safeText(resource.cta, "Send resource")}</span>
      </div>
    `;
    grid.append(card);
  });
}

function renderCampaigns(campaignsPayload) {
  const campaigns = campaignsPayload.campaigns || [];
  const list = $("#campaignList");
  $("#campaignCount").textContent = `${campaigns.length} kits`;
  list.replaceChildren();

  campaigns.forEach((campaign) => {
    const card = document.createElement("article");
    card.className = "campaign-item";
    card.innerHTML = `
      <h4>${safeText(campaign.title)}</h4>
      <p>${safeText(campaign.offer)}</p>
      <div class="card-meta">
        <span>${safeText(campaign.audience)}</span>
        <span>${safeText(campaign.cta)}</span>
        <span>${safeText(campaign.status)}</span>
      </div>
    `;
    list.append(card);
  });
}

function renderAdmin(admin) {
  $("#manualReview").textContent = admin.manual_review_required ? "Manual review" : "Auto-ready";
  $("#adminSummary").textContent = safeText(admin.summary);

  const riskList = $("#riskFlags");
  const flags = admin.risk_flags?.length ? admin.risk_flags : ["No major flags in sample record"];
  riskList.replaceChildren(...flags.map((flag) => {
    const li = document.createElement("li");
    li.textContent = flag;
    return li;
  }));

  const details = $("#adminDetails");
  details.replaceChildren(
    createDetail("Recommended decision", titleCase(admin.recommended_decision)),
    createDetail("Next action", admin.next_action),
    createDetail("Reviewer notes", admin.reviewer_notes)
  );
}

async function bootDashboard() {
  try {
    const [profile, onboarding, resources, campaigns, admin] = await Promise.all([
      fetchJson(DATA_FILES.profile),
      fetchJson(DATA_FILES.onboarding),
      fetchJson(DATA_FILES.resources),
      fetchJson(DATA_FILES.campaigns),
      fetchJson(DATA_FILES.admin)
    ]);

    renderPartnerProfile(profile);
    renderOnboarding(onboarding);
    renderResources(resources);
    renderCampaigns(campaigns);
    renderAdmin(admin);

    $("#dataStatus").textContent = "Sample data loaded";
  } catch (error) {
    console.error(error);
    $("#dataStatus").textContent = "Run local server to load JSON";
    $("#apiStatus").textContent = "Local file mode issue";
    $("#nextAction").textContent = "Start a local web server with: python -m http.server 8080";
  }
}

document.addEventListener("DOMContentLoaded", bootDashboard);
