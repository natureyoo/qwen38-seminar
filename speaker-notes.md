# Speaker Notes — Qwen3.8 세미나 (25분 + Q&A 5분)

같은 노트가 `docs/index.html`에 내장돼 있다 (`n` 키로 발표 중 열람).

## 발표 전체 1페이지 요약

**제목:** 더 똑똑한 모델인가, 더 오래 일을 맡길 수 있는 시스템인가 — Qwen3.8과 Agentic RL 시스템의 확장

**핵심 질문:** Qwen3.8의 중요한 변화는 benchmark 상승인가, 아니면 model·harness·tools·workspace·verifier를 결합했을 때 AI가 맡을 수 있는 task 범위와 자율 실행 시간이 며칠 단위까지 확장됐다는 것인가?

**구조:** ① 좌표계 세우기 — Model / inference harness / RL environment 3층 분해, training loop와 inference loop의 구분, self-evolution 용어의 3가지 의미. ② Qwen의 방법론 주장 — Task×Workspace×Harness 조합적 환경 확장, universal reward system, 4축(tasks·difficulty·workspaces·harnesses) online balancer. 주장의 정확한 범위와 미공개 영역을 분리. ③ 세 사례를 같은 feedback-loop 구조로 재구성 — oh-my-cli(16일, 265 commits, GitHub에서 수치 재확인), 논문 재현·개선(125h, AIME24 +2.71), 칩 설계(500 turns, 8,298→678 gates, OpenROAD 500MHz closure — 단 silicon 아님). ④ 산업 신호 — OpenAI Jalapeño(tape-out 실물, AI 기여는 모호)와 Anthropic Chip Design RL 채용(환경 구축 신호)의 증거 수준 구분. ⑤ Qwen-MM-Plugins — multimodality를 model API가 아니라 harness layer로 옮기는 시도, 잠재력과 미검증 영역.

**결론:** Long-horizon capability는 model 단독 속성이 아니라 Model × Harness × Environment × Verifier × State × Budget의 시스템 속성이다. 가장 중요한 것은 "현실 업무를 rollout·reward 가능한 environment로 바꾸면 자율 수행 범위가 며칠 단위까지 확장된다"는 시스템적 가설이다.

## Slide별 제목 · 핵심 주장 · 근거 · 시간

| # | 제목 | 핵심 주장 | 근거 (evidence level) | 시간 |
|---|---|---|---|---|
| 1 | 오프닝 | 모델 경쟁 → 시스템 경쟁이라는 질문 제기 | — (발표자 해석 예고) | 1.0 |
| 2 | 무엇이 다른가 | 이 발표는 "맡길 수 있는 일"을 서술한다 | blog 구조 (L1) + repo (L2) | 1.5 |
| 3 | 3층 분해 | model/harness/environment를 뭉뚱그리지 말 것 | blog 서술 구조 (L1) | 2.0 |
| 4 | 두 loop | 두 loop는 앞이 동형, 꼬리(weight update)만 다름 | 표준 RL 구조 + blog (L1) | 2.0 |
| 5 | 환경 확장 축 | 환경이 축의 곱으로 확장 ("compounds combinatorially") | blog 원문, Fig 1: 0.474→0.725 @4,000 envs (L1) | 2.0 |
| 6 | Multi-harness 범위 | 주장(5개 harness 균일 향상)과 미공개(matrix·비율) 분리 | Fig 2 (L1), baseline은 단일 harness 주의 | 2.0 |
| 7 | Reward & balancing | 이종 verifier 통합 + 4축 balancer, formula 미공개 | blog 원문 인용 (L1), NL2Repo 각주 | 2.0 |
| 8 | Self-evolution 3의미 | in-context / artifact / weight-update를 구분 | 원문 용례 분류 (발표자 정리) | 1.0 |
| 9 | oh-my-cli | 장기 실행을 가능케 하는 기계장치가 함께 있는 사례 | GitHub API 수치 일치 (L2), 공식 영상 | 2.0 |
| 10 | 논문 재현 | 연구가 verifier loop로 환원된 사례 | blog 수치 (L1), 독립 재현 미확인 | 2.0 |
| 11 | EDA 매핑 | EDA 스택 = agent/RL 구성요소의 대응 | 매핑은 발표자 정리, flow는 blog (L1) | 2.5 |
| 12 | 500-turn trajectory | 최대 개선은 algorithm rewrite에서 (turn 22, 80%+) | blog 원문 (L1) | 2.0 |
| 13 | OpenROAD 증거 수준 | layout까지 도달, silicon은 아님 | blog 수치 (L1) + 단계 구분 (발표자) | 1.5 |
| 14 | Jalapeño & Anthropic | 같은 방향, 다른 증거 수준 | OpenAI 공식 (L4/tape-out), Anthropic 채용 (L1) | 1.5 |
| 15 | MM-Plugins 구조 | capability = skill + MCP server, harness 확장 레이어 | README·소스 확인 (L2) | 1.5 |
| 16 | MM-Plugins 평가 | 잠재력 크지만 채택·안정성 미검증 | repo stats (L2) + 발표자 평가 | 1.5 |
| 17 | 공통 loop | 세 사례 = 같은 구조의 다른 instantiation | 발표자 종합 | 1.0 |
| 18 | Open questions | 미공개 항목을 숨기지 않고 목록화 | — | 1.0 |
| 19 | 결론 | 시스템적 가설이 핵심 | 발표자 해석 | 1.0 |

**합계: 25.0분** (+ Q&A 5분). 상세 구술 노트는 `docs/index.html` 각 슬라이드의 `<aside class="notes">` 참조 — 발표 중 `n` 키.

## 시간 초과 시 단축 우선순위

1. Slide 8 (1분) — slide 4 말미에 한 문장으로 흡수 가능
2. Slide 17 (1분) — 결론에 흡수 가능
3. Slide 10 노트의 round별 상세 생략

## 발표 당일

- `docs/index.html` 로컬로 열기 (인터넷 불필요)
- slide 9 영상은 20–30초만 재생. 재생 실패 시 poster(저장소 화면)를 띄운 채 흐름도로 설명
- Q&A 준비: `docs/appendix.html` H절 (예상 질문 10 + 답변 초안)
