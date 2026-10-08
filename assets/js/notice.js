(() => {
  const notice = document.querySelector('#selection-notice');
  if (!notice) return;
  const previousFocus = document.activeElement;
  let showShorts = false;
  notice.querySelector('.selection-close').addEventListener('click', () => notice.close());
  notice.querySelector('.notice-enter')?.addEventListener('click', () => {
    showShorts = true;
    notice.close();
  });
  notice.addEventListener('close', () => {
    document.body.classList.remove('notice-open');
    if (showShorts) {
      const video = document.querySelector('#why-mps');
      const play = document.querySelector('#bio-shorts-play');
      if (video) {
        play?.focus({preventScroll: true});
        requestAnimationFrame(() => video.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start'
        }));
        showShorts = false;
        return;
      }
    }
    const target = previousFocus instanceof HTMLElement && previousFocus !== document.body
      ? previousFocus : document.querySelector('.topbar > a');
    target?.focus({preventScroll: true});
  });
  document.body.classList.add('notice-open');
  notice.showModal();
})();
