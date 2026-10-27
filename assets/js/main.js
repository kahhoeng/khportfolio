/* ==========================================================================
   KH Portfolio — entry
   每個功能都先檢查頁面上有沒有對應元素，所以首頁和作品內頁共用這支檔案。
   ========================================================================== */
import { initI18n } from './i18n.js';
import { initWorks } from './works.js';
import { initLightbox } from './lightbox.js';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Header：捲動後加底線 ---- */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---- 手機選單 ---- */
function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const list = document.getElementById('nav-list');
  if (!toggle || !list) return;

  const set = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
    list.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
  list.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  window.matchMedia('(min-width: 992px)').addEventListener('change', () => set(false));

  // 目前所在區塊高亮
  const links = [...list.querySelectorAll('a[href^="#"]')];
  const targets = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!targets.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => {
        if (a.getAttribute('href') === `#${en.target.id}`) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  targets.forEach((t) => io.observe(t));
}

/* ---- 捲動淡入 ---- */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.is-visible)');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  els.forEach((el) => io.observe(el));
}

/* ---- 方塊視差：data-depth 越大移動越多 ---- */
function initParallax() {
  if (reduceMotion) return;
  const items = [...document.querySelectorAll('[data-depth]')];
  if (!items.length) return;

  let px = 0, py = 0, sy = window.scrollY, ticking = false;
  const update = () => {
    ticking = false;
    for (const el of items) {
      const d = parseFloat(el.dataset.depth) || 0;
      el.style.transform = `translate3d(${(px * d * 18).toFixed(1)}px, ${(py * d * 18 - sy * d * 0.25).toFixed(1)}px, 0)`;
    }
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };

  window.addEventListener('scroll', () => { sy = window.scrollY; request(); }, { passive: true });
  if (window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
      request();
    }, { passive: true });
  }
  update();
}

/* ---- d3 時間軸：接近畫面時才載入 d3 ---- */
function initTimelineLazy() {
  const host = document.querySelector('[data-timeline]');
  if (!host) return;
  const load = () => import('./timeline.js')
    .then((m) => m.initTimeline(host))
    .catch((err) => {
      console.error(err);
      host.innerHTML = '<p class="timeline__hint">時間軸載入失敗，請重新整理頁面。</p>';
    });
  if (!('IntersectionObserver' in window)) { load(); return; }
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); load(); }
  }, { rootMargin: '400px 0px' });
  io.observe(host);
}

initHeader();
initNav();
initReveal();
initParallax();
initLightbox();
initI18n().then(() => {
  initWorks();
  initTimelineLazy();
});
