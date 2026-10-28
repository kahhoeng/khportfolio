/* ==========================================================================
   KH Portfolio — entry
   改了 JS 或 CSS 之後，把 HTML 與這裡的 ?v= 版本號一起更新，瀏覽器才不會用到舊的快取。
   每個功能都先檢查頁面上有沒有對應元素，所以首頁和作品內頁共用這支檔案。
   ========================================================================== */
import { initI18n } from './i18n.js';
import { initWorks } from './works.js?v=20261028c';
import { initWorksIndex } from './works-index.js?v=20261028c';
import { initLightbox } from './lightbox.js?v=20261028c';

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

/* ---- 方塊 Pop up 進場：區塊進入畫面時，方塊依 --i 順序彈出 ---- */
function initPop() {
  const groups = new Map();
  document.querySelectorAll('.sq--cell, .dots--cell, .cover-art > .ca').forEach((el) => {
    const host = el.closest('section') || document.body;
    if (!groups.has(host)) groups.set(host, []);
    groups.get(host).push(el);
  });
  if (!groups.size) return;
  if (reduceMotion || !('IntersectionObserver' in window)) return;   // CSS 會直接顯示

  groups.forEach((els) => els.forEach((el) => el.classList.add('pop')));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      groups.get(en.target).forEach((el) => el.classList.add('is-popped'));
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  groups.forEach((_, host) => io.observe(host));
}

/* ---- 捲動時方塊浮動：依捲動速度稍微錯位，停下來後慢慢回到格線上 ---- */
function initScrollFloat() {
  if (reduceMotion) return;
  const items = [...document.querySelectorAll('.sq--cell, .dots--cell, .cover-art > .ca')];
  if (!items.length) return;

  // 每個方塊不同的「重量」與偏移方向，讓它們不會整齊劃一地移動
  const params = items.map((el, i) => {
    const r1 = Math.sin((i + 1) * 12.9898) * 43758.5453 % 1;
    const r2 = Math.sin((i + 1) * 78.233) * 12345.6789 % 1;
    return {
      el,
      depth: 0.35 + Math.abs(r1) * 0.9,          // 0.35–1.25：越大飄得越多
      side: (Math.abs(r2) - 0.5) * 0.8,                    // 左右偏移的比例
      max: (+getComputedStyle(el).getPropertyValue('--w') || 1) > 1 ? 18 : 30,   // 大方塊飄得少一點
    };
  });

  let lastY = window.scrollY;
  let target = 0;       // 這一刻的捲動速度
  let current = 0;      // 平滑後的速度（決定位移）
  let running = false;

  const frame = () => {
    const y = window.scrollY;
    target = Math.max(-40, Math.min(40, (y - lastY) * 1.6));
    lastY = y;
    current += (target - current) * 0.08;      // 越小越「黏」、越有漂浮感
    for (const p of params) {
      const dy = Math.max(-p.max, Math.min(p.max, current * p.depth));
      const dx = dy * p.side;
      p.el.style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`;
    }
    if (Math.abs(current) > 0.05 || Math.abs(target) > 0.05) {
      requestAnimationFrame(frame);
    } else {
      for (const p of params) p.el.style.translate = '0px 0px';   // 完全回到格線
      running = false;
    }
  };

  window.addEventListener('scroll', () => {
    if (!running) { running = true; lastY = window.scrollY; requestAnimationFrame(frame); }
  }, { passive: true });
}

/* ---- 封面方塊自己動：每 3 秒挑兩個方塊，往附近輕輕挪一點，偶爾回到原位 ----
   位移用 transform（捲動浮動用的是 translate，兩者會疊加，不會互相蓋掉）。
   畫面看不到封面、或分頁在背景時暫停；使用者設定「減少動態」時不啟動。 */
function initIdleShift() {
  if (reduceMotion) return;
  const art = document.querySelector('.hero .cover-art');
  if (!art) return;
  const items = [...art.querySelectorAll('.ca--sq, .ca--outline')];
  if (!items.length) return;

  // 彈出動畫結束後拿掉 pop 樣式，transform 才能自由使用
  items.forEach((el) => {
    el.addEventListener('animationend', () => el.classList.remove('pop', 'is-popped'), { once: true });
    el.style.transition = 'transform 1.6s cubic-bezier(0.45, 0, 0.2, 1)';
  });

  const RANGE = 2;     // 最大位移（cqi，約為封面寬度的 2%）
  let visible = true;
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; }).observe(art);

  const tick = () => {
    if (!visible || document.hidden) return;
    const ready = items.filter((el) => !el.classList.contains('pop'));
    for (let k = 0; k < 2 && ready.length; k++) {
      const el = ready.splice(Math.floor(Math.random() * ready.length), 1)[0];
      if (Math.random() < 0.3) { el.style.transform = ''; continue; }      // 回到原位
      const dx = (Math.random() * 2 - 1) * RANGE;
      const dy = (Math.random() * 2 - 1) * RANGE;
      el.style.transform = `translate(${dx.toFixed(2)}cqi, ${dy.toFixed(2)}cqi)`;
    }
  };
  setInterval(tick, 3000);
}

/* ---- d3 時間軸：接近畫面時才載入 d3 ---- */
function initTimelineLazy() {
  const host = document.querySelector('[data-timeline]');
  if (!host) return;
  const load = () => import('./timeline.js?v=20261028c')
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
initPop();
initScrollFloat();
initIdleShift();
initLightbox();
initI18n().then(() => {
  initWorks();
  initWorksIndex();
  initTimelineLazy();
});
