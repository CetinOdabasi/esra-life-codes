/* ============================================================
   ESRA YILDIZ — Site JavaScript
   ============================================================ */

// ---- Star Canvas ----------------------------------------
function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars(n = 240) {
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.006 + 0.002,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const now = performance.now() / 1000;
    stars.forEach(s => {
      const alpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(now * s.speed * 6 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  draw();
  window.addEventListener('resize', () => { resize(); createStars(); });
}

// ---- Header scroll behaviour ----------------------------
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;
  const onScroll = () =>
    header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ---- Mobile nav -----------------------------------------
function initMobileNav() {
  const toggle = document.querySelector('.header__hamburger');
  const nav    = document.querySelector('.mobile-nav');
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

// ---- Scroll reveal --------------------------------------
function initReveal() {
  const targets = document.querySelectorAll('.reveal, .stagger');
  if (!targets.length) return;

  const io = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  targets.forEach(t => io.observe(t));
}

// ---- Counter animation ----------------------------------
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count, 10);
      const dur = 1800;
      const start = performance.now();
      const suffix = el.dataset.suffix || '';

      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(ease * end) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
}

// ---- Form submission ------------------------------------
function initForm() {
  const form = document.querySelector('.form');
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

// ---- Smooth anchor scrolling ----------------------------
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ---- Boot -----------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initHeader();
  initMobileNav();
  initReveal();
  initCounters();
  initForm();
  initSmoothScroll();
});
