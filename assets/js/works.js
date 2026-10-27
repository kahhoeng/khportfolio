/* ==========================================================================
   Work index — 讀 assets/data/works.json，產生作品卡片與分類篩選
   ========================================================================== */
import { pick, onChange, lang } from './i18n.js';

const PLACEHOLDER_SHAPES = [
  ['sq--glow', 'left:16%;top:20%;width:38%'],
  ['sq--dark', 'right:18%;top:24%;width:30%'],
  ['sq--light', 'left:30%;bottom:16%;width:34%'],
  ['', 'left:20%;top:28%;width:42%'],
];

function el(tag, attrs = {}, children = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of [].concat(children)) if (c) n.append(c);
  return n;
}

function media(work, index) {
  const box = el('div', { class: 'work-card__media' + (work.thumb ? '' : ' placeholder') });
  if (work.thumb) {
    box.append(el('img', {
      src: work.thumb,
      alt: '',
      loading: 'lazy',
      decoding: 'async',
      class: work.cover ? 'is-cover' : false,
    }));
  } else {
    const [variant, pos] = PLACEHOLDER_SHAPES[index % PLACEHOLDER_SHAPES.length];
    box.append(el('span', { class: `sq ${variant}`, style: `${pos};aspect-ratio:1;`, 'aria-hidden': 'true' }));
    box.append(el('span', { class: 'placeholder__label', text: lang() === 'en' ? 'Image coming soon' : '圖片待補' }));
  }
  return box;
}

function card(work, index, catLabel) {
  const title = pick(work.title);
  const body = el('div', { class: 'work-card__body' }, [
    el('div', { class: 'work-card__meta' }, [
      el('span', {}, [
        el('span', { class: 'work-card__cat', text: catLabel }),
        el('span', { class: 'work-card__tools', text: work.tools ? ` · ${work.tools}` : '' }),
      ]),
      el('span', { text: work.year ?? '' }),
    ]),
    el('h3', { class: 'work-card__title', text: title }),
    el('p', { class: 'work-card__summary', text: pick(work.summary) }),
    work.href
      ? el('span', { class: 'work-card__more', 'aria-hidden': 'true', text: lang() === 'en' ? 'View project →' : '看作品 →' })
      : el('span', { class: 'work-card__status', text: lang() === 'en' ? 'Case study in progress' : '內頁製作中' }),
  ]);
  const inner = [
    el('span', { class: 'work-card__num', 'aria-hidden': 'true', text: `/ ${String(index + 1).padStart(2, '0')}` }),
    media(work, index),
    body,
  ];

  const li = el('li', {
    class: 'work-card reveal is-visible' + (work.feature ? ' work-card--feature' : ''),
    'data-cat': work.cat,
  });
  li.append(work.href ? el('a', { class: 'work-card__link', href: work.href }, inner) : el('div', { class: 'work-card__link' }, inner));
  return li;
}

export async function initWorks() {
  const list = document.querySelector('[data-works]');
  const filters = document.querySelector('[data-filters]');
  if (!list) return;

  let data;
  try {
    const res = await fetch(list.dataset.src);
    data = await res.json();
  } catch (err) {
    list.append(el('li', { text: '作品資料載入失敗，請重新整理頁面。' }));
    console.error(err);
    return;
  }

  const cats = new Map(data.categories.map((c) => [c.id, c]));
  let active = 'all';

  function render() {
    list.replaceChildren(...data.works.map((w, i) => card(w, i, pick(cats.get(w.cat)) || w.cat)));
    applyFilter();
  }

  function buildFilters() {
    filters.querySelectorAll('[data-filter]:not([data-filter="all"])').forEach((b) => b.remove());
    for (const c of data.categories) {
      const count = data.works.filter((w) => w.cat === c.id).length;
      const b = el('button', { class: 'filter', type: 'button', 'data-filter': c.id, 'aria-pressed': String(active === c.id) }, [
        el('span', { text: pick(c) }),
        el('span', { class: 'filter__count', text: String(count) }),
      ]);
      filters.append(b);
    }
    filters.querySelector('[data-filter="all"] .filter__count').textContent = String(data.works.length);
  }

  function applyFilter() {
    list.querySelectorAll('.work-card').forEach((li) => {
      li.hidden = !(active === 'all' || li.dataset.cat === active);
    });
    filters.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === active)));
  }

  filters.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    active = b.dataset.filter;
    applyFilter();
  });

  buildFilters();
  render();
  onChange(() => { buildFilters(); render(); });
}
