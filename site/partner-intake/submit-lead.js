const form = document.querySelector("#lead-form");
const output = document.querySelector("#payloadOutput");
const statusEl = document.querySelector("#formStatus");
const loadSampleBtn = document.querySelector("#loadSampleBtn");
const copyPayloadBtn = document.querySelector("#copyPayloadBtn");

const requiredFields = [
  "partner_id",
  "referral_source",
  "business_name",
  "owner_first_name",
  "owner_last_name",
  "owner_email",
  "owner_phone",
  "industry",
  "location",
  "time_in_business",
  "monthly_revenue_range",
  "requested_amount_range",
  "funding_purpose",
  "urgency"
];

function leadId() {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replaceAll("-", "");
  const rand = Math.random().toString(36).slice(2, 8);
  return `lead_${ymd}_${rand}`;
}

function serializeForm() {
  const data = new FormData(form);
  const payload = {
    lead_id: leadId(),
    partner_id: data.get("partner_id")?.trim(),
    tracking_id: data.get("tracking_id")?.trim() || null,
    campaign_id: data.get("campaign_id")?.trim() || null,
    referral_source: data.get("referral_source"),
    business_name: data.get("business_name")?.trim(),
    owner_first_name: data.get("owner_first_name")?.trim(),
    owner_last_name: data.get("owner_last_name")?.trim(),
    owner_email: data.get("owner_email")?.trim(),
    owner_phone: data.get("owner_phone")?.trim(),
    website: data.get("website")?.trim() || null,
    industry: data.get("industry"),
    location: data.get("location")?.trim(),
    time_in_business: data.get("time_in_business"),
    monthly_revenue_range: data.get("monthly_revenue_range"),
    requested_amount_range: data.get("requested_amount_range"),
    funding_purpose: data.get("funding_purpose") ? [data.get("funding_purpose")] : [],
    urgency: data.get("urgency"),
    entity_type: data.get("entity_type") || null,
    revenue_trend: data.get("revenue_trend") || null,
    bookkeeping_current: data.get("bookkeeping_current") || null,
    business_bank_account_active: data.get("business_bank_account_active") || null,
    personal_credit_band: data.get("personal_credit_band") || null,
    consent_confirmed: data.get("consent_confirmed") === "on",
    acknowledgment_confirmed: data.get("acknowledgment_confirmed") === "on",
    notes: data.get("notes")?.trim() || null,
    missing_information: [],
    submitted_at: new Date().toISOString(),
    status: "submitted",
    risk_flags: [],
    metadata: {
      source_module: "submit_lead_static_mvp",
      demo_record: true
    }
  };

  payload.missing_information = getMissingInfo(payload);
  payload.risk_flags = getRiskFlags(payload);
  payload.status = payload.missing_information.length ? "missing_info" : "submitted";

  if (!payload.consent_confirmed) {
    payload.status = "needs_review";
  }

  return payload;
}

function getMissingInfo(payload) {
  const missing = [];

  requiredFields.forEach((field) => {
    if (field === "funding_purpose") {
      if (!payload.funding_purpose.length) missing.push(field);
      return;
    }

    if (!payload[field]) missing.push(field);
  });

  if (!payload.consent_confirmed) missing.push("consent_confirmed");

  return missing;
}

function getRiskFlags(payload) {
  const flags = [];

  if (!payload.consent_confirmed) flags.push("missing_consent");
  if (!payload.owner_email || !payload.owner_phone) flags.push("missing_contact_info");
  if (!payload.industry || !payload.location || !payload.time_in_business) {
    flags.push("incomplete_business_profile");
  }
  if (payload.time_in_business === "pre_revenue") flags.push("pre_revenue");
  if (payload.time_in_business === "less_than_6_months") flags.push("very_new_business");
  if (payload.urgency === "immediate" && payload.missing_information.length) {
    flags.push("high_urgency_low_info");
  }

  return flags.length ? [...new Set(flags)] : ["none"];
}

function renderPayload(payload) {
  output.textContent = JSON.stringify(payload, null, 2);

  if (payload.status === "missing_info") {
    statusEl.textContent = "Missing info";
  } else if (payload.risk_flags.includes("missing_consent")) {
    statusEl.textContent = "Needs review";
  } else {
    statusEl.textContent = "Demo payload ready";
  }
}

function markInvalidFields() {
  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));

  requiredFields.forEach((name) => {
    const field = form.elements[name];
    if (!field) return;
    if (!field.value) field.classList.add("invalid");
  });

  if (!form.elements.consent_confirmed.checked) {
    form.elements.consent_confirmed.classList.add("invalid");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  markInvalidFields();
  const payload = serializeForm();
  renderPayload(payload);
});

form.addEventListener("reset", () => {
  setTimeout(() => {
    output.textContent = "Submit the form or load the sample lead.";
    statusEl.textContent = "Waiting for input";
    form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  }, 0);
});

loadSampleBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("./data/sample-lead-submission.json");
    if (!response.ok) throw new Error("Could not load sample JSON.");
    const sample = await response.json();
    fillForm(sample);
    renderPayload(sample);
  } catch (error) {
    output.textContent = `Sample load failed. Run with a local server, not file://.\n\n${error.message}`;
    statusEl.textContent = "Sample load failed";
  }
});

copyPayloadBtn.addEventListener("click", async () => {
  const text = output.textContent;
  if (!text || text.startsWith("Submit the form")) return;

  try {
    await navigator.clipboard.writeText(text);
    copyPayloadBtn.textContent = "Copied";
    setTimeout(() => (copyPayloadBtn.textContent = "Copy JSON"), 1200);
  } catch {
    copyPayloadBtn.textContent = "Copy failed";
    setTimeout(() => (copyPayloadBtn.textContent = "Copy JSON"), 1200);
  }
});

function fillForm(sample) {
  Object.entries(sample).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field) return;

    if (field.type === "checkbox") {
      field.checked = Boolean(value);
      return;
    }

    if (Array.isArray(value)) {
      field.value = value[0] || "";
      return;
    }

    field.value = value ?? "";
  });
}
