/* ==========================================================================
   首頁 Work Index — 依類別分列（空間設計／影像／UX/UI 設計）
   - 每列最多 3 件作品；該類別超過 3 件時，最後一條是 More，連到集合頁並篩選該類別
   - highlight 數字決定列內順序，沒有 highlight 的照 works.json 順序
   - 平板／桌機（區塊寬 ≥ 700，iPad 直放也算）：橫向展開直條
       滑鼠：滑過展開，點一下進作品
       觸控：點一下展開，再點一次進作品
   - 手機：直向手風琴，展開後用「看作品」按鈕進入
   ========================================================================== */
import { pick, onChange, lang } from './i18n.js';

const PH = ['sq--glow', 'sq--dark', 'sq--light'];
const pad = (n) => String(n).padStart(2, '0');

function h(tag, attrs = {}, kids = []) {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false || v == null) continue;
    if (k === 'class') n.className = v;
    else if (k === 'text') n.textContent = v;
    else n.setAttribute(k, v === true ? '' : v);
  }
  for (const c of [].concat(kids)) if (c) n.append(c);
  return n;
}

function media(w, i, cls) {
  const box = h('div', { class: cls });
  if (w.thumb) box.append(h('img', { src: w.thumb, alt: '', loading: 'lazy', decoding: 'async', class: w.cover ? 'is-cover' : false }));
  else box.append(h('span', { class: `sq ${PH[i % PH.length]} wx__ph`, 'aria-hidden': 'true' }));
  return box;
}

export async function initWorksIndex() {
  const list = document.querySelector('[data-works-index]');
  if (!list) return;
  const host = list.closest('.wx-wrap') || list.parentElement;
  const hint = document.querySelector('[data-wx-hint]');

  let data;
  try {
    data = await (await fetch(list.dataset.src)).json();
  } catch (err) {
    list.append(h('li', { text: '作品資料載入失敗，請重新整理頁面。' }));
    console.error(err);
    return;
  }
  const cats = new Map(data.categories.map((c) => [c.id, c]));
  const catTag = (w) => {
    const c = cats.get(w.cat);
    return c ? `${c.zh} ${String(c.en || '').toUpperCase()}` : w.cat;
  };

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const isWide = () => host.clientWidth >= 700;
  const mode = () => (finePointer.matches ? 'mouse' : 'touch');

  function syncHint() {
    if (!hint) return;
    const en = lang() === 'en';
    hint.textContent = !isWide()
      ? (en ? 'Tap a title to expand.' : '點標題展開，再點「看作品」進入。')
      : mode() === 'mouse'
        ? (en ? 'Hover to expand, click to open.' : '滑過直條展開，點一下進入作品。')
        : (en ? 'Tap to expand, tap again to open.' : '點直條展開，再點一次進入作品。');
  }

  function workItem(w, k) {
    const id = `wx-${w.id}`;
    const li = h('li', { class: 'wx__item', 'data-href': w.href || '' });
    const hit = h('button', { class: 'wx__hit', type: 'button', 'aria-expanded': 'false', 'aria-controls': id }, [
      h('span', { class: 'wx__num', text: pad(k + 1) }),
      h('span', { class: 'wx__cat', text: w.tools || w.year || '' }),
      h('span', { class: 'wx__title', text: pick(w.title) }),
      h('span', { class: 'wx__chev', 'aria-hidden': 'true' }),
    ]);
    const thumb = media(w, k, 'wx__thumb');
    thumb.setAttribute('aria-hidden', 'true');
    const open = w.href
      ? h('a', { class: 'wx__open', href: w.href }, [lang() === 'en' ? 'View project ' : '看作品 ', h('span', { text: '→' })])
      : h('span', { class: 'wx__soon', text: lang() === 'en' ? 'Case study in progress' : '內頁製作中' });
    const body = h('div', { class: 'wx__body', id }, [
      media(w, k, 'wx__media'),
      h('div', { class: 'wx__detail' }, [
        h('p', { class: 'wx__meta' }, [h('b', { text: catTag(w) }), h('span', { text: w.year || '' })]),
        h('h3', { class: 'wx__name', text: pick(w.title) }),
        h('p', { class: 'wx__summary', text: pick(w.summary) }),
        open,
      ]),
    ]);
    li.append(hit, thumb, body, h('span', { class: 'wx__dot', 'aria-hidden': 'true' }));
    return li;
  }

  // 類別作品超過 3 件時，最後一條是 More：列出其餘作品，連到集合頁並套用該類別篩選
  function moreItem(cat, rest) {
    const id = `wx-more-${cat.id}`;
    const href = `${list.dataset.all || 'works.html'}#cat=${cat.id}`;
    const li = h('li', { class: 'wx__item wx__item--all', 'data-href': href });
    const hit = h('button', { class: 'wx__hit', type: 'button', 'aria-expanded': 'false', 'aria-controls': id }, [
      h('span', { class: 'wx__num', text: `+${rest.length}` }),
      h('span', { class: 'wx__cat', text: 'MORE' }),
      h('span', { class: 'wx__title', text: lang() === 'en' ? `More ${cat.en}` : `更多${cat.zh}` }),
      h('span', { class: 'wx__chev', 'aria-hidden': 'true' }),
    ]);
    // 收起時：一疊灰色漸層方塊，暗示裡面還有作品
    const stack = h('div', { class: 'wx__thumb wx__stack', 'aria-hidden': 'true' }, [
      h('span', { class: 'sq sq--light' }), h('span', { class: 'sq' }), h('span', { class: 'sq sq--dark' }),
    ]);
    const items = h('ol', { class: 'wx__list' }, rest.map(({ w }, k) => h('li', {}, [
      h('span', { class: 'wx__listNum', text: pad(k + 4) }),
      h('span', { class: 'wx__listTitle', text: pick(w.title) }),
      h('span', { class: 'wx__listCat', text: w.year || '' }),
    ])));
    const body = h('div', { class: 'wx__body wx__body--all', id }, [
      h('div', { class: 'wx__detail' }, [
        h('p', { class: 'wx__meta' }, [h('b', { text: 'MORE' }), h('span', { text: lang() === 'en' ? `${rest.length} more` : `還有 ${rest.length} 件` })]),
        h('h3', { class: 'wx__name', text: lang() === 'en' ? `More ${cat.en}` : `更多${cat.zh}` }),
        items,
        h('a', { class: 'wx__open', href }, [lang() === 'en' ? 'See all ' : `看全部${cat.zh} `, h('span', { text: '→' })]),
      ]),
    ]);
    li.append(hit, stack, body, h('span', { class: 'wx__dot', 'aria-hidden': 'true' }));
    return li;
  }

  function setOpen(li) {
    li.parentElement.querySelectorAll('.wx__item').forEach((p) => {
      const on = p === li;
      p.classList.toggle('is-open', on);
      p.querySelector('.wx__hit').setAttribute('aria-expanded', String(on));
    });
  }

  // 每個類別一列：最多 3 件（highlight 數字小的優先，其餘照資料順序），超過才加 More
  function render() {
    const rows = data.categories.map((cat) => {
      const works = data.works.map((w, i) => ({ w, i })).filter(({ w }) => w.cat === cat.id)
        .sort((a, b) => ((a.w.highlight ?? 99) - (b.w.highlight ?? 99)) || (a.i - b.i));
      if (!works.length) return null;
      const shown = works.slice(0, 3);
      const rest = works.slice(3);
      const ul = h('ul', { class: 'wx', 'aria-label': cat.zh }, shown.map(({ w }, k) => workItem(w, k)));
      if (rest.length) ul.append(moreItem(cat, rest));
      ul.style.setProperty('--n', ul.children.length);
      setOpen(ul.firstElementChild);
      return h('section', { class: 'wx-row', 'aria-label': cat.zh }, [
        h('header', { class: 'wx-row__head' }, [
          h('span', { class: 'wx-row__tag', text: `[ ${String(cat.en || cat.id).toUpperCase()} ]` }),
          h('h3', { class: 'wx-row__name', text: cat.zh }),
          h('span', { class: 'wx-row__count', text: `/ ${pad(works.length)}` }),
        ]),
        ul,
      ]);
    }).filter(Boolean);
    list.replaceChildren(...rows);
    syncHint();
  }

  /* ---- 互動 ---- */
  list.addEventListener('mouseover', (e) => {
    if (mode() !== 'mouse' || !isWide()) return;
    const li = e.target.closest('.wx__item');
    if (li && !li.classList.contains('is-open')) setOpen(li);
  });

  let pointerFocus = false;
  list.addEventListener('pointerdown', () => { pointerFocus = true; });
  list.addEventListener('click', (e) => {
    pointerFocus = false;
    const hit = e.target.closest('.wx__hit');
    if (!hit) return;
    const li = hit.closest('.wx__item');
    const wasOpen = li.classList.contains('is-open');
    if (!isWide()) {                                   // 手機：開／關
      if (wasOpen) { li.classList.remove('is-open'); hit.setAttribute('aria-expanded', 'false'); }
      else setOpen(li);
      return;
    }
    if ((mode() === 'mouse' || wasOpen) && li.dataset.href) location.href = li.dataset.href;
    else setOpen(li);
  });
  // 鍵盤：Tab 到直條就展開，← → 切換
  list.addEventListener('focusin', (e) => {
    if (pointerFocus) return;
    const hit = e.target.closest('.wx__hit');
    if (hit && isWide()) setOpen(hit.closest('.wx__item'));
  });
  list.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key) || !isWide()) return;
    const li = e.target.closest('.wx__item'); if (!li) return;
    const sib = e.key === 'ArrowRight' ? li.nextElementSibling : li.previousElementSibling;  // 只在同一列內切換
    if (sib) { e.preventDefault(); sib.querySelector('.wx__hit').focus(); }
  });

  new ResizeObserver(syncHint).observe(host);
  finePointer.addEventListener('change', syncHint);
  render();
  onChange(render);
}
