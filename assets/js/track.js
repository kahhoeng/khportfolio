/* ==========================================================================
   作品內頁的「領域」：室內設計（interior）／行銷設計（marketing）
   - 從 landing page 進來時網址會帶 ?t=interior 或 ?t=marketing，也會記在 localStorage
   - 內頁的 Logo、Work、← Work Index、上下頁，都只連回同一個領域，不會連到另一邊
   - case.html 會呼叫 KHTrack.list(works) 取得該領域的作品順序
   ========================================================================== */
(function () {
  var KEY = 'kh-track';
  var NAMES = { interior: '室內設計', marketing: '行銷設計' };
  var t = new URLSearchParams(location.search).get('t');
  try {
    if (t && NAMES[t]) localStorage.setItem(KEY, t);
    else t = localStorage.getItem(KEY);
  } catch (e) { /* 無痕模式等情況拿不到 storage，就只看網址 */ }
  if (!NAMES[t]) t = null;

  function withT(href) {
    if (!t || !href || /^(https?:|mailto:|#)/.test(href)) return href;
    var hash = '', i = href.indexOf('#');
    if (i >= 0) { hash = href.slice(i); href = href.slice(0, i); }
    return href + (href.indexOf('?') >= 0 ? '&' : '?') + 't=' + t + hash;
  }

  // 該領域的作品（照 landing page 的排列順序）
  function list(works) {
    if (!t || !works.tracks || !works.tracks[t]) return null;
    var byId = {};
    works.works.forEach(function (w) { byId[w.id] = w; });
    var out = [];
    works.tracks[t].rows.forEach(function (r) { r.works.forEach(function (id) { if (byId[id] && out.indexOf(byId[id]) < 0) out.push(byId[id]); }); });
    return out;
  }

  // 首頁連結改成回到該領域的 landing page
  function fixLinks(root) {
    if (!t) return;
    (root || document).querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      var m = h.match(/^(\.\.\/)?(home|index|works)\.html(#.*)?$/);
      if (m) {
        var hash = m[3] || (m[2] === 'works' ? '#work' : '');
        if (m[2] === 'works') { hash = '#work'; if (a.querySelector('b')) a.querySelector('b').textContent = '全部' + NAMES[t] + '作品'; }
        a.setAttribute('href', (m[1] || '') + t + '.html' + hash);
      } else if (/^(\.\.\/)?projects\/|^[\w-]+\.html(\?|$)|^case\.html/.test(h) && !/[?&]t=/.test(h)) {
        a.setAttribute('href', withT(h));
      }
    });
  }

  // 靜態內頁（studio-grid、emerald）：依領域重算上下頁
  function fixStaticPager() {
    var id = document.body.dataset.workId;
    if (!t || !id) return;
    fetch('../assets/data/works.json', { cache: 'no-cache' }).then(function (r) { return r.json(); }).then(function (works) {
      var L = list(works); if (!L) return;
      var k = L.findIndex(function (w) { return w.id === id; }); if (k < 0) return;
      var pad = function (n) { return String(n).padStart(2, '0'); };
      var prev = L[(k - 1 + L.length) % L.length], next = L[(k + 1) % L.length];
      var cells = document.querySelectorAll('.pager > a.cell:not(.cell--mid)');
      [[cells[0], prev], [cells[cells.length - 1], next]].forEach(function (p) {
        if (!p[0]) return;
        p[0].setAttribute('href', withT('../' + p[1].href));
        p[0].querySelector('b').textContent = pad(L.indexOf(p[1]) + 1) + ' ' + p[1].title.zh;
      });
      var idx = document.getElementById('p-index');
      if (idx) idx.textContent = pad(k + 1) + ' / ' + pad(L.length) + ' · ' + (t === 'interior' ? 'INTERIOR DESIGN' : 'MARKETING DESIGN');
      fixLinks();
    });
  }

  window.KHTrack = { id: t, name: t ? NAMES[t] : null, list: list, withT: withT, fixLinks: fixLinks };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { fixLinks(); fixStaticPager(); });
  else { fixLinks(); fixStaticPager(); }
})();
