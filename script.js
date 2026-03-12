/* ============================================================
   TRIP PLANNER — MAIN JAVASCRIPT
   ============================================================ */

// ── PARTICLES (Rajasthan) ────────────────────────────────────
function initParticles() {
  const emojis = ['🌸', '✨', '🏵️', '🌺', '⭐', '💫', '🌟'];
  const pc = document.getElementById('particles');
  if (!pc) return;
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[i % emojis.length];
    p.style.cssText = `left:${Math.random() * 100}%;font-size:${0.7 + Math.random() * 1}rem;animation-duration:${20 + Math.random() * 22}s;animation-delay:${-Math.random() * 22}s;`;
    pc.appendChild(p);
  }
}

// ── SNOWFLAKES (Mussoorie) ───────────────────────────────────
function initSnowflakes() {
  const sc = document.getElementById('snowflakes');
  if (!sc) return;
  const flakes = ['❄', '❅', '❆', '✦', '·', '•'];
  for (let i = 0; i < 24; i++) {
    const f = document.createElement('div');
    f.className = 'snowflake';
    f.textContent = flakes[i % flakes.length];
    f.style.cssText = `left:${Math.random() * 100}%;font-size:${0.5 + Math.random() * 0.8}rem;animation-duration:${12 + Math.random() * 18}s;animation-delay:${-Math.random() * 18}s;`;
    sc.appendChild(f);
  }
}

// ── MAIN NAV: LANDING → TRIP SECTION ────────────────────────
function goToRajasthan() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('raj-trip').classList.add('visible');
  document.body.classList.remove('mus-mode');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(triggerReveal, 300);
}

function goToMussoorie() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('mus-trip').classList.add('visible');
  document.body.classList.add('mus-mode');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(triggerReveal, 300);
}

function goHome() {
  document.querySelectorAll('.trip-section').forEach(s => s.classList.remove('visible'));
  document.getElementById('landing').style.display = 'flex';
  document.body.classList.remove('mus-mode');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // reset everything
  document.querySelectorAll('.tl-section, .mus-tl-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.date-btn, .chandan-btn').forEach(b => b.classList.remove('active'));
}

// ── RAJ: TIMELINE SELECT ─────────────────────────────────────
function selectTL(id) {
  document.querySelectorAll('.tl-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
  const section = document.getElementById('section-' + id);
  const btn = document.getElementById('btn-' + id);
  if (section) section.classList.add('visible');
  if (btn) btn.classList.add('active');
  document.getElementById('raj-shared-section').style.display = 'block';
  setTimeout(() => {
    if (section) {
      const top = section.getBoundingClientRect().top + window.pageYOffset - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, 120);
  setTimeout(triggerReveal, 300);
}

// ── MUSSOORIE: CHANDAN CHOICE ────────────────────────────────
function selectChandan(mode) {
  document.querySelectorAll('.mus-tl-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.chandan-btn').forEach(b => b.classList.remove('active'));
  const section = document.getElementById('mus-' + mode);
  const btn = document.getElementById('cbtn-' + mode);
  if (section) section.classList.add('visible');
  if (btn) btn.classList.add('active');
  document.getElementById('mus-shared-section').style.display = 'block';
  setTimeout(() => {
    if (section) {
      const top = section.getBoundingClientRect().top + window.pageYOffset - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, 120);
  setTimeout(triggerReveal, 300);
}

// ── DAY BLOCK TOGGLE ─────────────────────────────────────────
function toggleDay(hdr) {
  const block = hdr.parentElement;
  block.classList.toggle('open');
  setTimeout(triggerReveal, 100);
}

// ── REVEAL ON SCROLL ─────────────────────────────────────────
let ro = null;
function triggerReveal() {
  const els = document.querySelectorAll('.reveal:not(.shown)');
  if (!els.length) return;
  if (!ro) {
    ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('shown');
          ro.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10px 0px' });
  }
  els.forEach(el => ro.observe(el));
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initSnowflakes();
  triggerReveal();
  window.addEventListener('scroll', triggerReveal, { passive: true });

  // Auto-open first day in each section
  const autoOpen = [
    '#raj-section-mar18 .day-block',
    '#raj-section-mar27 .day-block',
    '#mus-yes .day-block',
    '#mus-no .day-block'
  ];
  autoOpen.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.classList.add('open');
  });
});