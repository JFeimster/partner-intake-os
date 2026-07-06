const fields = [
  "partner_id",
  "campaign_id",
  "destination_url",
  "source",
  "medium",
  "campaign",
  "content",
  "term",
  "notes"
];

const $ = (id) => document.getElementById(id);
let samples = [];
let currentRecord = {};

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/https?:\/\//g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 90);
}

function buildTrackingId(values) {
  const partner = slugify(values.partner_id).replace(/^ptr_/, "");
  const campaign = slugify(values.campaign).replace(/^ck_/, "");
  const content = slugify(values.content || values.medium || "link");
  return `trk_${partner}_${campaign}_${content}`.replace(/_+/g, "_");
}

function buildUrl(values, trackingId) {
  const url = new URL(values.destination_url);
  const params = {
    partner_id: values.partner_id,
    campaign_id: values.campaign_id,
    tracking_id: trackingId,
    referral_source: values.source,
    utm_source: values.source,
    utm_medium: values.medium,
    utm_campaign: values.campaign,
    utm_content: values.content,
    utm_term: values.term || ""
  };
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  return url.toString();
}

function getValues() {
  return fields.reduce((acc, field) => {
    acc[field] = $(field).value.trim();
    return acc;
  }, {});
}

function setValues(record) {
  const map = {
    partner_id: record.partner_id,
    campaign_id: record.campaign_id,
    destination_url: record.destination_url,
    source: record.source,
    medium: record.medium,
    campaign: record.campaign,
    content: record.content,
    term: record.term,
    notes: record.notes
  };
  Object.entries(map).forEach(([key, value]) => {
    if ($(key)) $(key).value = value || "";
  });
}

function render(record) {
  currentRecord = record;
  $("trackingIdPreview").textContent = record.tracking_id || "trk_pending";
  $("statusPreview").textContent = record.status || "draft";
  $("generatedUrl").value = record.generated_url || "";
  $("jsonOutput").textContent = JSON.stringify(record, null, 2);
}

function generateRecord(event) {
  if (event) event.preventDefault();
  const values = getValues();
  if (!values.destination_url.startsWith("http")) {
    alert("Destination URL must start with http:// or https://");
    return;
  }
  const trackingId = buildTrackingId(values);
  const generatedUrl = buildUrl(values, trackingId);
  const record = {
    tracking_id: trackingId,
    partner_id: values.partner_id,
    campaign_id: values.campaign_id,
    destination_url: values.destination_url,
    generated_url: generatedUrl,
    source: values.source,
    medium: values.medium,
    campaign: values.campaign,
    content: values.content,
    term: values.term,
    created_at: new Date().toISOString(),
    status: "draft",
    notes: values.notes
  };
  render(record);
}

async function copyText(text, label) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    const original = label.textContent;
    label.textContent = "Copied";
    setTimeout(() => (label.textContent = original), 1200);
  } catch (error) {
    alert("Copy failed. Select and copy manually.");
  }
}

function renderSamples() {
  const select = $("presetSelect");
  const cards = $("sampleCards");
  select.innerHTML = '<option value="">Choose a preset...</option>';
  cards.innerHTML = "";
  samples.forEach((sample, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${sample.partner_type || sample.partner_id} · ${sample.medium}`;
    select.appendChild(option);

    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <h3>${sample.partner_type || "Partner"}</h3>
      <p><strong>${sample.partner_id}</strong></p>
      <p>${sample.campaign_id}</p>
      <button type="button" data-index="${index}">Load preset</button>
    `;
    cards.appendChild(card);
  });

  cards.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => loadPreset(Number(button.dataset.index)));
  });
}

function loadPreset(index) {
  const sample = samples[index];
  if (!sample) return;
  setValues(sample);
  render(sample);
  $("presetSelect").value = String(index);
}

async function loadSamples() {
  try {
    const response = await fetch("data/sample-tracking-links.json");
    samples = await response.json();
  } catch (error) {
    samples = [];
  }
  renderSamples();
  if (samples.length) loadPreset(0);
}

$("builderForm").addEventListener("submit", generateRecord);
$("copyUrlBtn").addEventListener("click", (event) => copyText($("generatedUrl").value, event.target));
$("copyJsonBtn").addEventListener("click", (event) => copyText(JSON.stringify(currentRecord, null, 2), event.target));
$("resetBtn").addEventListener("click", () => {
  $("builderForm").reset();
  render({});
});
$("presetSelect").addEventListener("change", (event) => {
  if (event.target.value !== "") loadPreset(Number(event.target.value));
});

loadSamples();
