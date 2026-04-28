// ─── LANGUAGE STATE ────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('ai-toolkit-lang') || 'en';

function t(key) {
  return (STRINGS[currentLang] || STRINGS.en)[key] || STRINGS.en[key] || key;
}

function switchLang() {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  localStorage.setItem('ai-toolkit-lang', currentLang);
  applyTranslations();
  // Re-render all JS-driven sections
  if (typeof renderDeptTabs  === 'function') renderDeptTabs();
  if (typeof renderCatPills  === 'function') renderCatPills();
  if (typeof renderGrid      === 'function') renderGrid();
  if (typeof renderUseCases  === 'function') renderUseCases();
  if (typeof renderGoalSuggestions === 'function') renderGoalSuggestions();
  if (typeof renderSavedPanel === 'function' &&
      document.getElementById('tool-saved')?.classList.contains('active')) {
    renderSavedPanel();
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const val = t(key);
    if (typeof val === 'function') return; // skip function-type values (handled in JS)
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
    else el.innerHTML = val;
  });
  const btn = document.getElementById('lang-toggle');
  if (btn) btn.textContent = currentLang === 'en' ? 'ES' : 'EN';
  document.documentElement.lang = currentLang;
}

// ─── STRINGS ───────────────────────────────────────────────────────────────
const STRINGS = {
  en: {
    // Nav
    nav_studio:       'Prompt Studio',
    nav_kit:          'Prompt Kit',
    nav_usecases:     'Use Cases',
    nav_howitworks:   'How It Works',
    nav_getstarted:   'Get Started',

    // Hero
    hero_badge:       'Internal AI Prompt Library &nbsp;·&nbsp; Beta',
    hero_title:       'Stop starting<br>from a blank page.',
    hero_subtitle:    'Expert-crafted AI prompts for every department — organised by task, labelled by impact, and ready to copy in one click.',
    hero_btn_browse:  'Browse Prompts',
    hero_btn_peers:   'See results from your peers',
    stat_prompts:     'Prompts',
    stat_depts:       'Departments',
    stat_colleagues:  'Colleagues surveyed',
    stat_ai_saves:    'Say AI saves them time',

    // Proof strip
    proof_label:      'Serving professionals across',
    proof_offices:    'Offices',
    proof_retail:     'Retail',
    proof_industrial: 'Industrial',
    proof_living:     'Living',
    proof_hospitality:'Hospitality',
    proof_data:       'Data Centres',

    // Survey strip
    survey_label:     'From 536 colleagues surveyed',
    survey_v1: '53%', survey_l1: 'use AI every day',         survey_q1: 'Q: How often do you use AI?',
    survey_v2: '71%', survey_l2: 'say AI accelerates their work', survey_q2: 'Q: What does AI contribute?',
    survey_v3: '61%', survey_l3: 'lack role-specific use cases',  survey_q3: 'Q: What knowledge do you lack?',
    survey_v4: '52%', survey_l4: 'cite practical know-how as top barrier', survey_q4: 'Q: What slows your AI use?',
    survey_v5: '63%', survey_l5: 'want practical guides for their role',   survey_q5: 'Q: Which initiatives add most value?',

    // Value props
    vp_eyebrow:    'Why This Toolkit',
    vp_title:      'Built around how you actually work',
    vp_sub:        'AI is most powerful when it meets you where you are — not when you have to become a "prompt engineer" first.',
    vp_c1_title:   'Department-first navigation',
    vp_c1_body:    'Filter by your team and only see the prompts relevant to your role. No irrelevant noise, no searching through lists that don\'t apply to you. <strong>86% of surveyed colleagues</strong> said they need examples applied to their specific role.',
    vp_c2_title:   'Zero prompt expertise needed',
    vp_c2_body:    'Every prompt is pre-structured and tested. Fill in your specific details inside the brackets and get a professional first draft in seconds. <strong>52% cited lack of practical know-how</strong> as their biggest barrier — this removes it entirely.',
    vp_c3_title:   'Impact-labelled from day one',
    vp_c3_body:    'Prompts are tagged High Impact, Frequently Used, or Under 5 mins so you immediately know what delivers the most value with the least effort. <strong>60% said lack of time</strong> is their top constraint — start with the Under 5 min prompts.',

    // Prompt Studio
    ps_eyebrow:    'Prompt Studio',
    ps_title:      'Optimize your own prompts',
    ps_sub:        'Improve a weak prompt instantly, generate a set from any goal, or revisit your saved favourites.',
    tab_optimizer: 'Prompt Optimizer',
    tab_generator: 'Goal → Prompts',
    tab_saved:     'Saved',
    opt_label:     'Your draft prompt',
    opt_placeholder: 'Paste any prompt here — rough, one-line, or half-formed — and we\'ll improve it using prompt engineering best practices.',
    opt_btn:       'Optimize Prompt',
    gen_label:     'What\'s your goal?',
    gen_placeholder: 'Type your own goal or pick one below…',
    gen_btn:       'Generate',
    gen_try:       'Try one of these',
    saved_empty_h: 'No saved prompts yet',
    saved_empty_p: 'Optimized or generated prompts you save will appear here.',
    saved_count_label: (n) => `${n} saved prompt${n !== 1 ? 's' : ''}`,
    saved_clear:   'Clear all',

    // Goal suggestions
    goals: [
      'Write an investment memo',
      'Pitch a property to a client',
      'Analyse a local market',
      'Draft a lease summary',
      'Build a financial model',
      'Prepare a board presentation',
      'Negotiate a lease renewal',
      'Write an executive summary',
      'Create a due diligence checklist',
      'Onboard a new client',
      'Forecast rental growth',
      'Improve my email writing',
      'Get a promotion at work',
      'Plan a property refurbishment',
      'Summarise a long report',
      'Prepare for a client meeting',
    ],

    // Prompt Kit
    kit_eyebrow:   'Prompt Kit',
    kit_title:     'Find the right prompt for any task',
    kit_sub:       'Select your department · filter by category · copy and go.',
    dept_all:      'All Departments',
    dept_starred:  'Starred',
    dept_capital:  'Capital Markets',
    dept_retail:   'Retail Advisory',
    dept_property: 'Property Management',
    dept_leasing:  'Leasing & Brokerage',
    dept_valuation:'Valuation & Advisory',
    dept_research: 'Research & Analysis',
    dept_corporate:'Corporate Solutions',
    cat_all:       'All Categories',
    cat_writing:   'Writing & Communication',
    cat_analysis:  'Research & Analysis',
    cat_client:    'Client Relations',
    cat_data:      'Data & Reporting',
    cat_visual:    'Visual & Presentations',
    search_placeholder: 'Search prompts…',
    btn_copy:      'Copy Prompt',
    btn_view:      'View',
    btn_view_more: (n) => `View ${n} more prompt${n !== 1 ? 's' : ''}`,
    btn_view_less: 'View less',
    no_prompts_h:  'No prompts match your filters',
    no_prompts_p:  'Try a different department, category, or search term.',
    prompt_count:  (n) => `${n} prompt${n !== 1 ? 's' : ''}`,
    coming_soon_title: 'Full prompt library coming soon',
    coming_soon_sub: 'Content is being finalised with the CBRE team.',
    coming_soon_badge: 'In progress',

    // Use cases
    uc_eyebrow:    'Results',
    uc_title:      'Your colleagues are already saving hours.',
    uc_sub:        'Real outcomes from real teams. Click any result to open the prompt that made it happen.',

    // How it works
    hiw_eyebrow:   'How It Works',
    hiw_title:     'Four steps. First result in under two minutes.',
    hiw_sub:       'No training required. No AI background needed. Just your knowledge and these prompts.',
    hiw_s1_title:  'Choose your department',
    hiw_s1_body:   'Pick your team to filter down to prompts written for your specific context and task types.',
    hiw_s2_title:  'Locate your task',
    hiw_s2_body:   'Use category filters or search. Labels tell you what\'s highest impact and what takes under 5 minutes.',
    hiw_s3_title:  'Copy and customise',
    hiw_s3_body:   'One-click copy. Paste into any AI tool, fill in the [brackets] with your specifics, and run.',
    hiw_s4_title:  'Review and send',
    hiw_s4_body:   'AI output is a first draft — review it, add your judgement, and sign off. You remain the expert.',
    bsci_label:    'Behavioural Science',
    bsci_title:    'Build the habit with an implementation intention',
    bsci_body:     'Your colleagues told us their biggest barriers are lack of time to learn (60%) and not knowing how to start (52%). The solution isn\'t another training course. It\'s a ready-to-use prompt you can copy in under ten seconds. Decide now: <em>"Every time I open a blank document to draft a client deliverable, I check the toolkit first."</em> That one rule compounds into hours saved each month.',

    // Modals
    modal_prompt_label: 'Prompt',
    modal_copy:    'Copy Prompt',
    modal_star:    'Star',
    modal_starred: 'Starred',
    modal_change_dept: 'Change Dept',
    modal_send_studio: 'Send Back to Studio',
    modal_remove_kit: 'Remove from Kit',

    // Labels
    lbl_freq: 'Frequently Used',
    lbl_impact: 'High Impact',
    lbl_under5: 'Under 5 mins',
    lbl_in_progress: 'In progress',

    // Footer
    footer_note: '<strong>Placeholder data</strong> based on CBRE service lines · Replace with your company\'s real prompts before launch · Internal use only',
    footer_tip:  '<strong>Tip:</strong> Try replacing one manual task this week with a prompt above.',
  },

  es: {
    // Nav
    nav_studio:       'Estudio de Prompts',
    nav_kit:          'Kit de Prompts',
    nav_usecases:     'Casos de Uso',
    nav_howitworks:   'Cómo Funciona',
    nav_getstarted:   'Comenzar',

    // Hero
    hero_badge:       'Biblioteca Interna de Prompts IA &nbsp;·&nbsp; Beta',
    hero_title:       'Deja de empezar<br>desde cero.',
    hero_subtitle:    'Prompts de IA creados por expertos para cada departamento — organizados por tarea, etiquetados por impacto, y listos para copiar en un clic.',
    hero_btn_browse:  'Ver Prompts',
    hero_btn_peers:   'Ver resultados de tus colegas',
    stat_prompts:     'Prompts',
    stat_depts:       'Departamentos',
    stat_colleagues:  'Colegas encuestados',
    stat_ai_saves:    'Dicen que la IA les ahorra tiempo',

    // Proof strip
    proof_label:      'Para profesionales en',
    proof_offices:    'Oficinas',
    proof_retail:     'Comercial',
    proof_industrial: 'Industrial',
    proof_living:     'Residencial',
    proof_hospitality:'Hotelería',
    proof_data:       'Centros de Datos',

    // Survey strip
    survey_label:     'De 536 colegas encuestados',
    survey_v1: '53%', survey_l1: 'usan IA todos los días',         survey_q1: 'P: ¿Con qué frecuencia usas IA?',
    survey_v2: '71%', survey_l2: 'dicen que la IA acelera su trabajo', survey_q2: 'P: ¿Qué aporta la IA?',
    survey_v3: '61%', survey_l3: 'carecen de casos de uso para su rol',  survey_q3: 'P: ¿Qué conocimiento te falta?',
    survey_v4: '52%', survey_l4: 'citan el conocimiento práctico como barrera', survey_q4: 'P: ¿Qué frena tu uso de IA?',
    survey_v5: '63%', survey_l5: 'quieren guías prácticas para su rol',   survey_q5: 'P: ¿Qué iniciativas aportan más valor?',

    // Value props
    vp_eyebrow:    'Por Qué Este Toolkit',
    vp_title:      'Diseñado para como realmente trabajas',
    vp_sub:        'La IA es más poderosa cuando se adapta a ti — no cuando tienes que convertirte en un "experto en prompts" primero.',
    vp_c1_title:   'Navegación por departamento',
    vp_c1_body:    'Filtra por tu equipo y ve sólo los prompts relevantes para tu rol. Sin ruido irrelevante. <strong>El 86% de los colegas encuestados</strong> dijo que necesita ejemplos aplicados a su rol específico.',
    vp_c2_title:   'Sin experiencia en prompts',
    vp_c2_body:    'Cada prompt está pre-estructurado y probado. Completa los detalles entre corchetes y obtén un primer borrador profesional en segundos. <strong>El 52% citó la falta de conocimiento práctico</strong> como su mayor barrera — esto la elimina por completo.',
    vp_c3_title:   'Etiquetado por impacto desde el primer día',
    vp_c3_body:    'Los prompts están etiquetados como Alto Impacto, Muy Usado o Menos de 5 min para que sepas inmediatamente qué entrega más valor. <strong>El 60% dijo que la falta de tiempo</strong> es su principal restricción — empieza con los prompts de menos de 5 min.',

    // Prompt Studio
    ps_eyebrow:    'Estudio de Prompts',
    ps_title:      'Optimiza tus propios prompts',
    ps_sub:        'Mejora un prompt débil al instante, genera ideas desde un objetivo, o revisa tus favoritos guardados.',
    tab_optimizer: 'Optimizador',
    tab_generator: 'Objetivo → Prompts',
    tab_saved:     'Guardados',
    opt_label:     'Tu prompt borrador',
    opt_placeholder: 'Pega cualquier prompt aquí — básico, de una línea o a medias — y lo mejoraremos con técnicas de prompt engineering.',
    opt_btn:       'Optimizar Prompt',
    gen_label:     '¿Cuál es tu objetivo?',
    gen_placeholder: 'Escribe tu propio objetivo o elige uno de abajo…',
    gen_btn:       'Generar',
    gen_try:       'Prueba uno de estos',
    saved_empty_h: 'Aún no hay prompts guardados',
    saved_empty_p: 'Los prompts que optimices o generes aparecerán aquí.',
    saved_count_label: (n) => `${n} prompt${n !== 1 ? 's' : ''} guardado${n !== 1 ? 's' : ''}`,
    saved_clear:   'Borrar todo',

    // Goal suggestions
    goals: [
      'Redactar un memorando de inversión',
      'Presentar una propiedad a un cliente',
      'Analizar un mercado local',
      'Resumir un contrato de arrendamiento',
      'Construir un modelo financiero',
      'Preparar una presentación para el consejo',
      'Negociar una renovación de arrendamiento',
      'Escribir un resumen ejecutivo',
      'Crear una lista de due diligence',
      'Incorporar a un nuevo cliente',
      'Pronosticar el crecimiento de rentas',
      'Mejorar mi redacción de correos',
      'Conseguir una promoción laboral',
      'Planificar una renovación de propiedad',
      'Resumir un informe extenso',
      'Prepararse para una reunión con un cliente',
    ],

    // Prompt Kit
    kit_eyebrow:   'Kit de Prompts',
    kit_title:     'Encuentra el prompt correcto para cada tarea',
    kit_sub:       'Selecciona tu departamento · filtra por categoría · copia y listo.',
    dept_all:      'Todos los Departamentos',
    dept_starred:  'Destacados',
    dept_capital:  'Mercados de Capital',
    dept_retail:   'Asesoría Comercial',
    dept_property: 'Gestión de Propiedades',
    dept_leasing:  'Arrendamiento y Corretaje',
    dept_valuation:'Valoración y Asesoría',
    dept_research: 'Investigación y Análisis',
    dept_corporate:'Soluciones Corporativas',
    cat_all:       'Todas las Categorías',
    cat_writing:   'Redacción y Comunicación',
    cat_analysis:  'Investigación y Análisis',
    cat_client:    'Relaciones con Clientes',
    cat_data:      'Datos e Informes',
    cat_visual:    'Visual y Presentaciones',
    search_placeholder: 'Buscar prompts…',
    btn_copy:      'Copiar Prompt',
    btn_view:      'Ver',
    btn_view_more: (n) => `Ver ${n} prompt${n !== 1 ? 's' : ''} más`,
    btn_view_less: 'Ver menos',
    no_prompts_h:  'Ningún prompt coincide con tus filtros',
    no_prompts_p:  'Prueba con un departamento, categoría o término de búsqueda diferente.',
    prompt_count:  (n) => `${n} prompt${n !== 1 ? 's' : ''}`,
    coming_soon_title: 'Biblioteca completa próximamente',
    coming_soon_sub: 'El contenido se está finalizando con el equipo de CBRE.',
    coming_soon_badge: 'En progreso',

    // Use cases
    uc_eyebrow:    'Resultados',
    uc_title:      'Tus colegas ya están ahorrando horas.',
    uc_sub:        'Resultados reales de equipos reales. Haz clic en cualquier resultado para abrir el prompt que lo hizo posible.',

    // How it works
    hiw_eyebrow:   'Cómo Funciona',
    hiw_title:     'Cuatro pasos. Primer resultado en menos de dos minutos.',
    hiw_sub:       'Sin formación previa. Sin conocimiento de IA. Sólo tu conocimiento y estos prompts.',
    hiw_s1_title:  'Elige tu departamento',
    hiw_s1_body:   'Selecciona tu equipo para ver sólo los prompts escritos para tu contexto y tipo de tareas.',
    hiw_s2_title:  'Localiza tu tarea',
    hiw_s2_body:   'Usa los filtros de categoría o la búsqueda. Las etiquetas indican el mayor impacto y los que toman menos de 5 minutos.',
    hiw_s3_title:  'Copia y personaliza',
    hiw_s3_body:   'Copia con un clic. Pega en cualquier herramienta de IA, completa los [corchetes] con tus datos y ejecuta.',
    hiw_s4_title:  'Revisa y envía',
    hiw_s4_body:   'El resultado de la IA es un primer borrador — revísalo, añade tu criterio y da el visto bueno. Tú sigues siendo el experto.',
    bsci_label:    'Ciencia del Comportamiento',
    bsci_title:    'Crea el hábito con una intención de implementación',
    bsci_body:     'Tus colegas nos dijeron que sus mayores barreras son la falta de tiempo para aprender (60%) y no saber por dónde empezar (52%). La solución no es otro curso de formación. Es un prompt listo para usar que puedes copiar en menos de diez segundos. Decide ahora: <em>"Cada vez que abra un documento en blanco para redactar un entregable para un cliente, consultaré el toolkit primero."</em> Esa única regla se convierte en horas ahorradas cada mes.',

    // Modals
    modal_prompt_label: 'Prompt',
    modal_copy:    'Copiar Prompt',
    modal_star:    'Destacar',
    modal_starred: 'Destacado',
    modal_change_dept: 'Cambiar Depto.',
    modal_send_studio: 'Volver al Estudio',
    modal_remove_kit: 'Quitar del Kit',

    // Labels
    lbl_freq: 'Muy Usado',
    lbl_impact: 'Alto Impacto',
    lbl_under5: 'Menos de 5 min',
    lbl_in_progress: 'En progreso',

    // Footer
    footer_note: '<strong>Datos de ejemplo</strong> basados en las líneas de servicio de CBRE · Reemplaza con los prompts reales de tu empresa antes del lanzamiento · Solo para uso interno',
    footer_tip:  '<strong>Consejo:</strong> Prueba a reemplazar una tarea manual esta semana con uno de los prompts anteriores.',
  },
};
