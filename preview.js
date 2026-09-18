import { toBlobUrl } from './download.js';

// 스크립트가 실행되지 않는 샌드박스 iframe
export function renderPreview(iframe, html) { iframe.srcdoc = html; }

export function printPreview(iframe) {
  try { iframe.contentWindow.focus(); iframe.contentWindow.print(); return true; } catch { return false; }
}
export const openInNewTab = html => !!window.open(toBlobUrl(html), '_blank');
