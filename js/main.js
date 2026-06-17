/* ============================================================
   ESRA EŞME — Site JavaScript
   Animasyonlar: yıldız alanı, takımyıldızı, meteor, zodiac
   ============================================================ */

// ---- Utility --------------------------------------------
const $ = sel => document.querySelector(sel);
const $$ = sel => [...document.querySelectorAll(sel)];
const rand = (min, max) => Math.random() * (max - min) + min;
const lerp = (a, b, t) => a + (b - a) * t;

// ---- 1. STAR FIELD CANVAS --------------------------------
function initStars() {
  const canvas = $('#starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars(n = 280) {
    stars = Array.from({ length: n }, () => ({
      x: rand(0, W),
      y: rand(0, H),
      r: rand(0.2, 1.5),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.3, 1.2),
      color: Math.random() > 0.85
        ? `rgba(201,168,76,`   // gold stars
        : Math.random() > 0.7
          ? `rgba(163,117,240,` // purple stars
          : `rgba(255,255,255,`,
    }));
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    const time = t / 1000;
    stars.forEach(s => {
      const alpha = 0.15 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.color + alpha + ')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  requestAnimationFrame(draw);
  window.addEventListener('resize', () => { resize(); createStars(); });
}

// ---- 2. CONSTELLATION CANVAS -----------------------------
function initConstellations() {
  const canvas = $('#constellationCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  // Simplified constellation patterns (relative coords 0..1)
  const constellations = [
    { // Orion (left side)
      nodes: [
        [0.05, 0.15], [0.09, 0.22], [0.13, 0.28],
        [0.07, 0.35], [0.15, 0.35], [0.11, 0.42], [0.11, 0.50],
      ],
      edges: [[0,1],[1,2],[2,3],[2,4],[3,5],[4,5],[5,6]],
    },
    { // Ursa Minor (right side)
      nodes: [
        [0.88, 0.12], [0.84, 0.18], [0.80, 0.25],
        [0.76, 0.20], [0.78, 0.14], [0.82, 0.10],
      ],
      edges: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]],
    },
    { // Cassiopeia (top center)
      nodes: [
        [0.35, 0.05], [0.42, 0.10], [0.50, 0.06],
        [0.58, 0.10], [0.65, 0.05],
      ],
      edges: [[0,1],[1,2],[2,3],[3,4]],
    },
    { // Southern Cross (bottom right)
      nodes: [
        [0.80, 0.75], [0.86, 0.82],
        [0.78, 0.82], [0.84, 0.78],
        [0.80, 0.88],
      ],
      edges: [[0,4],[2,3],[1,3]],
    },
  ];

  let phase = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    phase = t / 1000;

    constellations.forEach((c, ci) => {
      const pulse = 0.4 + 0.4 * Math.sin(phase * 0.4 + ci * 1.5);

      // Draw edges
      c.edges.forEach(([a, b]) => {
        const [ax, ay] = c.nodes[a];
        const [bx, by] = c.nodes[b];
        ctx.beginPath();
        ctx.moveTo(ax * W, ay * H);
        ctx.lineTo(bx * W, by * H);
        ctx.strokeStyle = `rgba(201,168,76,${0.08 + 0.1 * pulse})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Draw nodes
      c.nodes.forEach(([nx, ny], ni) => {
        const nodePulse = 0.3 + 0.5 * Math.sin(phase * 0.6 + ni * 0.9 + ci);
        ctx.beginPath();
        ctx.arc(nx * W, ny * H, 1.5 + nodePulse * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${0.35 + 0.45 * nodePulse})`;
        ctx.fill();

        // Glow
        const grad = ctx.createRadialGradient(
          nx * W, ny * H, 0,
          nx * W, ny * H, 6
        );
        grad.addColorStop(0, `rgba(201,168,76,${0.15 * nodePulse})`);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(nx * W, ny * H, 6, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    });

    requestAnimationFrame(draw);
  }

  resize();
  requestAnimationFrame(draw);
  window.addEventListener('resize', resize);
}

// ---- 3. METEOR SHOWER ------------------------------------
function initMeteors() {
  const INTERVAL_MIN = 2200;
  const INTERVAL_MAX = 5500;

  function spawnMeteor() {
    const el = document.createElement('div');
    el.className = 'meteor';

    const startX = rand(10, 90); // % from left
    const startY = rand(-5, 20); // % from top (start above viewport)
    const angle  = rand(25, 50); // degrees diagonal
    const dist   = rand(200, 400);

    const dx = dist * Math.cos((angle * Math.PI) / 180);
    const dy = dist * Math.sin((angle * Math.PI) / 180);
    const dur = rand(600, 1100);

    el.style.cssText = `
      left: ${startX}vw;
      top:  ${startY}vh;
      transform: rotate(${angle}deg);
    `;

    document.body.appendChild(el);

    el.animate([
      { opacity: 0, transform: `rotate(${angle}deg) translate(0,0)` },
      { opacity: 1, transform: `rotate(${angle}deg) translate(${dx * 0.2}px,${dy * 0.2}px)`, offset: 0.1 },
      { opacity: 0, transform: `rotate(${angle}deg) translate(${dx}px,${dy}px)` },
    ], { duration: dur, easing: 'ease-in', fill: 'forwards' }).onfinish = () => el.remove();

    setTimeout(spawnMeteor, rand(INTERVAL_MIN, INTERVAL_MAX));
  }

  // Start after page loads
  setTimeout(spawnMeteor, 2000);
}

// ---- 4. MOON PHASE ROTATION ------------------------------
function initMoonPhase() {
  const phases = [
    { symbol: '🌑', label: 'Yeni Ay' },
    { symbol: '🌒', label: 'Hilal'   },
    { symbol: '🌓', label: 'İlk Dördün' },
    { symbol: '🌔', label: 'Şişen'   },
    { symbol: '🌕', label: 'Dolunay' },
    { symbol: '🌖', label: 'Azalan'  },
    { symbol: '🌗', label: 'Son Dördün' },
    { symbol: '🌘', label: 'Yok Olan'},
  ];

  const sym = $('.moon-phase__symbol');
  const lbl = $('.moon-phase__label');
  if (!sym || !lbl) return;

  let idx = 1; // start at hilal
  sym.textContent = phases[idx].symbol;
  lbl.textContent = phases[idx].label;

  setInterval(() => {
    idx = (idx + 1) % phases.length;
    sym.style.opacity = '0';
    sym.style.transform = 'scale(0.7)';
    setTimeout(() => {
      sym.textContent = phases[idx].symbol;
      lbl.textContent = phases[idx].label;
      sym.style.transition = 'opacity 0.6s, transform 0.6s';
      sym.style.opacity = '1';
      sym.style.transform = 'scale(1)';
    }, 400);
  }, 4000);
}

// ---- 5. PLANET TRAIL on about section --------------------
function initPlanetTrail() {
  const orbit = $('.about__orbit');
  if (!orbit) return;
  const dot = document.createElement('div');
  dot.className = 'planet-trail';
  orbit.appendChild(dot);
}

// ---- 6. HEADER SCROLL ------------------------------------
function initHeader() {
  const header = $('.header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- 7. MOBILE NAV ---------------------------------------
function initMobileNav() {
  const toggle = $('.header__hamburger');
  const nav    = $('.mobile-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    })
  );
}

// ---- 8. SCROLL REVEAL ------------------------------------
function initReveal() {
  const targets = $$('.reveal, .stagger');
  if (!targets.length) return;
  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  targets.forEach(t => io.observe(t));
}

// ---- 9. COUNTER ANIMATION --------------------------------
function initCounters() {
  const els = $$('[data-count]');
  if (!els.length) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1800;
      const start = performance.now();
      const tick = now => {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(ease * end) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

// ---- 10. FORM --------------------------------------------
function initForm() {
  const form = $('.form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form__submit');
    const orig = btn.textContent;
    btn.textContent = '✓ Mesajınız gönderildi';
    btn.style.background = 'linear-gradient(135deg,#4fe8c8,#2ab89a)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// ---- 11. SMOOTH SCROLL -----------------------------------
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a =>
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
  );
}

// ---- 12. PARALLAX SYMBOLS --------------------------------
function initParallax() {
  const symbols = $$('.hero__symbol');
  if (!symbols.length) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      symbols.forEach((s, i) => {
        const speed = 0.05 + (i % 3) * 0.03;
        s.style.transform = `translateY(${y * speed}px)`;
      });
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

// ---- BOOT -----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initConstellations();
  initMeteors();
  initMoonPhase();
  initPlanetTrail();
  initHeader();
  initMobileNav();
  initReveal();
  initCounters();
  initForm();
  initSmoothScroll();
  initParallax();
});
