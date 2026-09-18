# 담다 – 배포/유지보수 메모

## 배포 (CLI 없이)
1. GitHub에서 새 저장소 → "Add file > Upload files"로 이 폴더 전체 업로드
2. Cloudflare 대시보드 > Workers & Pages > Create > Pages > Connect to Git → 저장소 선택
3. 빌드 명령 비움, 출력 디렉터리 `/` → Deploy
※ 대시보드 드래그앤드롭 업로드는 `functions/`(주소 가져오기)가 동작하지 않으므로 Git 연결 방식 사용

## 배포 후 치환
- `YOUR-DOMAIN.pages.dev` → 실제 도메인 (전체 파일 찾아 바꾸기)
- `contact@YOUR-DOMAIN.com` → 실제 이메일
- 애드센스 승인 후: 각 HTML `<head>` 주석 해제, `ads.txt` pub-ID 입력

## 구조
assets/js/config.js          전역 설정
assets/js/main.js            index 화면 연결부
assets/js/modules/*.js       기능 단위 (fetcher/converter/preview/download/bookmarklet/ui)
functions/api/fetch.js       공개 페이지 가져오기 서버 함수
새 기능: modules/에 파일 추가 → main.js에서 import
새 페이지: guide.html 복사 → 헤더 nav·sitemap.xml에 추가
