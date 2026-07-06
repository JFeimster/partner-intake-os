const state = {
  records: [],
  filtered: [],
  selectedId: null,
};

const els = {
  queue: document.querySelector('#queue'),
  detail: document.querySelector('#detail'),
  detailEmpty: document.querySelector('#detailEmpty'),
  cardTemplate: document.querySelector('#cardTemplate'),
  statusFilter: document.querySelector('#statusFilter'),
  riskFilter: document.querySelector('#riskFilter'),
  tierFilter: document.querySelector('#tierFilter'),
  searchBox: document.querySelector('#searchBox'),
  resetFilters: document.querySelector('#resetFilters'),
  metricTotal: document.querySelector('#metricTotal'),
  metricNeedsReview: document.querySelector('#metricNeedsReview'),
  metricHighRisk: document.querySelector('#metricHighRisk'),
  metricTierOne: document.querySelector('#metricTierOne'),
};

async function loadQueue() {
  try {
    const response = await fetch('./data/sample-review-queue.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load sample queue: ${response.status}`);
    const payload = await response.json();
    state.records = payload.records || [];
    applyFilters();
  } catch (error) {
    els.queue.innerHTML = `<p class="empty-state">${error.message}</p>`;
  }
}

function applyFilters() {
  const status = els.statusFilter.value;
  const risk = els.riskFilter.value;
  const tier = els.tierFilter.value;
  const query = els.searchBox.value.trim().toLowerCase();

  state.filtered = state.records.filter((record) => {
    const searchable = [record.display_name, record.company, record.partner_type, record.next_action, record.review_status]
      .join(' ')
      .toLowerCase();

    return (status === 'all' || record.review_status === status)
      && (risk === 'all' || record.risk_level === risk)
      && (tier === 'all' || record.partner_tier === tier)
      && (!query || searchable.includes(query));
  });

  renderMetrics();
  renderQueue();
}

function renderMetrics() {
  els.metricTotal.textContent = state.records.length;
  els.metricNeedsReview.textContent = state.records.filter((r) => r.review_status === 'needs_review').length;
  els.metricHighRisk.textContent = state.records.filter((r) => r.risk_level === 'high').length;
  els.metricTierOne.textContent = state.records.filter((r) => r.partner_tier === 'tier_1').length;
}

function renderQueue() {
  els.queue.innerHTML = '';
  if (!state.filtered.length) {
    els.queue.innerHTML = '<p class="empty-state">No records match those filters. The gremlin is quiet.</p>';
    return;
  }

  state.filtered.forEach((record) => {
    const card = els.cardTemplate.content.firstElementChild.cloneNode(true);
    card.dataset.reviewId = record.review_id;
    card.classList.toggle('active', state.selectedId === record.review_id);
    card.querySelector('.name').textContent = record.display_name;
    card.querySelector('.score').textContent = `${record.score}/100`;
    card.querySelector('.company').textContent = record.company || 'Company missing';
    card.querySelector('.next').textContent = record.next_action.replaceAll('_', ' ');
    card.querySelector('.tags').innerHTML = [
      tag(record.partner_tier),
      tag(record.review_status),
      tag(record.risk_level, record.risk_level),
      tag(record.partner_type),
    ].join('');
    card.addEventListener('click', () => selectRecord(record.review_id));
    els.queue.append(card);
  });
}

function selectRecord(reviewId) {
  state.selectedId = reviewId;
  const record = state.records.find((item) => item.review_id === reviewId);
  renderQueue();
  renderDetail(record);
}

function renderDetail(record) {
  if (!record) return;
  els.detailEmpty.classList.add('hidden');
  els.detail.classList.remove('hidden');

  const flags = record.risk_flags.length
    ? record.risk_flags.map((flag) => tag(flag, 'flag')).join('')
    : '<span class="tag low">no active risk flags</span>';

  els.detail.innerHTML = `
    <h2>${escapeHtml(record.display_name)}</h2>
    <p class="company">${escapeHtml(record.company || 'Company missing')} · ${escapeHtml(record.partner_id)}</p>
    <div class="detail-grid">
      ${kv('Review ID', record.review_id)}
      ${kv('Score', `${record.score}/100`)}
      ${kv('Tier', record.partner_tier)}
      ${kv('Risk', record.risk_level)}
      ${kv('Status', record.review_status)}
      ${kv('Partner Type', record.partner_type)}
      ${kv('Onboarding Path', record.onboarding_path)}
      ${kv('Owner', record.assigned_owner)}
    </div>
    <div class="flags-box">
      <span class="k">Risk flags</span>
      <div class="flags">${flags}</div>
    </div>
    <div class="note-box">
      <span class="k">Recommended decision</span>
      <span class="v">${escapeHtml(record.recommended_decision.replaceAll('_', ' '))}</span>
    </div>
    <div class="note-box">
      <span class="k">Next action</span>
      <span class="v">${escapeHtml(record.next_action.replaceAll('_', ' '))}</span>
    </div>
    <div class="note-box">
      <span class="k">Reviewer notes</span>
      <span class="v">${escapeHtml(record.reviewer_notes)}</span>
    </div>
    <div class="actions">
      <button class="action-btn primary" data-action="approve">Approve</button>
      <button class="action-btn" data-action="request_more_info">Request info</button>
      <button class="action-btn" data-action="watchlist">Watchlist</button>
      <button class="action-btn danger" data-action="reject">Reject</button>
      <button class="action-btn" data-action="sync_demo">Sync demo</button>
    </div>
    <p id="activity" class="activity"></p>
  `;

  els.detail.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => demoAction(record, button.dataset.action));
  });
}

function demoAction(record, action) {
  const activity = document.querySelector('#activity');
  const display = action.replaceAll('_', ' ');
  activity.textContent = `Demo only: ${display} queued for ${record.display_name}. No CRM or database was updated.`;
}

function kv(label, value) {
  return `<div><span class="k">${escapeHtml(label)}</span><span class="v">${escapeHtml(String(value).replaceAll('_', ' '))}</span></div>`;
}

function tag(text, extra = '') {
  return `<span class="tag ${extra}">${escapeHtml(String(text).replaceAll('_', ' '))}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

[els.statusFilter, els.riskFilter, els.tierFilter, els.searchBox].forEach((input) => {
  input.addEventListener('input', applyFilters);
});

els.resetFilters.addEventListener('click', () => {
  els.statusFilter.value = 'all';
  els.riskFilter.value = 'all';
  els.tierFilter.value = 'all';
  els.searchBox.value = '';
  applyFilters();
});

loadQueue();
