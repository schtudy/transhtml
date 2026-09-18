export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function setStatus(el, msg, type = '') { el.textContent = msg; el.dataset.type = type; }

let timer;
export function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(timer); timer = setTimeout(() => t.classList.remove('show'), 2200);
}

export function initTabs(root) {
  const tabs = $$('[role=tab]', root);
  tabs.forEach(tab => tab.addEventListener('click', () => tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    $('#' + t.getAttribute('aria-controls')).hidden = !on;
  })));
}

export const formatBytes = n =>
  n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : (n / 1048576).toFixed(2) + ' MB';
