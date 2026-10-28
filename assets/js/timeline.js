/* ==========================================================================
   Path timeline — d3
   d3 只打包用到的子模組（selection / scale / axis / time-format），
   放在 assets/vendor/d3-lite.min.js（約 45KB），不依賴外部 CDN。
   需要更多 d3 功能時，見 README 的「更新 d3」。
   資料在 assets/data/timeline.json。
   ========================================================================== */
import { select, scaleTime, scaleBand, axisBottom, timeFormat, timeParse } from '../vendor/d3-lite.min.js';
import { pick, onChange } from './i18n.js';

const parse = timeParse('%Y-%m');
const fmtYear = timeFormat('%Y');
const MIN_WIDTH = 720;          // 手機上維持可讀寬度，改為左右滑動
const LANE_H = 58;
const BAR_H = 22;
const M = { top: 24, right: 96, bottom: 34, left: 64 };

function shortLabel(item) {
  if (item.label) return pick(item.label);
  const t = pick(item.title);
  return t.split(/[｜|—]/)[0].trim();
}

function textWidth(str) {
  // 粗估：中日韓字約 13px，其他約 7px
  let w = 0;
  for (const ch of str) w += /[　-鿿＀-￯]/.test(ch) ? 13 : 7;
  return w;
}

export async function initTimeline(host) {
  const detail = document.querySelector('[data-timeline-detail]');
  const res = await fetch(host.dataset.src, { cache: 'no-cache' });
  const data = await res.json();

  const now = new Date();
  const items = data.items.map((d, i) => ({
    ...d,
    i,
    s: parse(d.start),
    e: d.end === 'now' ? now : (d.end ? parse(d.end) : null),
  }));
  let active = items.length - 1;

  host.style.overflowX = 'auto';
  host.style.overscrollBehaviorX = 'contain';
  host.setAttribute('tabindex', '-1');

  function showDetail() {
    const d = items[active];
    detail.querySelector('.timeline__detail-period').textContent = d.period;
    detail.querySelector('.timeline__detail-title').textContent = pick(d.title);
    detail.querySelector('.timeline__detail-note').textContent = pick(d.note);
  }

  function draw() {
    const width = Math.max(host.clientWidth, MIN_WIDTH);
    const height = M.top + data.lanes.length * LANE_H + M.bottom;

    const x = scaleTime()
      .domain(data.domain.map(parse))
      .range([M.left, width - M.right]);
    const y = scaleBand()
      .domain(data.lanes.map((l) => l.id))
      .range([M.top, M.top + data.lanes.length * LANE_H])
      .paddingInner(0);

    select(host).select('svg').remove();
    const svg = select(host).append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', width)
      .attr('height', height)
      .style('min-width', `${MIN_WIDTH}px`)
      .attr('role', 'group')
      .attr('aria-label', '經歷時間軸');

    const defs = svg.append('defs');
    const g = defs.append('linearGradient').attr('id', 'tl-grad').attr('x1', '0').attr('y1', '0').attr('x2', '1').attr('y2', '1');
    g.append('stop').attr('offset', '0%').attr('stop-color', '#eeeeee');
    g.append('stop').attr('offset', '55%').attr('stop-color', '#b4b6b8');
    g.append('stop').attr('offset', '100%').attr('stop-color', '#83868a');

    // lanes
    const lanes = svg.append('g');
    data.lanes.forEach((l) => {
      const cy = y(l.id) + y.bandwidth() / 2;
      lanes.append('line').attr('class', 'lane-rule')
        .attr('x1', M.left).attr('x2', width - M.right).attr('y1', cy).attr('y2', cy);
      lanes.append('text').attr('class', 'lane-label')
        .attr('x', 0).attr('y', cy).attr('dy', '0.35em').text(pick(l));
    });

    // axis
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0, ${height - M.bottom + 6})`)
      .call(axisBottom(x).ticks(width < 900 ? 8 : 16).tickFormat(fmtYear).tickSizeOuter(0));

    // now line
    svg.append('line').attr('class', 'now-line')
      .attr('x1', x(now)).attr('x2', x(now)).attr('y1', M.top - 4).attr('y2', height - M.bottom + 6);
    svg.append('text').attr('class', 'now-label')
      .attr('x', x(now) + 4).attr('y', M.top + 2).text('NOW');

    // items
    const nodes = svg.append('g').selectAll('g.item')
      .data(items)
      .join('g')
      .attr('class', (d) => 'item' + (d.i === active ? ' is-active' : ''))
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d) => `${d.period} ${pick(d.title)}`)
      .attr('aria-pressed', (d) => String(d.i === active));

    nodes.each(function (d) {
      const node = select(this);
      const cy = y(d.lane) + y.bandwidth() / 2;
      const label = shortLabel(d);
      if (d.e) {
        const x0 = x(d.s);
        const w = Math.max(x(d.e) - x0, 8);
        node.append('rect')
          .attr('x', x0).attr('y', cy - BAR_H / 2)
          .attr('width', w).attr('height', BAR_H).attr('rx', 4);
        const tw = textWidth(label);
        const fits = tw + 16 < w;
        const nearEnd = x0 + w + tw + 6 > width - 4;   // 靠右邊界時改成靠右對齊，避免被裁掉
        node.append('text')
          .attr('x', fits ? x0 + 8 : (nearEnd ? x0 + w : x0 + w + 6))
          .attr('y', fits ? cy : cy - BAR_H / 2 - 6)
          .attr('dy', fits ? '0.35em' : '0')
          .attr('text-anchor', !fits && nearEnd ? 'end' : 'start')
          .text(label);
      } else {
        node.append('circle').attr('cx', x(d.s)).attr('cy', cy).attr('r', 7);
        node.append('text').attr('x', x(d.s)).attr('y', cy - 16).attr('text-anchor', 'middle').text(label);
      }
    });

    const activate = (d) => {
      active = d.i;
      nodes.classed('is-active', (n) => n.i === active).attr('aria-pressed', (n) => String(n.i === active));
      showDetail();
    };
    nodes
      .on('click', (_, d) => activate(d))
      .on('keydown', (ev, d) => {
        if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); activate(d); }
      });
  }

  draw();
  showDetail();
  // 手機上一開始捲到最右邊（最近的經歷）
  host.scrollLeft = host.scrollWidth;

  let raf = 0;
  let lastW = host.clientWidth;
  new ResizeObserver(() => {
    if (Math.abs(host.clientWidth - lastW) < 2) return;
    lastW = host.clientWidth;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  }).observe(host);

  onChange(() => { draw(); showDetail(); });
}
