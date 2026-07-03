# 도서출판 시프트 웹사이트

독자의 일상과 실무 스킬을 Shift(업그레이드)하는 책을 만드는 **도서출판 시프트**의 공식 사이트입니다.

- 출간 도서 카탈로그 (`/books`, `/books/[id]`)
- 출판사 소개 (`/about`)

## 기술 스택

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS v4** — [DESIGN.md](DESIGN.md)의 블루프린트 디자인 토큰 적용
- **Google Sheets + Google Docs** — 도서 목록·상세 본문 CMS
- 폰트: Pretendard Variable(본문/디스플레이), Geist Mono(마이크로 라벨)

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 도서 데이터

도서는 Google Sheets와 각 도서의 Google Docs에서 불러옵니다.

1. **시트** — `TITLE`, `URL` 열에 제목과 Google Docs 링크를 입력합니다. 랜딩 베스트셀러는 `BEST` 열(`true`/`false`)로 지정합니다.
2. **Google Docs** — 도서 소개·저자·구매 링크 등 상세 정보를 작성합니다.
3. **표지** — `public/covers/{slug}.jpg`에 로컬 이미지를 둡니다.

환경변수 (선택):

```bash
cp .env.local.example .env.local
```

| 변수 | 설명 |
|------|------|
| `GOOGLE_SHEET_ID` | Google Sheets ID |
| `GOOGLE_SHEET_GID` | 시트 탭 GID (기본 `0`) |

## 디자인

[DESIGN.md](DESIGN.md)의 "블루프린트" 시스템을 따릅니다.

- 배경 `#000000`(Void) / 표면 `#1c1c1c`(Carbon), 그림자 없음
- 모든 섹션은 1px 점선 컨테이너로 감쌈
- 액션은 아웃라인 필 버튼(1px 흰 테두리, radius 100px)만 사용
- 포인트 컬러 `#7089ba`(Periwinkle)는 아이콘·배지·일러스트 스트로크 등 주석 역할로만 제한
