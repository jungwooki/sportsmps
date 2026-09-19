(() => {
  const notice = document.querySelector('#selection-notice');
  if (!notice) return;
  const previousFocus = document.activeElement;
  notice.querySelector('.selection-close').addEventListener('click', () => notice.close());
  notice.addEventListener('close', () => {
    document.body.classList.remove('notice-open');
    const target = previousFocus instanceof HTMLElement && previousFocus !== document.body
      ? previousFocus : document.querySelector('.topbar > a');
    target?.focus({preventScroll: true});
  });
  document.body.classList.add('notice-open');
  notice.showModal();
})();
