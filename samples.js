// 처음 온 사용자가 바로 결과를 볼 수 있는 예시 문서
export const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="ko"><head><meta charset="utf-8"><title>예시_성적통지표</title>
<style>body{font-family:sans-serif;padding:24px;color:#222}h1{font-size:20px}
table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px 8px;text-align:center}th{background:#eee}</style>
<script>alert('이 스크립트는 변환 시 제거됩니다')<\/script></head>
<body><h1>2026학년도 1학기 성적통지표 (예시)</h1>
<p>학년/반/번호: 3학년 2반 15번 · 성명: 홍길동</p>
<table><tr><th>과목</th><th>단위수</th><th>원점수</th><th>석차등급</th></tr>
<tr><td>국어</td><td>4</td><td>92</td><td>2</td></tr>
<tr><td>수학</td><td>4</td><td>88</td><td>2</td></tr>
<tr><td>영어</td><td>4</td><td>95</td><td>1</td></tr></table>
<p onclick="alert(1)">※ 이 문서는 담다 사용법을 보여주기 위한 가상 예시입니다.</p></body></html>`;
