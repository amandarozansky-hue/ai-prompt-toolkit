// ─── SAVED PROMPTS (localStorage) ──────────────────────────────────────────
const SAVED_KEY = 'ai-toolkit-saved';

function getSaved() {
  try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); }
  catch(e) { return []; }
}
function setSaved(arr) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(arr));
  _updateSavedBadge();
}
function isPromptSaved(sourceId) {
  return getSaved().some(p => p.source === 'catalogue' && p.sourceId === sourceId);
}

function savePrompt(title, text, source, sourceId = null, dept = 'my-prompts', category = null) {
  const arr = getSaved();
  if (source === 'catalogue' && arr.some(p => p.source === 'catalogue' && p.sourceId === sourceId)) return;
  arr.unshift({ id: Date.now(), title, text, source, sourceId, dept, category, savedAt: Date.now() });
  setSaved(arr);
  if (document.getElementById('tool-saved')?.classList.contains('active')) renderSavedPanel();
}

function deleteSaved(savedId) {
  const record = getSaved().find(p => p.id === savedId);
  setSaved(getSaved().filter(p => p.id !== savedId));
  // reset bookmark on the visible card if it was a catalogue prompt
  if (record?.source === 'catalogue' && record?.sourceId) {
    const btn = document.querySelector(`[data-save-id="${record.sourceId}"]`);
    if (btn) { btn.classList.remove('saved'); btn.innerHTML = ICONS.bookmark; btn.title = 'Save prompt'; }
  }
  renderSavedPanel();
}
function _updateSavedBadge() {
  const count = getSaved().length;
  const el = document.getElementById('saved-tab-badge');
  if (!el) return;
  el.textContent = count;
  el.style.display = count > 0 ? 'inline-flex' : 'none';
}

function saveFromCatalogue(promptId) {
  const p = PROMPTS.find(x => x.id === promptId);
  if (!p) return;
  const btn = document.querySelector(`[data-save-id="${promptId}"]`);

  if (isPromptSaved(promptId)) {
    // unsave
    const record = getSaved().find(s => s.source === 'catalogue' && s.sourceId === promptId);
    if (record) deleteSaved(record.id);
    if (btn) { btn.classList.remove('saved'); btn.innerHTML = ICONS.bookmark; btn.title = 'Save prompt'; }
  } else {
    // Determine dept to file under:
    // prefer the currently-viewed dept tab, fall back to prompt's own dept, then 'general'
    const currentDept   = (typeof state !== 'undefined' && state.dept !== 'all') ? state.dept : null;
    const specificDepts = (p.departments || []).filter(d => d !== 'all');
    let dept;
    if (currentDept && (specificDepts.length === 0 || specificDepts.includes(currentDept))) {
      dept = currentDept;                        // viewed dept wins
    } else if (specificDepts.length > 0) {
      dept = specificDepts[0];                   // use prompt's own dept
    } else {
      dept = 'general';
    }
    const category = p.category || null;
    savePrompt(p.title, p.prompt, 'catalogue', promptId, dept, category);
    if (btn) { btn.classList.add('saved'); btn.innerHTML = ICONS['bookmark-fill']; btn.title = 'Unsave'; }
  }
}

// ─── TOOLS TABS ────────────────────────────────────────────────────────────
function switchToolsTab(tab) {
  document.querySelectorAll('.tools-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.querySelectorAll('.tools-panel').forEach(p => p.classList.toggle('active', p.id === `tool-${tab}`));
  if (tab === 'saved') renderSavedPanel();
}

// ─── DOMAIN DETECTION ──────────────────────────────────────────────────────
const DOMAINS = [
  { pats: ['invest', 'irr', 'yield', 'acquisition', 'capital market'], role: 'senior real estate investment analyst' },
  { pats: ['lease', 'tenant', 'landlord', 'rent', 'vacancy', 'letting'], role: 'commercial leasing specialist' },
  { pats: ['valuation', 'appraisal', 'comparable', 'cap rate', 'red book'], role: 'certified property valuation expert' },
  { pats: ['property management', 'maintenance', 'service charge', 'facilities'], role: 'property management professional' },
  { pats: ['retail', 'footfall', 'store', 'catchment'], role: 'retail property advisor' },
  { pats: ['research', 'market data', 'trend', 'forecast'], role: 'real estate research analyst' },
  { pats: ['proposal', 'pitch', 'presentation', 'tender'], role: 'senior client advisory specialist' },
  { pats: ['email', 'write', 'draft', 'letter', 'communicate'], role: 'professional business writer' },
  { pats: ['code', 'develop', 'script', 'automate', 'program'], role: 'senior software engineer' },
  { pats: ['strategy', 'plan', 'roadmap', 'initiative'], role: 'strategic business consultant' },
  { pats: ['legal', 'contract', 'clause', 'agreement'], role: 'specialist real estate legal advisor' },
  { pats: ['financ', 'cashflow', 'cash flow', 'budget', 'model'], role: 'real estate financial analyst' },
  { pats: ['intern', 'career', 'job', 'interview', 'cv', 'resume'], role: 'executive career coach' },
  { pats: ['marketing', 'brand', 'campaign', 'content'], role: 'marketing strategist' },
  { pats: ['data', 'analytics', 'dashboard', 'metric', 'kpi'], role: 'data analytics specialist' },
];

function detectRole(text) {
  const lower = text.toLowerCase();
  for (const d of DOMAINS) {
    if (d.pats.some(p => lower.includes(p))) return d.role;
  }
  return 'expert professional';
}

// ─── OPTIMIZER ─────────────────────────────────────────────────────────────
function runOptimizer() {
  const raw = (document.getElementById('opt-input').value || '').trim();
  const out = document.getElementById('opt-output');
  if (!raw) {
    showOptEmptyState(out, 'Paste a prompt above, then click Optimize.');
    return;
  }
  const { improved, improvements } = applyOptimizations(raw);
  renderOptOut(out, improved, improvements);
}

function applyOptimizations(raw) {
  const improvements = [];
  let improved = raw.trim();
  const lower = raw.toLowerCase();
  const words = raw.split(/\s+/).filter(Boolean).length;

  // 1. Add role if missing
  if (!/^(act as|you are|as a|imagine you|assume the role|pretend)/i.test(improved)) {
    const role = detectRole(improved);
    improved = `Act as a ${role}.\n\n${improved}`;
    improvements.push({ label: 'Role added', cls: 'label-green', tip: `Added: "Act as a ${role}"` });
  }

  // 2. Specify output format if missing
  if (!/\b(format|structure|bullet|numbered|list|table|header|section|outline|step|markdown)\b/i.test(lower)) {
    improved += '\n\nStructure your response with clear headings and bullet points where appropriate.';
    improvements.push({ label: 'Format specified', cls: 'label-blue', tip: 'Requested structured, scannable output' });
  }

  // 3. Request depth for short prompts
  if (words < 20) {
    improved += ' Be specific, detailed, and professional-grade.';
    improvements.push({ label: 'Depth requested', cls: 'label-purple', tip: 'Asked for detailed expert output' });
  }

  // 4. Anchor to professional context for short generic prompts
  if (words < 40 && !/\b(for|about|regarding)\b.{0,50}\b(team|client|project|property|company|deal)\b/i.test(lower)) {
    improved += '\n\nApply industry best practices and professional standards. Flag any assumptions made.';
    improvements.push({ label: 'Context anchored', cls: 'label-amber', tip: 'Anchored to professional standards' });
  }

  if (improvements.length === 0) {
    improvements.push({ label: 'Well-formed', cls: 'label-green', tip: 'Prompt already has strong structure — minor polish only' });
    improved += '\n\n[Tip: Add specific context in [brackets] to further tailor the output.]';
  }

  return { improved, improvements };
}

function renderOptOut(container, improved, improvements) {
  const chips = improvements.map(i =>
    `<span class="label ${i.cls}" title="${esc(i.tip)}">${i.label}</span>`
  ).join('');

  container.innerHTML = `
    <div class="opt-result">
      <div class="opt-result-meta">
        <div class="opt-meta-label">Improvements made</div>
        <div class="opt-chips">${chips}</div>
      </div>
      <div class="opt-result-body">
        <div class="opt-body-label">Optimized Prompt</div>
        <div class="opt-prompt-box">${esc(improved)}</div>
        <div class="opt-actions">
          <button class="btn btn-dark opt-btn" id="opt-copy-btn" onclick="copyOptimized()">
            ${ICONS.copy} Copy
          </button>
          <button class="btn btn-ghost opt-btn" id="opt-save-btn" onclick="saveOptimized()">
            ${ICONS.bookmark} Save
          </button>
        </div>
      </div>
    </div>`;
  container._text = improved;
}

function showOptEmptyState(container, msg) {
  container.innerHTML = `
    <div class="opt-empty-state">
      <div class="opt-empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" width="26" height="26">
          <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
        </svg>
      </div>
      <p>${msg}</p>
    </div>`;
}

function copyOptimized() {
  const container = document.getElementById('opt-output');
  const btn = document.getElementById('opt-copy-btn');
  if (container._text && btn) copyText(container._text, btn, `${ICONS.copy} Copy`);
}

function saveOptimized() {
  const container = document.getElementById('opt-output');
  if (!container._text) return;
  const raw = (document.getElementById('opt-input').value || '').trim();
  const title = 'Optimized: ' + raw.split(/[\n.!?]/)[0].slice(0, 55).trim() + (raw.length > 55 ? '…' : '');
  savePrompt(title, container._text, 'optimizer');
  const btn = document.getElementById('opt-save-btn');
  if (btn) {
    const orig = btn.innerHTML;
    btn.classList.remove('btn-ghost');
    btn.classList.add('btn-accent');
    btn.innerHTML = `${ICONS.check} Saved`;
    setTimeout(() => {
      btn.classList.remove('btn-accent');
      btn.classList.add('btn-ghost');
      btn.innerHTML = orig;
    }, 2200);
  }
}

// ─── GOAL SUGGESTIONS ──────────────────────────────────────────────────────
const GOAL_SUGGESTIONS = [
  { label: 'Write an investment memo',         group: 'Capital Markets' },
  { label: 'Pitch a property to a client',     group: 'Client Relations' },
  { label: 'Analyse a local market',           group: 'Research' },
  { label: 'Draft a lease summary',            group: 'Leasing' },
  { label: 'Build a financial model',          group: 'Valuation' },
  { label: 'Prepare a board presentation',     group: 'Corporate' },
  { label: 'Negotiate a lease renewal',        group: 'Leasing' },
  { label: 'Write an executive summary',       group: 'Writing' },
  { label: 'Create a due diligence checklist', group: 'Capital Markets' },
  { label: 'Onboard a new client',             group: 'Client Relations' },
  { label: 'Forecast rental growth',           group: 'Research' },
  { label: 'Improve my email writing',         group: 'Writing' },
  { label: 'Get a promotion at work',          group: 'Career' },
  { label: 'Plan a property refurbishment',    group: 'Property Mgmt' },
  { label: 'Summarise a long report',          group: 'Writing' },
  { label: 'Prepare for a client meeting',     group: 'Client Relations' },
];

function renderGoalSuggestions() {
  const container = document.getElementById('gen-suggestion-pills');
  if (!container) return;
  container.innerHTML = GOAL_SUGGESTIONS.map((s, i) =>
    `<button class="gen-suggestion-pill" onclick="pickGoal(${i})">${s.label}</button>`
  ).join('');
}

function pickGoal(i) {
  const input = document.getElementById('gen-input');
  if (!input) return;
  input.value = GOAL_SUGGESTIONS[i].label;
  // highlight active pill
  document.querySelectorAll('.gen-suggestion-pill').forEach((el, idx) => {
    el.classList.toggle('active', idx === i);
  });
  runGenerator();
  // scroll generated cards into view smoothly
  setTimeout(() => {
    document.getElementById('gen-output')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);
}

// ─── GENERATOR ─────────────────────────────────────────────────────────────
const GEN_ANGLES = [
  {
    label: 'Research & Understand', cls: 'label-blue',
    build: (g, r) => `Act as a ${r}.\n\nI want to ${g}.\n\nBefore I begin, give me a comprehensive briefing:\n1. Key concepts and terminology I need to know\n2. The current landscape and context\n3. The most important success factors\n4. What I should have in place before getting started\n\nBe specific and practical — I'm a professional who needs to act quickly.`,
  },
  {
    label: 'Action Plan', cls: 'label-green',
    build: (g, r) => `Act as a ${r}.\n\nCreate a detailed, phased action plan to help me ${g}:\n\n**Phase 1 — Immediate (Days 1–7):**\n**Phase 2 — Near-term (Weeks 2–4):**\n**Phase 3 — Medium-term (Months 2–3):**\n\nFor each action: what to do, why it matters, and what success looks like. Be specific — no generic advice.`,
  },
  {
    label: 'Expert Perspective', cls: 'label-amber',
    build: (g, r) => `Act as a ${r} with 20 years of experience.\n\nI want to ${g}.\n\nGive me:\n1. Your 5 most important pieces of advice — specific, not generic\n2. The most common mistake professionals make here and exactly why it happens\n3. Your single top recommendation based on experience\n\nBe direct. I need real insight, not textbook guidance.`,
  },
  {
    label: 'Mistakes to Avoid', cls: 'label-purple',
    build: (g, r) => `Act as a ${r}.\n\nWhat are the non-obvious mistakes professionals make when trying to ${g}?\n\nFor each:\n- What it looks like in practice\n- The root cause\n- The real consequence if uncorrected\n- Exactly how to avoid it\n\nFocus on mistakes that aren't immediately obvious — not the basics everyone already knows.`,
  },
  {
    label: 'Ready-to-Use Template', cls: 'label-ink',
    build: (g, r) => `Act as a ${r}.\n\nCreate a professional, ready-to-use template to help me ${g}.\n\nInclude:\n- Clear structure with appropriate headings\n- Placeholder text in [BRACKETS] for sections I customise\n- A brief note on what makes each section effective\n- Any standard language or formats that apply\n\nMake it client-ready from the first use.`,
  },
  {
    label: 'Gap Analysis', cls: 'label-green',
    build: (g, r) => `Act as a ${r}.\n\nHelp me honestly assess where I stand in relation to ${g}.\n\nProvide:\n1. What "success" looks like at each stage\n2. Five diagnostic questions to identify my gaps\n3. How to prioritise which gaps to close first and why\n4. Concrete next steps for where most professionals are at this stage\n\nBe direct — I need honest assessment, not reassurance.`,
  },
];

let _genData = [];

function runGenerator() {
  const goal = (document.getElementById('gen-input').value || '').trim();
  const container = document.getElementById('gen-output');
  if (!goal) { container.innerHTML = ''; return; }

  const role = detectRole(goal);
  _genData = GEN_ANGLES.map(a => ({ label: a.label, cls: a.cls, text: a.build(goal, role) }));

  container.innerHTML = _genData.map((item, i) => {
    const preview = item.text.replace(/\n/g, ' ').replace(/\*\*/g, '').slice(0, 115) + '…';
    return `
      <div class="gen-card" style="animation-delay:${i * 60}ms" onclick="openGenModal(${i})">
        <div class="gen-card-top">
          <span class="label ${item.cls}">${item.label}</span>
          <span class="gen-card-view-hint">${ICONS.eye} View</span>
        </div>
        <div class="gen-card-preview">${esc(preview)}</div>
        <div class="gen-card-actions">
          <button class="btn-card-copy" onclick="event.stopPropagation();copyGen(this, ${i})">${ICONS.copy} Copy</button>
          <button class="btn-card-view" onclick="event.stopPropagation();saveGen(this, ${i})">${ICONS.bookmark} Save</button>
        </div>
      </div>`;
  }).join('');
}

function copyGen(btn, i) {
  if (_genData[i]) copyText(_genData[i].text, btn, `${ICONS.copy} Copy`);
}

function saveGen(btn, i) {
  if (!_genData[i]) return;
  const goal = (document.getElementById('gen-input').value || '').trim().slice(0, 48);
  savePrompt(`${_genData[i].label}: ${goal}`, _genData[i].text, 'generator');
  const orig = btn.innerHTML;
  btn.classList.add('copied');
  btn.innerHTML = `${ICONS.check} Saved`;
  setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = orig; }, 2200);
}

// ─── GEN MODAL ─────────────────────────────────────────────────────────────
function openGenModal(i) {
  const item = _genData[i];
  if (!item) return;
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
      <div class="modal-top">
        <div class="modal-top-left">
          <div style="margin-bottom:.5rem"><span class="label ${item.cls}">${item.label}</span></div>
          <div class="modal-title">Generated Prompt</div>
        </div>
        <button class="modal-close" onclick="closeModal()">${ICONS.x}</button>
      </div>
      <div class="modal-body">
        <div class="modal-prompt-label">Full Prompt</div>
        <div class="modal-prompt-box">${esc(item.text)}</div>
        <div class="modal-actions">
          <button class="modal-btn-copy" id="modal-copy-btn" onclick="copyGenFromModal(${i})">
            ${ICONS.copy} Copy Prompt
          </button>
          <button class="modal-btn-save" onclick="saveGenFromModal(${i}, this)">
            ${ICONS.bookmark} Save
          </button>
        </div>
      </div>
    </div>`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
}

function copyGenFromModal(i) {
  const item = _genData[i];
  const btn = document.getElementById('modal-copy-btn');
  if (item && btn) copyText(item.text, btn, `${ICONS.copy} Copy Prompt`);
}

function saveGenFromModal(i, btn) {
  if (!_genData[i]) return;
  const goal = (document.getElementById('gen-input').value || '').trim().slice(0, 48);
  savePrompt(`${_genData[i].label}: ${goal}`, _genData[i].text, 'generator');
  const orig = btn.innerHTML;
  btn.classList.remove('modal-btn-save');
  btn.classList.add('modal-btn-copy');
  btn.style.background = 'var(--accent)';
  btn.innerHTML = `${ICONS.check} Saved`;
  setTimeout(() => {
    btn.style.background = '';
    btn.classList.remove('modal-btn-copy');
    btn.classList.add('modal-btn-save');
    btn.innerHTML = orig;
  }, 2200);
}

// ─── SAVED PANEL ───────────────────────────────────────────────────────────
const SRC_META = {
  catalogue: { label: 'Prompt Kit', cls: 'tool-copilot' },
  optimizer: { label: 'Optimizer',  cls: 'tool-claude'  },
  generator: { label: 'Generator',  cls: 'tool-ellis'   },
};

let _dragSavedId = null;

function renderSavedPanel() {
  const all  = getSaved();
  const container = document.getElementById('saved-panel-content');
  if (!container) return;

  if (!all.length) {
    container.innerHTML = `
      <div class="saved-empty">
        <div class="saved-empty-icon">${ICONS.bookmark}</div>
        <h3>No saved prompts yet</h3>
        <p>Save prompts from the catalogue, Optimizer, or Generator — they'll appear here.</p>
      </div>`;
    return;
  }

  const myPrompts  = all.filter(p => p.source !== 'catalogue');
  const catPrompts = all.filter(p => p.source === 'catalogue');

  // group catalogue prompts by dept, sort each group by category
  const byDept = {};
  catPrompts.forEach(p => {
    const key = p.dept || 'general';
    if (!byDept[key]) byDept[key] = [];
    byDept[key].push(p);
  });
  Object.values(byDept).forEach(arr =>
    arr.sort((a, b) => (a.category || '').localeCompare(b.category || ''))
  );

  let html = `
    <div class="saved-header-row">
      <span class="saved-count">${all.length} saved prompt${all.length !== 1 ? 's' : ''}</span>
      <button class="saved-clear-btn" onclick="clearAllSaved()">Clear all</button>
    </div>`;

  // My Prompts section (optimizer + generator — draggable)
  if (myPrompts.length) {
    html += buildSavedSection('my-prompts', 'My Prompts', myPrompts, true);
  }

  // Department sections in DEPARTMENTS order
  if (typeof DEPARTMENTS !== 'undefined') {
    DEPARTMENTS.filter(d => d.id !== 'all').forEach(dept => {
      if (byDept[dept.id]?.length) {
        html += buildSavedSection(dept.id, dept.name, byDept[dept.id], false);
      }
    });
  }
  // Cross-dept prompts — split by category so they're meaningfully organised
  if (byDept['general']?.length) {
    const byCategory = {};
    byDept['general'].forEach(p => {
      const catId = p.category || 'uncategorised';
      if (!byCategory[catId]) byCategory[catId] = [];
      byCategory[catId].push(p);
    });
    // Render in CATEGORIES order, then anything uncategorised last
    const catOrder = (typeof CATEGORIES !== 'undefined')
      ? CATEGORIES.map(c => c.id) : [];
    const allCatIds = [...new Set([...catOrder, ...Object.keys(byCategory)])];
    allCatIds.forEach(catId => {
      if (!byCategory[catId]?.length) return;
      const catName = (typeof CATEGORIES !== 'undefined')
        ? (CATEGORIES.find(c => c.id === catId)?.name || 'Other')
        : catId;
      html += buildSavedSection(`general-${catId}`, catName, byCategory[catId], false);
    });
  }

  container.innerHTML = html;
}

function buildSavedSection(deptId, deptName, prompts, isMyPrompts) {
  const dropAttrs = isMyPrompts ? '' :
    `ondragover="savedDragOver(event)" ondragleave="savedDragLeave(event)" ondrop="savedDrop(event,'${deptId}')"`;

  const cards = prompts.map(p => buildSavedCard(p, isMyPrompts)).join('');

  const dropHint = isMyPrompts ? '' :
    `<div class="saved-drop-hint">
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
       Drop My Prompts here
     </div>`;

  return `
    <div class="saved-section">
      <div class="saved-section-hdr">
        <span class="saved-section-title">${deptName}</span>
        <span class="saved-section-badge">${prompts.length}</span>
        ${isMyPrompts ? '<span class="saved-section-tip">Drag cards into a department below</span>' : ''}
      </div>
      <div class="saved-section-grid${isMyPrompts ? '' : ' saved-drop-zone'}" ${dropAttrs}>
        ${cards}
        ${dropHint}
      </div>
    </div>`;
}

function buildSavedCard(p, draggable) {
  const meta    = SRC_META[p.source] || SRC_META.catalogue;
  const preview = p.text.replace(/\n/g, ' ').slice(0, 100) + '…';
  const date    = new Date(p.savedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const catName = p.category
    ? (typeof CATEGORIES !== 'undefined' ? CATEGORIES.find(c => c.id === p.category)?.name : null) || p.category
    : null;

  // Catalogue cards open the full Prompt Kit modal on click
  const isKitCard   = p.source === 'catalogue' && p.sourceId;
  const cardClick   = isKitCard ? `onclick="openModal(${p.sourceId})"` : '';
  const cardCursor  = isKitCard ? ' saved-card-clickable' : '';

  return `
    <div class="saved-card${draggable ? ' saved-card-draggable' : ''}${cardCursor}"
      ${draggable ? `draggable="true" ondragstart="savedDragStart(event,${p.id})" ondragend="savedDragEnd(event)"` : ''}
      ${cardClick}>
      ${draggable ? `<div class="saved-drag-handle" title="Drag to a department">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12">
          <circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/>
          <circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>
          <circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>
        </svg>
      </div>` : ''}
      <div class="saved-card-hdr">
        <div class="saved-card-title">${esc(p.title)}</div>
        <div class="saved-card-meta-row">
          <span class="tool-badge ${meta.cls}">${meta.label}</span>
          ${catName ? `<span class="saved-cat-tag">${catName}</span>` : ''}
          <span class="saved-card-date">${date}</span>
        </div>
      </div>
      <div class="saved-card-preview">${esc(preview)}</div>
      <div class="saved-card-actions">
        <button class="btn-card-copy" onclick="event.stopPropagation();copySavedItem(this,${p.id})">${ICONS.copy} Copy</button>
        <button class="btn-card-view saved-del-btn" onclick="event.stopPropagation();deleteSaved(${p.id})">${ICONS.bookmark} Unsave</button>
      </div>
    </div>`;
}

// ─── DRAG AND DROP ─────────────────────────────────────────────────────────
function savedDragStart(e, id) {
  _dragSavedId = id;
  e.dataTransfer.effectAllowed = 'move';
  e.currentTarget.classList.add('dragging');
}
function savedDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
}
function savedDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}
function savedDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
  }
}
function savedDrop(e, targetDept) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  if (!_dragSavedId) return;
  const arr    = getSaved();
  const record = arr.find(p => p.id === _dragSavedId);
  if (record && record.source !== 'catalogue') {
    record.dept = targetDept;
    setSaved(arr);
    renderSavedPanel();
  }
  _dragSavedId = null;
}

function copySavedItem(btn, id) {
  const p = getSaved().find(x => x.id === id);
  if (p && btn) copyText(p.text, btn, `${ICONS.copy} Copy`);
}

function clearAllSaved() {
  if (!confirm('Delete all saved prompts?')) return;
  setSaved([]);
  renderSavedPanel();
}

// ─── INIT ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Migrate any old saved records that have dept:'general' but a specific sourceId
  // (saved before the dept-detection fix). Re-assign to the prompt's first specific dept.
  const arr = getSaved();
  let changed = false;
  arr.forEach(rec => {
    if (rec.source === 'catalogue' && rec.dept === 'general' && rec.sourceId) {
      const p = (typeof PROMPTS !== 'undefined') && PROMPTS.find(x => x.id === rec.sourceId);
      if (p) {
        const specific = (p.departments || []).filter(d => d !== 'all');
        if (specific.length > 0) { rec.dept = specific[0]; changed = true; }
        // Always ensure category is set so category-grouping works
        if (!rec.category && p.category) { rec.category = p.category; changed = true; }
      }
    }
  });
  if (changed) setSaved(arr);

  _updateSavedBadge();

  showOptEmptyState(
    document.getElementById('opt-output'),
    'Paste any prompt on the left and click <strong>Optimize</strong> — we\'ll improve it using prompt engineering best practices.'
  );

  renderGoalSuggestions();

  const genInput = document.getElementById('gen-input');
  genInput?.addEventListener('keydown', e => { if (e.key === 'Enter') runGenerator(); });
  genInput?.addEventListener('input', () => {
    document.querySelectorAll('.gen-suggestion-pill').forEach(el => el.classList.remove('active'));
  });
});
