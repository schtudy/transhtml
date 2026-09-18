// 로그인된 페이지(예: 학생부 조회 화면)에서 직접 실행되는 저장 스크립트.
// toString()으로 북마클릿이 되므로 외부 변수 참조·한 줄 주석 금지.
function saveThisPage() {
  try {
    const d = document;
    d.querySelectorAll('input,textarea,select').forEach(e => {
      if (e.tagName === 'TEXTAREA') e.textContent = e.value;
      else if (e.tagName === 'SELECT') [...e.options].forEach(o => o.selected ? o.setAttribute('selected', '') : o.removeAttribute('selected'));
      else if (e.type === 'checkbox' || e.type === 'radio') e.checked ? e.setAttribute('checked', '') : e.removeAttribute('checked');
      else if (e.type !== 'password') e.setAttribute('value', e.value);
    });
    const frames = [...d.querySelectorAll('iframe')].map(f => {
      try { const x = f.contentDocument; return x ? '<!DOCTYPE html>' + x.documentElement.outerHTML : null; } catch (e) { return null; }
    });
    let css = ''; const used = new Set();
    [...d.styleSheets].forEach(s => {
      try {
        if (!s.ownerNode || s.ownerNode.tagName !== 'LINK') return;
        css += [...s.cssRules].map(r => r.cssText.replace(/url\((['"]?)(?!data:|https?:|\/\/)([^'")]+)\1\)/g, (m, q, u) => 'url("' + new URL(u, s.href).href + '")')).join('\n') + '\n';
        used.add(s.ownerNode.href);
      } catch (e) {}
    });
    const c = d.documentElement.cloneNode(true);
    c.querySelectorAll('script').forEach(e => e.remove());
    c.querySelectorAll('link[rel~="stylesheet"]').forEach(l => { if (used.has(l.href)) l.remove(); });
    c.querySelectorAll('iframe').forEach((f, i) => { if (frames[i]) { f.removeAttribute('src'); f.setAttribute('srcdoc', frames[i]); } });
    const h = c.querySelector('head');
    if (!h.querySelector('base')) { const b = d.createElement('base'); b.href = location.href; h.prepend(b); }
    if (css) { const st = d.createElement('style'); st.textContent = css; h.appendChild(st); }
    const m = d.createElement('meta'); m.setAttribute('charset', 'utf-8'); h.prepend(m);
    const html = '<!DOCTYPE html>\n' + c.outerHTML;
    const name = (d.title || 'page').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 80) + '.html';
    const u = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }));
    const a = d.createElement('a'); a.href = u; a.download = name; d.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(u); a.remove(); }, 5000);
  } catch (e) { alert('저장하지 못했습니다: ' + e.message); }
}

export const BOOKMARKLET = 'javascript:' + encodeURIComponent('(' + saveThisPage.toString() + ')()');
