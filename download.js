export function safeFilename(name) {
  const base = String(name).replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 80) || 'page';
  return /\.html?$/i.test(base) ? base : base + '.html';
}
export const toBlobUrl = html => URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));

export function downloadHtml(html, name) {
  const url = toBlobUrl(html);
  const a = Object.assign(document.createElement('a'), { href: url, download: safeFilename(name) });
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 5000);
}
