/* ============================================================
   TRIP PLANNER — MAIN JAVASCRIPT
   Rajasthan + Mussoorie (with Day Card Slider)
   ============================================================ */

// ── SLIDER STATE ─────────────────────────────────────────────
const sliderState = {
  yes: { current: 0, total: 5 },
  no:  { current: 0, total: 5 }
};

const DAY_LABELS = ['Day 0 · Travel', 'Day 1', 'Day 2', 'Day 3', 'Day 4 · Return'];

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

// ── INIT SLIDER DOTS & TABS ──────────────────────────────────
function initSlider(id) {
  const state = sliderState[id];
  
  // Create dots
  const dotsWrap = document.getElementById(`sc-${id}-dots`);
  if (dotsWrap) {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < state.total; i++) {
      const dot = document.createElement('div');
      dot.className = 'sc-dot' + (i === 0 ? ' active' : '');
      dot.onclick = () => goToSlide(id, i);
      dotsWrap.appendChild(dot);
    }
  }

  // Inject day nav strip above slider
  const wrap = document.getElementById(`slider-${id}`);
  if (wrap && !wrap.querySelector('.ds-day-nav-strip')) {
    const strip = document.createElement('div');
    strip.className = 'ds-day-nav-strip';
    strip.id = `nav-strip-${id}`;
    DAY_LABELS.forEach((label, i) => {
      const tab = document.createElement('div');
      tab.className = 'ds-day-tab' + (i === 0 ? ' active' : '');
      tab.textContent = label;
      tab.onclick = () => goToSlide(id, i);
      strip.appendChild(tab);
    });
    wrap.insertBefore(strip, wrap.firstChild);
  }

  updateSliderUI(id);
}

// ── SLIDE NAVIGATION ─────────────────────────────────────────
function slideDay(id, dir) {
  const state = sliderState[id];
  const newIdx = state.current + dir;
  if (newIdx < 0 || newIdx >= state.total) return;
  goToSlide(id, newIdx);
}

function goToSlide(id, idx) {
  const state = sliderState[id];
  if (idx < 0 || idx >= state.total) return;
  state.current = idx;

  const slider = document.getElementById(`dayslider-${id}`);
  if (slider) {
    slider.style.transform = `translateX(-${idx * 100}%)`;
  }

  updateSliderUI(id);

  // Scroll to top of slider
  const wrap = document.getElementById(`slider-${id}`);
  if (wrap) {
    const top = wrap.getBoundingClientRect().top + window.pageYOffset - 60;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function updateSliderUI(id) {
  const state = sliderState[id];
  const idx = state.current;

  // Update dots
  const dotsWrap = document.getElementById(`sc-${id}-dots`);
  if (dotsWrap) {
    dotsWrap.querySelectorAll('.sc-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === idx);
    });
  }

  // Update nav strip tabs
  const strip = document.getElementById(`nav-strip-${id}`);
  if (strip) {
    strip.querySelectorAll('.ds-day-tab').forEach((tab, i) => {
      tab.classList.toggle('active', i === idx);
    });
    // Scroll active tab into view
    const activeTab = strip.querySelectorAll('.ds-day-tab')[idx];
    if (activeTab) {
      activeTab.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
  }

  // Prev / Next buttons
  const prevBtn = document.getElementById(`sc-${id}-prev`);
  const nextBtn = document.getElementById(`sc-${id}-next`);
  if (prevBtn) prevBtn.disabled = idx === 0;
  if (nextBtn) nextBtn.disabled = idx === state.total - 1;
}

// ── SWIPE SUPPORT FOR SLIDERS ────────────────────────────────
function initSwipe(id) {
  const slider = document.getElementById(`dayslider-${id}`);
  if (!slider) return;

  let startX = 0;
  let isDragging = false;

  const getX = (e) => e.touches ? e.touches[0].clientX : e.clientX;

  slider.addEventListener('touchstart', (e) => {
    startX = getX(e);
    isDragging = true;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
    if (Math.abs(diff) > 50) {
      slideDay(id, diff > 0 ? 1 : -1);
    }
    isDragging = false;
  }, { passive: true });

  // Mouse swipe for desktop
  slider.addEventListener('mousedown', (e) => {
    startX = getX(e);
    isDragging = true;
  });

  slider.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    const diff = startX - getX(e);
    if (Math.abs(diff) > 60) {
      slideDay(id, diff > 0 ? 1 : -1);
    }
    isDragging = false;
  });

  slider.addEventListener('mouseleave', () => { isDragging = false; });
}

// ── KEYBOARD NAV FOR ACTIVE SLIDER ──────────────────────────
let activeSlider = null;
document.addEventListener('keydown', (e) => {
  if (!activeSlider) return;
  if (e.key === 'ArrowRight') slideDay(activeSlider, 1);
  if (e.key === 'ArrowLeft') slideDay(activeSlider, -1);
});

// ── MAIN NAV: LANDING → TRIP SECTION ────────────────────────
function goToRajasthan() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('raj-trip').classList.add('visible');
  document.body.classList.remove('mus-mode');
  activeSlider = null;
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
  activeSlider = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // reset
  document.querySelectorAll('.tl-section, .mus-tl-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.date-btn, .chandan-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('raj-shared-section').style.display = 'none';
  document.getElementById('mus-shared-section').style.display = 'none';
}

// ── RAJ: TIMELINE SELECT ─────────────────────────────────────
function selectTL(id) {
  document.querySelectorAll('.tl-section').forEach(s => s.classList.remove('visible'));
  document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
  const section = document.getElementById('raj-section-' + id.replace('raj-', ''));
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

  // Init the slider for this choice
  const sliderId = mode; // 'yes' or 'no'
  sliderState[sliderId].current = 0;
  initSlider(sliderId);
  initSwipe(sliderId);
  activeSlider = sliderId;

  setTimeout(() => {
    if (section) {
      const top = section.getBoundingClientRect().top + window.pageYOffset - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, 120);
  setTimeout(triggerReveal, 300);
}

// ── DAY BLOCK TOGGLE (Rajasthan accordion) ───────────────────
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

  // Auto-open first day in Rajasthan sections
  const autoOpen = [
    '#raj-section-raj-mar18 .day-block',
    '#raj-section-raj-mar27 .day-block',
  ];
  autoOpen.forEach(sel => {
    const el = document.querySelector(sel);
    if (el) el.classList.add('open');
  });
});