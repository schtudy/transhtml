// HTML 정리·변환 — 새 옵션은 단계만 추가하면 됩니다.
const URL_ATTRS = ['src', 'href', 'poster', 'action', 'background'];

export function convertHtml(raw, { baseUrl = '', stripScripts = true, absolutize = true, printStyle = false } = {}) {
  const doc = new DOMParser().parseFromString(raw, 'text/html');

  if (stripScripts) {
    doc.querySelectorAll('script, meta[http-equiv="refresh" i]').forEach(n => n.remove());
    doc.querySelectorAll('*').forEach(el => {
      for (const a of [...el.attributes])
        if (/^on/i.test(a.name) || /^\s*javascript:/i.test(a.value)) el.removeAttribute(a.name);
    });
  }

  if (absolutize && baseUrl) {
    const abs = u => { try { return new URL(u, baseUrl).href; } catch { return u; } };
    doc.querySelectorAll(URL_ATTRS.map(a => `[${a}]`).join(',')).forEach(el => URL_ATTRS.forEach(a => {
      const v = el.getAttribute(a);
      if (v && !/^(data:|blob:|#|mailto:|tel:)/i.test(v)) el.setAttribute(a, abs(v));
    }));
    doc.querySelectorAll('[srcset]').forEach(el => el.setAttribute('srcset',
      el.getAttribute('srcset').split(',').map(p => { const [u, d] = p.trim().split(/\s+/); return abs(u) + (d ? ' ' + d : ''); }).join(', ')));
    doc.querySelectorAll('base').forEach(b => b.remove());
  }

  // 결과는 항상 UTF-8
  doc.querySelectorAll('meta[charset], meta[http-equiv="content-type" i]').forEach(m => m.remove());
  const meta = doc.createElement('meta'); meta.setAttribute('charset', 'utf-8'); doc.head.prepend(meta);

  if (printStyle) {
    const st = doc.createElement('style');
    st.textContent = '@page{size:A4;margin:12mm}@media print{*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}';
    doc.head.appendChild(st);
  }
  return '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
}

export function guessTitle(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return (m && m[1].trim()) || 'page';
}
