// 스크립트가 실행되지 않는 샌드박스 iframe
export function renderPreview(iframe, html) { iframe.srcdoc = html; }

export function printPreview(iframe) {
  try { iframe.contentWindow.focus(); iframe.contentWindow.print(); return true; } catch { return false; }
}

// 미리보기 전체 화면 전환 (모바일에서 새 탭 대신)
export function setExpanded(box, on) {
  box.classList.toggle('is-full', on);
  document.body.style.overflow = on ? 'hidden' : '';
}
