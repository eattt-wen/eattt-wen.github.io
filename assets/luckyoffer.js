'use strict';
(() => {
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];const pick=pair=>pair[window.siteLang==='zh'?1:0];
  const frame = $('#lucky-frame');
  let previewPath = '/';
  let previewDevice = window.matchMedia('(max-width: 760px)').matches ? 'mobile' : 'desktop';
  let previewState = 'idle';
  let previewTimer;
  function updatePreviewStatus() {
    const messages = {
      idle: ['The live preview loads when you open this chapter.', '打开这一章后加载实时预览。'],
      loading: ['Loading the live page…', '正在加载真实页面…'],
      loaded: ['Live website · scroll and explore inside the preview.', '实时网页 · 可以在预览内滚动、点击和探索。'],
      waiting: ['The page is taking a little longer. You can also open it directly.', '页面加载较慢，也可以直接打开网站。']
    };
    $('#preview-status').textContent = pick(messages[previewState]);
  }
  function sizePreview() {
    const canvas = $('#preview-canvas');
    const padding = window.matchMedia('(max-width: 760px)').matches ? 16 : 32;
    const available = canvas.clientWidth - padding - (previewDevice === 'mobile' ? 10 : 0);
    if (available <= 0) return;
    const width = previewDevice === 'mobile' ? 390 : 1120;
    const height = previewDevice === 'mobile' ? 780 : 720;
    const heightLimit = frame.dataset.lazy ? (window.innerWidth > 800 ? window.innerHeight * .46 : 520) : height;
    const scale = Math.min(1, available / width, heightLimit / height);
    frame.width = width; frame.height = height;
    frame.style.transform = `scale(${scale})`;
    const viewport = $('#preview-viewport');
    viewport.style.width = `${width * scale}px`;
    viewport.style.height = `${height * scale}px`;
    viewport.classList.toggle('is-mobile', previewDevice === 'mobile');
  }
  function loadPreview(force = false) {
    if (!force && frame.getAttribute('src')) return;
    previewState = 'loading'; updatePreviewStatus();
    clearTimeout(previewTimer);
    const url = 'https://www.luckyoffer.top' + previewPath;
    frame.src = url;
    $('#preview-address').href = url;
    $('#preview-address').textContent = 'luckyoffer.top' + previewPath + ' ↗';
    previewTimer = setTimeout(() => {
      previewState = 'waiting'; updatePreviewStatus();
    }, 15000);
    sizePreview();
  }
  frame.addEventListener('load', () => {
    if (!frame.getAttribute('src')) return;
    clearTimeout(previewTimer);
    // A cross-origin load event cannot prove the page rendered successfully.
    previewState = 'loaded'; updatePreviewStatus();
  });
  frame.addEventListener('error', () => {
    clearTimeout(previewTimer); previewState = 'waiting'; updatePreviewStatus();
  });
  $$('[data-preview-path]').forEach(button => button.addEventListener('click', () => {
    previewPath = button.dataset.previewPath;
    $$('[data-preview-path]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    loadPreview(true);
  }));
  function setDevice(device) {
    previewDevice = device;
    $$('[data-device]').forEach(item => item.setAttribute('aria-pressed', String(item.dataset.device === device)));
    sizePreview();
  }
  $$('[data-device]').forEach(button => button.addEventListener('click', () => setDevice(button.dataset.device)));
  $('#reload-preview').addEventListener('click', () => loadPreview(true));
  if ('ResizeObserver' in window) new ResizeObserver(sizePreview).observe($('#preview-canvas'));
  window.addEventListener('resize', sizePreview);
  setDevice(previewDevice);
  if(frame.dataset.lazy && 'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){loadPreview();observer.disconnect();}},{rootMargin:'400px'});observer.observe(frame);
  }else loadPreview();

document.addEventListener('languagechange',updatePreviewStatus);
})();