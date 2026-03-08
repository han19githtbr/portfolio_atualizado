let currentLang = 'pt';

// ===== RENDER DYNAMIC SECTIONS =====
function renderAbout(lang) {
  document.getElementById('about-text-content').innerHTML = DATA[lang].about_text;
}

function renderExperience(lang) {
  const d = DATA[lang];
  const typeLabels = { current: d.exp_current, pj: d.exp_pj, intern: d.exp_intern };
  const typeClasses = { current: 'type-current', pj: 'type-pj', intern: 'type-intern' };

  document.getElementById('timeline-content').innerHTML = d.experiences.map(exp => `
    <div class="timeline-item">
      <div class="exp-header">
        <div>
          <div class="exp-role">${exp.role}</div>
          <div class="exp-company">${exp.company}</div>
        </div>
        <div class="exp-period">${exp.period}</div>
      </div>
      <span class="exp-type ${typeClasses[exp.type]}">${typeLabels[exp.type]}</span>
      <div class="exp-desc">${exp.desc}</div>
      <div class="exp-techs">${exp.techs.map(t => `<span class="tech-pill">${t}</span>`).join('')}</div>
    </div>
  `).join('');
}

function renderProjects(lang) {
  const svgLink = `<svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>`;
  const svgGh = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`;

  document.getElementById('projects-grid').innerHTML = DATA[lang].projects.map(p => `
    <div class="project-card">
      <div class="project-top">
        <div class="project-icon" style="background: linear-gradient(135deg, ${p.color}, transparent); border: 1px solid ${p.border};">${p.icon}</div>
        <div class="project-links">
          <a href="${p.demo}" target="_blank" class="project-link" title="Demo">${svgLink}</a>
          <a href="${p.github}" target="_blank" class="project-link" title="GitHub">${svgGh}</a>
        </div>
      </div>
      <div class="project-name">${p.name}</div>
      <div class="project-desc">${p.desc}</div>
      <div class="project-techs">${p.techs.map(t => `<span class="project-tech">${t}</span>`).join('')}</div>
    </div>
  `).join('');
}

// ===== APPLY ALL TRANSLATIONS =====
function applyTranslations(lang) {
  // data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (DATA[lang][key] !== undefined) {
      if (['hero_subtitle', 'about_text', 'award_desc'].includes(key)) {
        el.innerHTML = DATA[lang][key];
      } else {
        el.textContent = DATA[lang][key];
      }
    }
  });
  // Dynamic sections
  renderAbout(lang);
  renderExperience(lang);
  renderProjects(lang);
  // html lang attr
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang === 'fr' ? 'fr-FR' : 'en-US';
  // page title
  const titles = { pt: 'Handy Claude Marie Milliance — Portfólio', en: 'Handy Claude Marie Milliance — Portfolio', fr: 'Handy Claude Marie Milliance — Portfolio' };
  document.title = titles[lang];
}

// ===== SWITCH LANGUAGE =====

// ===== SWITCH LANGUAGE =====
function setLang(lang, btn) {
  currentLang = lang;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  applyTranslations(lang);
}

// ===== LOAD DATA FROM data.json & INIT =====
async function loadData() {
  const res = await fetch('data.json');
  DATA = await res.json();
  applyTranslations(currentLang);
}

let DATA = null;
loadData();
