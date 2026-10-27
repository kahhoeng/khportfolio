/* ==========================================================================
   Lightbox — 點圖放大看 CAD 細節
   用法：<button class="zoom" data-zoom data-caption="說明"><img src="..." alt="..."></button>
   使用原生 <dialog>，Esc 關閉、焦點自動回到原本的按鈕。
   ========================================================================== */

export function initLightbox() {
  const triggers = document.querySelectorAll('[data-zoom]');
  if (!triggers.length) return;

  const dlg = document.createElement('dialog');
  dlg.className = 'lightbox';
  dlg.setAttribute('aria-label', '圖片放大檢視');
  dlg.innerHTML = `
    <div class="lightbox__bar">
      <span class="lightbox__caption"></span>
      <div class="lightbox__actions">
        <button type="button" class="lightbox__btn" data-act="zoom" aria-pressed="false">放大</button>
        <button type="button" class="lightbox__btn" data-act="close" aria-label="關閉">✕</button>
      </div>
    </div>
    <div class="lightbox__stage"><img alt=""></div>`;
  document.body.append(dlg);

  const img = dlg.querySelector('img');
  const cap = dlg.querySelector('.lightbox__caption');
  const zoomBtn = dlg.querySelector('[data-act="zoom"]');
  const stage = dlg.querySelector('.lightbox__stage');

  const setZoom = (on) => {
    dlg.classList.toggle('is-zoomed', on);
    zoomBtn.setAttribute('aria-pressed', String(on));
    zoomBtn.textContent = on ? '縮小' : '放大';
    if (on) {
      requestAnimationFrame(() => {
        stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
        stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
      });
    }
  };

  triggers.forEach((t) => t.addEventListener('click', () => {
    const src = t.querySelector('img');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    cap.textContent = t.dataset.caption || src.alt;
    setZoom(false);
    dlg.showModal();
  }));

  dlg.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'close') dlg.close();
    else if (act === 'zoom') setZoom(!dlg.classList.contains('is-zoomed'));
    else if (e.target === img) setZoom(!dlg.classList.contains('is-zoomed'));
  });
}
