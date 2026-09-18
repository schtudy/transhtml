import { CONFIG } from './config.js';
import { $, setStatus, toast, initTabs, formatBytes } from './modules/ui.js';
import { normalizeUrl, fetchPage } from './modules/fetcher.js';
import { convertHtml, guessTitle } from './modules/converter.js';
import { renderPreview, printPreview, openInNewTab } from './modules/preview.js';
import { downloadHtml } from './modules/download.js';
import { BOOKMARKLET } from './modules/bookmarklet.js';

const state = { raw: '', baseUrl: '', html: '' };
const el = {
  tool: $('#tool'), urlForm: $('#url-form'), url: $('#url-input'), urlBtn: $('#url-btn'),
  pasteForm: $('#paste-form'), paste: $('#paste-input'), file: $('#file-input'), pasteBase: $('#paste-base'),
  status: $('#status'), result: $('#result'), frame: $('#preview'), name: $('#filename'), meta: $('#result-meta'),
  opts: ['#opt-scripts', '#opt-abs', '#opt-print'].map(s => $(s)),
};

const options = () => ({
  baseUrl: state.baseUrl, stripScripts: el.opts[0].checked, absolutize: el.opts[1].checked, printStyle: el.opts[2].checked,
});

function build() {
  if (!state.raw) return;
  state.html = convertHtml(state.raw, options());
  renderPreview(el.frame, state.html);
  el.meta.textContent = `결과 ${formatBytes(new Blob([state.html]).size)}${state.baseUrl ? ' · 원본 ' + state.baseUrl : ''}`;
  el.result.hidden = false;
}

function load(raw, baseUrl) {
  if (new Blob([raw]).size > CONFIG.maxBytes) throw new Error('5MB 이하의 HTML만 변환할 수 있습니다.');
  Object.assign(state, { raw, baseUrl });
  el.name.value = guessTitle(raw);
  build();
  setStatus(el.status, '변환했습니다. 아래 미리보기를 확인하고 저장하세요.', 'ok');
  el.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

initTabs(el.tool);

el.urlForm.addEventListener('submit', async e => {
  e.preventDefault();
  el.urlBtn.disabled = true;
  try {
    const url = normalizeUrl(el.url.value);
    setStatus(el.status, '페이지를 가져오는 중…');
    const { html, finalUrl } = await fetchPage(url);
    load(html, finalUrl);
  } catch (err) {
    setStatus(el.status, err.message + ' 로그인이 필요한 페이지는 아래 "저장 버튼"을 사용하세요.', 'error');
  } finally { el.urlBtn.disabled = false; }
});

el.pasteForm.addEventListener('submit', e => {
  e.preventDefault();
  try {
    if (!el.paste.value.trim()) throw new Error('HTML을 붙여넣거나 파일을 선택하세요.');
    const base = el.pasteBase.value.trim();
    load(el.paste.value, base ? normalizeUrl(base) : '');
  } catch (err) { setStatus(el.status, err.message, 'error'); }
});

el.file.addEventListener('change', async () => {
  const f = el.file.files[0]; if (!f) return;
  el.paste.value = await f.text();
  toast(`${f.name} 불러옴`);
});

el.opts.forEach(o => o.addEventListener('change', build));

$('#btn-download').addEventListener('click', () => { downloadHtml(state.html, el.name.value); toast('다운로드를 시작했습니다'); });
$('#btn-open').addEventListener('click', () => { if (!openInNewTab(state.html)) toast('팝업이 차단되었습니다'); });
$('#btn-print').addEventListener('click', () => { if (!printPreview(el.frame)) openInNewTab(state.html); });

// 저장 버튼(북마클릿)
const bm = $('#bm-link');
bm.href = BOOKMARKLET;
bm.addEventListener('click', e => { e.preventDefault(); toast('즐겨찾기에 추가한 뒤, 저장할 페이지에서 누르세요'); });
$('#bm-copy').addEventListener('click', async () => {
  const box = $('#bm-code');
  try { await navigator.clipboard.writeText(BOOKMARKLET); toast('코드를 복사했습니다'); }
  catch { box.hidden = false; box.value = BOOKMARKLET; box.select(); }
});
