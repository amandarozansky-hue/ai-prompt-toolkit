// ─── STATE ────────────────────────────────────────────────────────────────
const state = { dept: 'all', cat: 'all', search: '' };

// ─── INLINE SVG ICONS ────────────────────────────────────────────────────
const ICONS = {
  grid:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
  'trend-up': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
  bag:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>`,
  building:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20"/><line x1="9" y1="22" x2="9" y2="12"/><line x1="15" y1="22" x2="15" y2="12"/><line x1="9" y1="7" x2="9.01" y2="7"/><line x1="15" y1="7" x2="15.01" y2="7"/></svg>`,
  key:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>`,
  chart:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
  search:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  briefcase:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>`,
  copy:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
  check:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  eye:        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  x:          `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  arrow:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  star:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  bookmark:   `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  sparkle:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`,
};

const DEPT_ICONS = {
  'all': 'grid', 'capital-markets': 'trend-up', 'retail-advisory': 'bag',
  'property-management': 'building', 'leasing': 'key',
  'valuation': 'chart', 'research': 'search', 'corporate': 'briefcase',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────
function esc(str) {
  return str
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function labelHTML(key) {
  const map = {
    'frequently-used': ['label-blue',   'Frequently Used'],
    'high-impact':     ['label-green',  'High Impact'],
    'under-5':         ['label-purple', 'Under 5 mins'],
  };
  const [cls, text] = map[key] || ['',''];
  return `<span class="label ${cls}">${text}</span>`;
}

const TOOL_META = {
  copilot: { label: 'Copilot',  cls: 'tool-copilot' },
  ellis:   { label: 'Ellis AI', cls: 'tool-ellis'   },
  claude:  { label: 'Claude',   cls: 'tool-claude'  },
};

function toolBadge(tool) {
  const t = TOOL_META[tool];
  if (!t) return '';
  return `<span class="tool-badge ${t.cls}">${t.label}</span>`;
}

function copyText(text, btn, origHTML) {
  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add('copied');
    btn.innerHTML = `${ICONS.check} Copied!`;
    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = origHTML; }, 2200);
  });
}

function filtered() {
  return PROMPTS.filter(p => {
    const dOk = state.dept === 'all' || p.departments.includes('all') || p.departments.includes(state.dept);
    const cOk = state.cat  === 'all' || p.category === state.cat;
    const q   = state.search.toLowerCase();
    const sOk = !q || p.title.toLowerCase().includes(q) ||
                p.prompt.toLowerCase().includes(q) ||
                (CATEGORIES.find(c => c.id === p.category)?.name.toLowerCase().includes(q));
    return dOk && cOk && sOk;
  });
}

// ─── RENDER: DEPT TABS ───────────────────────────────────────────────────
function renderDeptTabs() {
  document.getElementById('dept-tabs').innerHTML = DEPARTMENTS.map(d => `
    <button class="dept-tab${d.id === state.dept ? ' active' : ''}" onclick="setDept('${d.id}')">
      ${ICONS[DEPT_ICONS[d.id]] || ''} ${d.name}
    </button>`).join('');
}

// ─── RENDER: CAT PILLS ───────────────────────────────────────────────────
function renderCatPills() {
  const all = `<button class="cat-pill${state.cat === 'all' ? ' active' : ''}" onclick="setCat('all')">All Categories</button>`;
  const pills = CATEGORIES.map(c =>
    `<button class="cat-pill${c.id === state.cat ? ' active' : ''}" onclick="setCat('${c.id}')">${c.name}</button>`
  ).join('');
  document.getElementById('cat-pills').innerHTML = all + pills;
}

// ─── RENDER: PROMPT GRID ─────────────────────────────────────────────────
function renderGrid() {
  const list = filtered();
  const grid = document.getElementById('prompt-grid');
  const count = document.getElementById('prompt-count');

  count.textContent = `${list.length} prompt${list.length !== 1 ? 's' : ''}`;

  if (list.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${ICONS.search}</div>
        <h3>No prompts match your filters</h3>
        <p>Try a different department, category, or search term.</p>
      </div>`;
    return;
  }

  const cards = list.map((p, i) => {
    const catName  = CATEGORIES.find(c => c.id === p.category)?.name || '';
    const labels   = p.labels.map(labelHTML).join('');
    const preview  = p.prompt.replace(/\n/g,' ').slice(0, 130) + '…';
    const impact   = p.useCase ? `
      <div class="card-impact">
        ${ICONS.star}
        <span>${p.useCase.team} &mdash; ${p.useCase.result}</span>
      </div>` : '';

    return `
      <div class="prompt-card" style="animation-delay:${i * 25}ms">
        <div class="card-header">
          <div class="card-title">${p.title}</div>
          <div class="card-header-meta">
            <div class="card-category">${catName}</div>
            ${toolBadge(p.tool)}
          </div>
        </div>
        <div class="card-labels">${labels}</div>
        <div class="card-preview">${esc(preview)}</div>
        ${impact}
        <div class="card-actions">
          <button class="btn-card-copy" data-id="${p.id}" onclick="handleCardCopy(event,${p.id})">
            ${ICONS.copy} Copy Prompt
          </button>
          <button class="btn-card-save" data-save-id="${p.id}" onclick="saveFromCatalogue(${p.id})" title="Save prompt">
            ${ICONS.bookmark}
          </button>
          <button class="btn-card-view" onclick="openModal(${p.id})">
            ${ICONS.eye} View
          </button>
        </div>
      </div>`;
  }).join('');

  const comingSoon = state.dept !== 'all' ? `
    <div class="coming-soon-tile">
      <div class="coming-soon-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      </div>
      <div class="coming-soon-body">
        <div class="coming-soon-title">Full prompt library coming soon</div>
        <div class="coming-soon-sub">Content is being finalised with the CBRE team. Additional task guides, worked examples, and role-specific prompts will be added here shortly.</div>
      </div>
      <div class="coming-soon-badge">In progress</div>
    </div>` : '';

  grid.innerHTML = cards + comingSoon;
}

// ─── COPY FROM CARD ──────────────────────────────────────────────────────
function handleCardCopy(e, id) {
  const p = PROMPTS.find(x => x.id === id);
  if (!p) return;
  const btn = e.currentTarget;
  copyText(p.prompt, btn, `${ICONS.copy} Copy Prompt`);
}

// ─── MODAL ────────────────────────────────────────────────────────────────
function openModal(id) {
  const p = PROMPTS.find(x => x.id === id);
  if (!p) return;

  const overlay = document.getElementById('modal-overlay');

  if (p.detail) {
    overlay.innerHTML = buildDetailModal(p, id);
  } else {
    overlay.innerHTML = buildStandardModal(p, id);
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';

  // re-attach backdrop-click listener after innerHTML replace
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
}

function buildStandardModal(p, id) {
  const catName = CATEGORIES.find(c => c.id === p.category)?.name || '';
  const labels  = p.labels.map(labelHTML).join('');
  const impactBlock = p.useCase ? `
    <div class="modal-impact">
      <div class="modal-impact-header">${ICONS.star} Real-world impact</div>
      <div class="modal-impact-grid">
        <div><div class="modal-impact-item-label">Team</div><div class="modal-impact-item-value">${p.useCase.team}</div></div>
        <div><div class="modal-impact-item-label">Task</div><div class="modal-impact-item-value">${p.useCase.task}</div></div>
        <div><div class="modal-impact-item-label">Result</div><div class="modal-impact-item-value">${p.useCase.result}</div></div>
      </div>
    </div>` : '';

  return `<div class="modal" role="dialog" aria-modal="true">
    <div id="modal-content">
      <div class="modal-top">
        <div class="modal-top-left">
          <div class="modal-title">${p.title}</div>
          <div class="modal-top-meta">
            <div class="modal-cat">${catName}</div>
            ${toolBadge(p.tool)}
          </div>
        </div>
        <button class="modal-close" onclick="closeModal()">${ICONS.x}</button>
      </div>
      <div class="modal-body">
        <div class="modal-labels">${labels}</div>
        ${impactBlock}
        <div class="modal-prompt-label">Prompt</div>
        <div class="modal-prompt-box">${esc(p.prompt)}</div>
        <div class="modal-actions">
          <button class="modal-btn-copy" id="modal-copy-btn" onclick="handleModalCopy(${id})">
            ${ICONS.copy} Copy Prompt
          </button>
          <button class="modal-btn-save" onclick="saveFromCatalogue(${id})">
            ${ICONS.bookmark} Save
          </button>
        </div>
      </div>
    </div>
  </div>`;
}

function buildDetailModal(p, id) {
  const d       = p.detail;
  const catName = CATEGORIES.find(c => c.id === p.category)?.name || '';
  const dept    = DEPARTMENTS.find(dep => p.departments.includes(dep.id) && dep.id !== 'all');

  const whenItems = d.whenToUse.map(w =>
    `<li><div class="dm-when-dot"></div>${w}</li>`
  ).join('');

  const tipItems = d.tips.map((t, i) =>
    `<div class="dm-tip">
      <div class="dm-tip-num">${i + 1}</div>
      <div><strong>${t.title}.</strong> ${t.body}</div>
    </div>`
  ).join('');

  return `<div class="modal modal-detail" role="dialog" aria-modal="true">
    <!-- sticky header -->
    <div class="modal-top dm-top">
      <div class="modal-top-left">
        <div class="dm-breadcrumb">${dept ? dept.name : ''} &rsaquo; ${catName}</div>
        <div class="modal-title">${p.title}</div>
        <div class="modal-top-meta">
          ${toolBadge(p.tool)}
          <span class="dm-time-pill">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Saves ~${d.timeSaved}
          </span>
          <span class="dm-sample-pill">Sample detail view</span>
        </div>
      </div>
      <button class="modal-close" onclick="closeModal()">${ICONS.x}</button>
    </div>

    <!-- two-column body -->
    <div class="dm-grid">

      <!-- LEFT -->
      <div class="dm-col dm-col-left">

        <div class="dm-section">
          <div class="dm-section-label">${ICONS.copy} The Prompt</div>
          <div class="dm-prompt-box">${esc(p.prompt)}</div>
          <button class="modal-btn-copy dm-copy-btn" id="modal-copy-btn" onclick="handleModalCopy(${id})">
            ${ICONS.copy} Copy Prompt
          </button>
        </div>

        <div class="dm-section">
          <div class="dm-section-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            When to use this
          </div>
          <ul class="dm-when-list">${whenItems}</ul>
        </div>

        <div class="dm-section">
          <div class="dm-section-label">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 017 7c0 2.5-1.3 4.7-3.3 6l-.7.5V17H9v-1.5l-.7-.5A7 7 0 0112 2z"/></svg>
            Tips for better results
          </div>
          <div class="dm-tips">${tipItems}</div>
        </div>

      </div>

      <!-- RIGHT -->
      <div class="dm-col dm-col-right">

        <div class="dm-time-block">
          <div class="dm-time-value">${d.timeSaved}</div>
          <div class="dm-time-text">${d.timeSavedContext}</div>
        </div>

        <div class="dm-output-card">
          <div class="dm-output-header">
            <span class="dm-output-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="13" height="13"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Example Output
            </span>
            <span class="dm-output-badge">Illustrative only</span>
          </div>
          <div class="dm-output-body">
            <div class="dm-doc-title">Investment Memorandum</div>
            <div class="dm-doc-meta">Meridian Business Park, Unit 4A &middot; Manchester, UK &middot; Draft for review</div>
            <div class="dm-kv-grid">
              <div class="dm-kv"><div class="dm-kv-label">Asking Price</div><div class="dm-kv-value">£42.5m</div></div>
              <div class="dm-kv"><div class="dm-kv-label">Net Initial Yield</div><div class="dm-kv-value">5.25%</div></div>
              <div class="dm-kv"><div class="dm-kv-label">Occupancy</div><div class="dm-kv-value">100%</div></div>
              <div class="dm-kv"><div class="dm-kv-label">NOI p.a.</div><div class="dm-kv-value">£2.23m</div></div>
              <div class="dm-kv"><div class="dm-kv-label">Lease Expiry</div><div class="dm-kv-value">2031</div></div>
              <div class="dm-kv"><div class="dm-kv-label">5-yr IRR</div><div class="dm-kv-value">8.4%</div></div>
            </div>
            <div class="dm-output-section">
              <div class="dm-output-section-title">1. Executive Overview</div>
              <p>Meridian Business Park presents a compelling core logistics acquisition with an institutional-grade tenant covenant and a net initial yield of 5.25% — 25 bps above comparable prime logistics assets in the region. The 7-year unexpired lease provides income security while the Manchester Airport Corridor location positions the asset for above-average rental growth.</p>
            </div>
            <div class="dm-output-section">
              <div class="dm-output-section-title">2. Market Context</div>
              <p>Greater Manchester logistics continues to outperform the UK average, driven by e-commerce demand and constrained Grade A supply. Corridor vacancy stands at 2.3%; rents have grown 12% over 24 months. Six transactions above £30m completed in the sub-market in H1 2025.</p>
            </div>
            <div class="dm-output-section">
              <div class="dm-output-section-title">3. Asset Quality &amp; Risk Factors</div>
              <p>Refurbished 2021 to EPC A. Roof solar generates c.£180k annual savings. <strong>Key risk:</strong> single-tenant concentration and lease event in 2031, mitigated by 15-year operational history and recent tenant capex.</p>
            </div>
            <div class="dm-output-section">
              <div class="dm-output-section-title">4. Financial Summary</div>
              <table class="dm-table">
                <tr><td>Asking Price</td><td>£42,500,000</td></tr>
                <tr><td>Net Initial Yield</td><td>5.25%</td></tr>
                <tr><td>Reversionary Yield</td><td>5.75%</td></tr>
                <tr><td>Annual NOI</td><td>£2,231,250</td></tr>
                <tr><td>5-yr IRR (base case)</td><td>8.4%</td></tr>
              </table>
            </div>
            <div class="dm-output-section">
              <div class="dm-output-section-title">5. Recommended Position</div>
              <p>Proceed to due diligence at asking price. Strong fit for a core/core-plus mandate. Recommend commissioning a re-letting feasibility study as part of DD to address the 2031 lease event.</p>
              <p class="dm-assumption">Assumptions: 5-yr hold &middot; 10 bps yield compression &middot; 3% p.a. rental growth &middot; 5% exit costs.</p>
            </div>
            <div class="dm-disclaimer">⚠ AI-generated draft — verify all figures and market data before use.</div>
          </div>
        </div>

      </div>
    </div>
  </div>`;
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function handleModalCopy(id) {
  const p   = PROMPTS.find(x => x.id === id);
  const btn = document.getElementById('modal-copy-btn');
  if (p && btn) copyText(p.prompt, btn, `${ICONS.copy} Copy Prompt`);
}

// ─── FILTERS ─────────────────────────────────────────────────────────────
function setDept(id) {
  state.dept = id;
  renderDeptTabs();
  renderGrid();
}

function setCat(id) {
  state.cat = id;
  renderCatPills();
  renderGrid();
}

// ─── USE CASES ────────────────────────────────────────────────────────────
function renderUseCases() {
  document.getElementById('cases-grid').innerHTML = USE_CASES.map(c => `
    <div class="case-card" onclick="openModal(${c.promptId})">
      <div>
        <div class="case-metric">${c.metric}</div>
        <div class="case-metric-sub">${c.metricLabel}</div>
      </div>
      <div class="case-dept-tag">${c.team}</div>
      <div class="case-task">${c.task}</div>
      <div class="case-detail">${c.detail}</div>
      <span class="case-cta">Open prompt ${ICONS.arrow}</span>
    </div>`).join('');
}

// ─── SCROLL ANIMATIONS ───────────────────────────────────────────────────
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── NAV SCROLL SHADOW + ACTIVE SECTION ─────────────────────────────────
function initNav() {
  const nav = document.getElementById('nav');

  function updateNav() {
    const scrollY = window.scrollY;
    nav.classList.toggle('scrolled', scrollY > 10);

    // find the section whose top is at or above the middle of the viewport
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a[href^="#"]');
    const mid      = scrollY + window.innerHeight * 0.35;

    let current = '';
    sections.forEach(s => { if (s.offsetTop <= mid) current = s.id; });

    links.forEach(l => {
      const active = l.getAttribute('href') === '#' + current;
      l.classList.toggle('active', active);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

// ─── INIT ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDeptTabs();
  renderCatPills();
  renderGrid();
  renderUseCases();
  initScrollReveal();
  initNav();

  // Update hero stat to reflect real prompt count
  const el = document.getElementById('stat-prompts');
  if (el) el.textContent = PROMPTS.length;

  // Search
  document.getElementById('search-input').addEventListener('input', e => {
    state.search = e.target.value;
    renderGrid();
  });

  // Modal close: backdrop click + ESC
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});
