(() => {
  const poster = document.querySelector('.poster');
  const wrap = document.querySelector('.canvas-wrap');
  const status = document.querySelector('#editor-status');
  const editButton = document.querySelector('#edit-toggle');
  const fit = () => {
    const scale = Math.min(1, Math.max(0.1, (window.innerWidth - 24) / 1000));
    poster.style.transform = `scale(${scale})`;
    wrap.style.width = `${1000 * scale}px`;
    wrap.style.height = `${1415 * scale}px`;
  };
  window.addEventListener('resize', fit);
  fit();
  editButton.addEventListener('click', () => {
    const editing = editButton.getAttribute('aria-pressed') !== 'true';
    editButton.setAttribute('aria-pressed', String(editing));
    editButton.textContent = editing ? '편집 완료' : '문구 편집';
    document.querySelectorAll('[data-editable]').forEach(el => {
      if (editing) el.setAttribute('contenteditable', 'true');
      else el.removeAttribute('contenteditable');
    });
    status.textContent = editing ? '문구·수치를 클릭해 수정하세요. 수정 후 ‘수정본 저장’을 눌러주세요.' : 'A1 세로형 · 594 × 841 mm · A2Z';
  });
  poster.addEventListener('paste', event => {
    if (!event.target.isContentEditable) return;
    event.preventDefault();
    document.execCommand('insertText', false, event.clipboardData.getData('text/plain'));
  });
  document.querySelector('#print-panel').addEventListener('click', () => window.print());
  document.querySelector('#save-copy').addEventListener('click', () => {
    const clone = document.documentElement.cloneNode(true);
    clone.querySelectorAll('[contenteditable]').forEach(el => el.removeAttribute('contenteditable'));
    clone.querySelector('#edit-toggle').setAttribute('aria-pressed', 'false');
    clone.querySelector('#edit-toggle').textContent = '문구 편집';
    clone.querySelector('#editor-status').textContent = 'A1 세로형 · 594 × 841 mm · A2Z';
    const url = URL.createObjectURL(new Blob(['<!doctype html>\n' + clone.outerHTML], { type: 'text/html;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'panel-edited.html'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = '수정본을 저장했습니다. assets 폴더가 있는 panel.html과 같은 폴더에 보관하세요.';
  });
})();
