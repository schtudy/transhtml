import { CONFIG } from '../config.js';

export function normalizeUrl(input) {
  let v = input.trim();
  if (!v) throw new Error('주소를 입력하세요.');
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v;
  try { return new URL(v).href; } catch { throw new Error('주소 형식이 올바르지 않습니다.'); }
}

// 서버 함수로 원본을 받고, 브라우저에서 문자셋(EUC-KR 등)에 맞게 디코딩
export async function fetchPage(url) {
  const res = await fetch(`${CONFIG.proxyEndpoint}?url=${encodeURIComponent(url)}`);
  if (!res.ok) {
    let msg = `불러오지 못했습니다 (${res.status}).`;
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  const buf = await res.arrayBuffer();
  let cs = res.headers.get('x-charset');
  if (!cs) {
    const head = new TextDecoder('ascii').decode(buf.slice(0, 4096));
    cs = (head.match(/<meta[^>]+charset=["']?([\w-]+)/i) || [])[1] || 'utf-8';
  }
  let html;
  try { html = new TextDecoder(cs).decode(buf); } catch { html = new TextDecoder().decode(buf); }
  return { html, finalUrl: res.headers.get('x-final-url') || url };
}
