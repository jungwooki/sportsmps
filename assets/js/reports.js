(() => {
  const dialog = document.querySelector('#sample-dialog');
  const opener = document.querySelector('#sample-open');
  const viewer = document.querySelector('#sample-viewer');
  const tabs = [...dialog.querySelectorAll('[role="tab"]')];
  const panels = [...dialog.querySelectorAll('[role="tabpanel"]')];
  const previous = document.querySelector('#sample-prev');
  const next = document.querySelector('#sample-next');
  const names = ['멘탈', '피지컬', '성장'];
  let active = 0;
  let scrollYBeforeOpen = 0;
  let queued = false;
  function select(index) {
    active = index;
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
      panels[i].inert = i !== index;
      panels[i].tabIndex = i === index ? 0 : -1;
    });
    previous.disabled = index === 0;
    next.disabled = index === panels.length - 1;
    document.querySelector('#sample-position').textContent = `${names[index]} · ${index + 1} / 3`;
  }
  function move(index) {
    index = Math.max(0, Math.min(panels.length - 1, index));
    // Native horizontal scrolling preserves vertical reading and pinch zoom on phones.
    viewer.scrollTo({left: index * viewer.clientWidth, behavior:'instant'});
    select(index);
  }
  opener.hidden = false;
  opener.addEventListener('click', () => {
    scrollYBeforeOpen = window.scrollY;
    document.body.classList.add('samples-open');
    dialog.showModal();
    dialog.scrollTop = 0;
    if (!document.querySelector('#mobile-preview').hidden) move(active);
  });
  document.querySelector('#sample-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('samples-open');
    window.scrollTo({top:scrollYBeforeOpen, behavior:'instant'});
    opener.focus({preventScroll:true});
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => move(index));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') target = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { event.preventDefault(); move(target); tabs[target].focus(); }
    });
  });
  previous.addEventListener('click', () => move(active - 1));
  next.addEventListener('click', () => move(active + 1));
  viewer.addEventListener('scroll', () => {
    if (queued || !viewer.clientWidth) return;
    queued = true;
    requestAnimationFrame(() => { if (viewer.clientWidth) select(Math.max(0, Math.min(2, Math.round(viewer.scrollLeft / viewer.clientWidth)))); queued = false; });
  }, {passive:true});
  addEventListener('resize', () => { if (dialog.open && !document.querySelector('#mobile-preview').hidden) move(active); });
  const formats = ['mobile', 'pdf'];
  formats.forEach(format => {
    document.querySelector('#format-' + format).addEventListener('click', () => {
      formats.forEach(name => {
        document.querySelector('#format-' + name).setAttribute('aria-pressed', String(name === format));
        document.querySelector('#' + name + '-preview').hidden = name !== format;
      });
      dialog.scrollTo({top:0, behavior:'instant'});
      if (format === 'mobile') move(active);
    });
  });
})();
