/**
 * Main application logic for Sai Tarun's portfolio.
 * Handles rendering of all sections, theme, navigation, resume and contact.
 *
 * NOTE: `appData` and `isAdminActive` are declared in admin.js (loaded before this
 * file) and shared via the global scope of classic <script> tags. Do NOT redeclare
 * them here.
 */

let currentFilter = "all";

/* ==========================================================================
   INIT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  renderAll();
  if (typeof initAdmin === "function") initAdmin();
  const yEl = document.getElementById("footerYear");
  if (yEl) yEl.textContent = new Date().getFullYear();
  initScrollSpy();
});

function renderAll() {
  renderHero();
  renderStats();
  renderProjects();
  renderTimeline();
  renderSkills();
  renderContact();
  renderResume();
}

/* ==========================================================================
   HERO
   ========================================================================== */
function renderHero() {
  const p = appData.profile;
  setText("heroName", p.name);
  setText("heroTitle", p.title);
  setText("heroBio", p.bio);
  setText("heroStatusBadge", p.statusBadge || "Available for Opportunities");
  setText("heroLocation", p.location);

  const avatar = document.getElementById("heroAvatar");
  if (avatar && p.avatarUrl) avatar.src = p.avatarUrl;

  setHref("heroGithub", p.github);
  setHref("heroLinkedin", p.linkedin);
  const emailEl = document.getElementById("heroEmail");
  if (emailEl && p.email) emailEl.setAttribute("href", "mailto:" + p.email);
}

/* ==========================================================================
   STATS
   ========================================================================== */
function renderStats() {
  const grid = document.getElementById("statsGrid");
  if (!grid) return;
  const skillCount =
    (appData.resume.skills.languages.length || 0) +
    (appData.resume.skills.concepts.length || 0);
  const stats = [
    { n: appData.projects.length, l: "Live Projects" },
    { n: appData.resume.experience.length, l: "Internships" },
    { n: skillCount, l: "Skills & Tools" },
    { n: "Open", l: "To Opportunities" },
  ];
  grid.innerHTML = stats
    .map(
      (s) =>
        `<div class="stat-box"><div class="stat-number">${s.n}</div><div class="stat-label">${s.l}</div></div>`
    )
    .join("");
}

/* ==========================================================================
   PROJECTS
   ========================================================================== */
function renderProjects() {
  const grid = document.getElementById("projectsGrid");
  if (!grid) return;

  const list =
    currentFilter === "all"
      ? appData.projects
      : appData.projects.filter((p) => p.category === currentFilter);

  if (!list.length) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-secondary);padding:2rem;">No projects in this category yet.</p>`;
    return;
  }

  grid.innerHTML = list.map(buildProjectCard).join("");
}

function buildProjectCard(p) {
  const tags = (p.tags || [])
    .map((t) => `<span class="tag-pill">${escapeHtml(t)}</span>`)
    .join("");

  // Live demo handling: external link wins, otherwise interactive demo function
  const demo = getLiveDemo(p);
  const demoLabel = escapeHtml(p.liveButtonLabel || "🌐 Live Demo");
  let demoBtn = "";
  if (demo && demo.type === "external") {
    demoBtn = `<a class="btn btn-demo-action" href="${demo.url}" target="_blank" rel="noopener">${demoLabel}</a>`;
  } else if (demo && demo.type === "interactive") {
    demoBtn = `<button class="btn btn-demo-action" onclick="openProjectDemo('${demo.fn}')">${demoLabel}</button>`;
  } else {
    demoBtn = `<span class="btn btn-demo-action" style="opacity:0.5;cursor:default;">No live demo</span>`;
  }

  const githubBtn = p.githubUrl
    ? `<a class="btn btn-github-action" href="${p.githubUrl}" target="_blank" rel="noopener" title="View source on GitHub">
         <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17 4.7 18 5 18 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/></svg>
       </a>`
    : "";

  const adminControls =
    `<div class="project-admin-controls">
       <button class="btn btn-sm btn-outline-admin" onclick="openEditProjectModal('${p.id}')">Edit</button>
       <button class="btn btn-sm btn-danger-admin" onclick="deleteProject('${p.id}')">Delete</button>
     </div>`;

  return `
    <article class="project-card">
      <div class="project-card-image-wrap">
        <img class="project-card-image" src="${p.image || ""}" alt="${escapeHtml(p.title)}" loading="lazy" onerror="this.style.opacity=0.3" />
        <span class="project-category-badge">${escapeHtml(p.categoryLabel || p.category || "Project")}</span>
      </div>
      <div class="project-card-body">
        <h3 class="project-title">${escapeHtml(p.title)}</h3>
        <p class="project-desc">${escapeHtml(p.description)}</p>
        <div class="project-tags-list">${tags}</div>
        <div class="project-card-actions">
          ${demoBtn}
          ${githubBtn}
        </div>
        ${adminControls}
      </div>
    </article>`;
}

function getLiveDemo(project) {
  if (project.liveUrl && String(project.liveUrl).trim())
    return { type: "external", url: project.liveUrl };
  if (project.liveType === "external" && project.liveAction)
    return { type: "external", url: project.liveAction };
  if (project.liveType === "interactive" && project.liveAction)
    return { type: "interactive", fn: project.liveAction };
  return null;
}

function openProjectDemo(fnName) {
  if (typeof window[fnName] === "function") window[fnName]();
  else showToast("This demo is not available right now.", "error");
}

function filterProjects(cat, btn) {
  currentFilter = cat;
  const btns = document.querySelectorAll("#projectsFilter .filter-btn");
  btns.forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");
  else if (btns.length) {
    const map = { all: 0, web: 1, ml: 2, other: 3 };
    if (btns[map[cat]]) btns[map[cat]].classList.add("active");
  }
  renderProjects();
}

/* ==========================================================================
   EXPERIENCE & EDUCATION TIMELINE
   ========================================================================== */
function renderTimeline() {
  const wrap = document.getElementById("timelineContent");
  if (!wrap) return;
  const r = appData.resume;

  let html = "";

  r.experience.forEach((e) => {
    const bullets = (e.highlights || [])
      .map((h) => `<li>${escapeHtml(h)}</li>`)
      .join("");
    html += `
      <div class="timeline-card">
        <span class="timeline-dot"></span>
        <div class="timeline-header">
          <span class="timeline-role">${escapeHtml(e.role)}</span>
          <span class="timeline-period">${escapeHtml(e.period)}</span>
        </div>
        <div class="timeline-company">${escapeHtml(e.company)}</div>
        <ul class="timeline-bullets">${bullets}</ul>
      </div>`;
  });

  r.education.forEach((ed) => {
    html += `
      <div class="timeline-card">
        <span class="timeline-dot" style="background:var(--accent-indigo);box-shadow:0 0 12px var(--accent-indigo);"></span>
        <div class="timeline-header">
          <span class="timeline-role">${escapeHtml(ed.degree)}</span>
          <span class="timeline-period">${escapeHtml(ed.period)}</span>
        </div>
        <div class="timeline-company">${escapeHtml(ed.institution)}</div>
        <ul class="timeline-bullets"><li>${escapeHtml(ed.description)}</li></ul>
      </div>`;
  });

  wrap.innerHTML = html;
}

/* ==========================================================================
   SKILLS
   ========================================================================== */
function renderSkills() {
  const grid = document.getElementById("skillsGrid");
  if (!grid) return;
  const s = appData.resume.skills;

  const langPills = (s.languages || [])
    .map((l) => `<span class="skill-pill">${escapeHtml(l)}</span>`)
    .join("");
  const conceptPills = (s.concepts || [])
    .map((c) => `<span class="skill-pill">${escapeHtml(c)}</span>`)
    .join("");

  grid.innerHTML = `
    <div class="skills-card">
      <h3 class="skills-card-title">
        <span class="skills-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </span>
        Languages &amp; Frameworks
      </h3>
      <div class="skills-pill-cloud">${langPills}</div>
    </div>
    <div class="skills-card">
      <h3 class="skills-card-title">
        <span class="skills-card-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 10v6m11-11h-6m-10 0H1m17.5-7.5l-4.2 4.2m-6.6 6.6l-4.2 4.2m0-15l4.2 4.2m6.6 6.6l4.2 4.2"/></svg>
        </span>
        Concepts &amp; Domains
      </h3>
      <div class="skills-pill-cloud">${conceptPills}</div>
    </div>`;
}

/* ==========================================================================
   CONTACT
   ========================================================================== */
function renderContact() {
  const col = document.getElementById("contactCards");
  if (!col) return;
  const p = appData.profile;
  const tel = (p.phone || "").replace(/\s+/g, "");

  col.innerHTML = `
    <a class="contact-card" href="mailto:${escapeHtml(p.email)}">
      <div class="contact-card-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
      </div>
      <div class="contact-card-info"><h4>Email</h4><p>${escapeHtml(p.email)}</p></div>
    </a>
    <a class="contact-card" href="tel:${tel}">
      <div class="contact-card-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      </div>
      <div class="contact-card-info"><h4>Phone</h4><p>${escapeHtml(p.phone)}</p></div>
    </a>
    <div class="contact-card">
      <div class="contact-card-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <div class="contact-card-info"><h4>Location</h4><p>${escapeHtml(p.location)}</p></div>
    </div>`;
}

function sendContactMessage(event) {
  event.preventDefault();
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();
  const to = appData.profile.email;
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  showToast("Opening your email client…", "info");
  return false;
}

/* ==========================================================================
   RESUME (view + download)
   ========================================================================== */
function renderResume() {
  const sheet = document.getElementById("resumeSheet");
  if (!sheet) return;
  const p = appData.profile;
  const r = appData.resume;

  const contacts = [
    p.email,
    p.phone,
    p.location,
    p.github && "GitHub",
    p.linkedin && "LinkedIn",
  ].filter(Boolean).join("  •  ");

  const eduHtml = r.education
    .map(
      (ed) => `
      <div>
        <div class="resume-item-row"><span>${escapeHtml(ed.degree)}</span><span>${escapeHtml(ed.period)}</span></div>
        <div class="resume-item-sub">${escapeHtml(ed.institution)}</div>
        <div style="font-size:0.9rem;color:#334155;margin-bottom:1rem;">${escapeHtml(ed.description)}</div>
      </div>`
    )
    .join("");

  const expHtml = r.experience
    .map(
      (e) => `
      <div style="margin-bottom:1.25rem;">
        <div class="resume-item-row"><span>${escapeHtml(e.role)}</span><span>${escapeHtml(e.period)}</span></div>
        <div class="resume-item-sub">${escapeHtml(e.company)}</div>
        <ul class="resume-bullets-list">
          ${(e.highlights || []).map((h) => `<li>${escapeHtml(h)}</li>`).join("")}
        </ul>
      </div>`
    )
    .join("");

  const skillsHtml = [
    ...(r.skills.languages || []),
    ...(r.skills.concepts || []),
  ].join(" • ");

  sheet.innerHTML = `
    <div class="resume-sheet-container" id="resumePrintArea">
      <div class="resume-sheet-header">
        <h1 class="resume-sheet-name">${escapeHtml(p.name)}</h1>
        <p style="color:#0d9488;font-weight:600;margin-bottom:0.5rem;">${escapeHtml(p.title)}</p>
        <div class="resume-sheet-contacts">${escapeHtml(contacts)}</div>
      </div>

      <h3 class="resume-sec-title">Summary</h3>
      <p style="font-size:0.92rem;color:#334155;margin-bottom:0.5rem;">${escapeHtml(r.summary)}</p>

      <h3 class="resume-sec-title">Experience</h3>
      ${expHtml}

      <h3 class="resume-sec-title">Education</h3>
      ${eduHtml}

      <h3 class="resume-sec-title">Skills</h3>
      <p style="font-size:0.92rem;color:#334155;">${escapeHtml(skillsHtml)}</p>
    </div>`;
}

function openResumeModal() {
  renderResume();
  document.getElementById("resumeModal").classList.add("active");
}
function closeResumeModal() {
  document.getElementById("resumeModal").classList.remove("active");
}
function downloadResume() {
  openResumeModal();
  setTimeout(() => window.print(), 450);
}

/* ==========================================================================
   TOAST
   ========================================================================== */
function showToast(message, type) {
  type = type || "info";
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const icons = {
    success: "✓",
    error: "✕",
    info: "ℹ",
  };
  const toast = document.createElement("div");
  toast.className = `toast-msg ${type}`;
  toast.innerHTML = `<span style="font-weight:800;">${icons[type] || ""}</span> ${escapeHtml(message)}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(20px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ==========================================================================
   ADMIN ENTRY (keyboard shortcut Ctrl+Shift+A uses this)
   ========================================================================== */
function toggleAdminModal() {
  if (typeof isAdminActive !== "undefined" && isAdminActive) {
    showToast("Admin mode is already active — check the top toolbar.", "info");
    return;
  }
  openAdminLoginModal();
}

/* ==========================================================================
   THEME
   ========================================================================== */
function initTheme() {
  const saved = localStorage.getItem("sai_portfolio_theme") || "dark";
  applyTheme(saved);
}
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const moon = document.getElementById("themeIconMoon");
  const sun = document.getElementById("themeIconSun");
  if (sun) sun.style.display = theme === "dark" ? "block" : "none";
  if (moon) moon.style.display = theme === "dark" ? "none" : "block";
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute("data-theme");
  const next = cur === "light" ? "dark" : "light";
  localStorage.setItem("sai_portfolio_theme", next);
  applyTheme(next);
}

/* ==========================================================================
   MOBILE NAV
   ========================================================================== */
function toggleMobileNav() {
  const links = document.getElementById("navLinks");
  if (links) links.classList.toggle("open");
}

/* ==========================================================================
   SCROLL SPY (active nav link)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id], header[id]");
  const links = document.querySelectorAll(".nav-link");
  if (!sections.length || !links.length) return;

  const onScroll = () => {
    const pos = window.scrollY + 120;
    let current = "home";
    sections.forEach((sec) => {
      if (sec.offsetTop <= pos) current = sec.id;
    });
    links.forEach((l) => {
      l.classList.toggle("active", l.getAttribute("href") === "#" + current);
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Close mobile nav on link click
  links.forEach((l) =>
    l.addEventListener("click", () => {
      const nl = document.getElementById("navLinks");
      if (nl) nl.classList.remove("open");
    })
  );
}

/* ==========================================================================
   HELPERS
   ========================================================================== */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || "";
}
function setHref(id, url) {
  const el = document.getElementById(id);
  if (el && url) el.setAttribute("href", url);
}
function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
