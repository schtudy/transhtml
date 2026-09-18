export function safeFilename(name) {
  const base = String(name).replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, ' ').trim().slice(0, 80) || 'page';
  return /\.html?$/i.test(base) ? base : base + '.html';
}
export const toBlobUrl = html => URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));

// Claude 미리보기 안에서는 플랫폼 저장 기능 사용, 일반 사이트에서는 <a download>
async function hostDownloads() {
  if (!window.claude?.use) return null;
  try { return await window.claude.use('downloads'); } catch { return null; }
}

// 반환: 'saved' | 'declined'
export async function downloadHtml(html, name) {
  const filename = safeFilename(name);
  const dl = await hostDownloads();
  if (dl) {
    try { await dl.save({ filename, data: new Blob([html]) }); return 'saved'; }
    catch (e) { if (e?.code === 'declined') return 'declined'; throw new Error('저장하지 못했습니다: ' + (e?.message || e)); }
  }
  const url = toBlobUrl(html);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 5000);
  return 'saved';
}
