# Qwen3.8 기술 세미나 — 정적 HTML 프레젠테이션

삼성전자 내부 AI 전문가 대상 30분(25분 발표 + 5분 Q&A) 기술 세미나.
Qwen3.8 발표를 model / harness / RL environment 관점에서 해석한다.

## 실행

빌드 도구 없음. 로컬에서:

```
open docs/index.html        # macOS
```

또는 아무 정적 서버:

```
cd docs && python3 -m http.server 8000
```

## GitHub Pages 배포

1. private 저장소에 push
2. Settings → Pages → Source: `Deploy from a branch`, Branch: `main`, Folder: `/docs`
3. `https://<org>.github.io/<repo>/` 접속

모든 자산(이미지·영상·CSS·JS)은 상대 경로·저장소 내 파일이며 외부 CDN 의존이 없다.
인터넷이 차단돼도 `docs/index.html`을 브라우저로 열면 전체 발표가 동작한다.

## 조작

| 키 | 동작 |
|---|---|
| ←/→, Space, PgUp/PgDn | 슬라이드 이동 |
| Home / End | 처음 / 끝 |
| `t` 또는 `o` | 목차 오버레이 |
| `f` | 전체 화면 |
| `n` | 발표자 노트 패널 |
| Esc | 오버레이 닫기 |

## PDF 출력

브라우저 인쇄(⌘P) → 배경 그래픽 포함, 여백 없음 → PDF 저장.
`styles/print.css`가 슬라이드당 1페이지 landscape로 출력한다.

## 구조

```
docs/
  index.html      메인 덱 (발표자 노트 포함)
  appendix.html   benchmark 설정 표, EDA glossary, open questions, 예상 Q&A
  sources.html    전체 출처 및 evidence level
  styles/         deck.css, print.css
  scripts/deck.js
  assets/         qwen / oh-my-cli / paper / chip / qwen-mm / openai / anthropic
speaker-notes.md  슬라이드별 노트·시간 배분 (index.html 노트와 동일 내용)
sources.md        출처 원문 URL 목록
asset-manifest.csv  자산별 출처·라이선스·수집일
```

## 발표 당일 체크리스트

- [ ] `docs/index.html` 로컬 사본으로 리허설 (네트워크 무관)
- [ ] 영상 재생 확인 — 실패 시 각 슬라이드의 key-frame fallback 자동 표시
- [ ] `n`으로 발표자 노트, `t`로 목차 확인
- [ ] 프로젝터 16:9 해상도에서 하단 출처 텍스트 가독성 확인
