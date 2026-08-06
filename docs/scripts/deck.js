/* Minimal deck engine: keyboard nav, hash routing, TOC, fullscreen,
   speaker notes, scale-to-fit 1280x720, video fallback. No dependencies. */
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const hud = document.getElementById('hud');
  const progress = document.getElementById('progress');
  const toc = document.getElementById('toc');
  const notesPanel = document.getElementById('notesPanel');
  let cur = 0;

  function scale() {
    const s = Math.min(innerWidth / 1280, innerHeight / 720);
    slides.forEach(el => { el.style.transform = `scale(${s})`; });
  }

  function show(i) {
    cur = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((el, k) => el.classList.toggle('current', k === cur));
    hud.textContent = (cur + 1) + ' / ' + slides.length;
    progress.style.width = ((cur + 1) / slides.length * 100) + '%';
    location.hash = '#/' + (cur + 1);
    renderNotes();
    // pause any videos on non-current slides
    document.querySelectorAll('.slide video').forEach(v => {
      if (!v.closest('.slide').classList.contains('current')) v.pause();
    });
  }

  function renderNotes() {
    if (!notesPanel) return;
    const n = slides[cur].querySelector('aside.notes');
    notesPanel.innerHTML = '<div class="t">SLIDE ' + (cur + 1) + ' — SPEAKER NOTES (n키로 닫기)</div>'
      + (n ? n.innerHTML : '<p>(노트 없음)</p>');
  }

  function buildToc() {
    const ol = toc.querySelector('ol');
    slides.forEach((el, i) => {
      const t = el.dataset.title || (el.querySelector('h1,h2') || {}).textContent || 'Slide ' + (i + 1);
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = t;
      a.onclick = () => { toc.classList.remove('open'); show(i); };
      li.appendChild(a); ol.appendChild(li);
    });
  }

  addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); show(cur + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); show(cur - 1); }
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(slides.length - 1);
    else if (e.key === 'f') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen(); }
    else if (e.key === 't' || e.key === 'o') toc.classList.toggle('open');
    else if (e.key === 'n') { notesPanel.classList.toggle('open'); renderNotes(); }
    else if (e.key === 'Escape') { toc.classList.remove('open'); notesPanel.classList.remove('open'); }
  });
  addEventListener('resize', scale);

  // video failure -> show key-frame fallback
  document.querySelectorAll('video').forEach(v => {
    v.addEventListener('error', () => v.classList.add('failed'), true);
  });

  buildToc();
  scale();
  const m = location.hash.match(/#\/(\d+)/);
  show(m ? parseInt(m[1], 10) - 1 : 0);
})();
