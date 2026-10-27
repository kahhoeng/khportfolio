/* ==========================================================================
   i18n — 中英切換
   - 中文寫在 HTML 裡（預設），英文放在 assets/i18n/en.json。
   - 有 data-i18n="key" 的元素會被替換；en.json 沒有的 key 會保留中文。
   - 英文準備好之後，把 ENABLE_EN 改成 true，右上角就會出現「中 / EN」切換。
   ========================================================================== */

export const ENABLE_EN = false;

const STORE_KEY = 'kh-lang';
const listeners = new Set();
let current = 'zh-Hant';
let dict = null;
const original = new Map();   // 記住每個元素的中文原文

export function lang() { return current; }

/** 取得雙語欄位的值：{ zh, en } → 依目前語言回傳，英文空白時退回中文 */
export function pick(field) {
  if (field == null || typeof field === 'string') return field ?? '';
  return (current === 'en' && field.en) ? field.en : (field.zh ?? '');
}

export function onChange(fn) { listeners.add(fn); }

async function loadDict() {
  if (dict) return dict;
  try {
    const res = await fetch(new URL('../i18n/en.json', import.meta.url));
    dict = res.ok ? await res.json() : {};
  } catch { dict = {}; }
  return dict;
}

function applyStatic() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (!original.has(el)) original.set(el, el.textContent);
    el.textContent = (current === 'en' && dict && dict[key]) ? dict[key] : original.get(el);
  });
  document.documentElement.lang = current;
}

export async function setLang(next) {
  current = next === 'en' ? 'en' : 'zh-Hant';
  if (current === 'en') await loadDict();
  applyStatic();
  try { localStorage.setItem(STORE_KEY, current); } catch { /* 私密模式等情況，忽略 */ }
  document.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === current)));
  listeners.forEach((fn) => fn(current));
}

export async function initI18n() {
  if (!ENABLE_EN) return;
  const sw = document.querySelector('[data-lang-switch]');
  if (sw) {
    sw.hidden = false;
    sw.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lang]');
      if (b) setLang(b.dataset.lang);
    });
  }
  let saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch { /* ignore */ }
  if (saved === 'en') await setLang('en');
}
