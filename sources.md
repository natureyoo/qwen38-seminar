# Sources (원문 URL 보존)

모든 조회일: 2026-08-07. 상세 claim–evidence matrix와 원문 인용: `docs/sources.html`

## 1차 출처

| 자료 | URL | 비고 |
|---|---|---|
| Qwen3.8 공식 발표 | https://qwen.ai/blog?id=qwen3.8 | "Qwen3.8-Max: A New Bar for Coding and Cowork", 2026-08-03. JS SPA — 본문 사본을 저장소에 보존 |
| Qwen3.8 중국어 미러 | https://qwenlm.github.io/zh/blog/qwen3.8/ | |
| oh-my-cli | https://github.com/qwen-code-dev-bot/oh-my-cli | Apache-2.0. 2026-07-30 기준 265 commits/127 PRs/151 issues — API로 정확히 재확인 |
| Qwen-MM-Plugins | https://github.com/QwenLM/Qwen-MM-Plugins | Apache-2.0. skill+MCP 구조·tool 수 소스 트리로 확인 |
| 재현 대상 논문 | https://arxiv.org/abs/2605.22389 | "Unified Data Selection for LLM Reasoning" (Li et al., 2026-05-21). **사전 후보였던 2608.01964는 다른 논문**(LongHorizon-Harness) |
| 논문 OpenReview | https://openreview.net/forum?id=heVn5cNfje | 공식 코드 저장소는 확인되지 않음 |
| OpenAI Jalapeño | https://openai.com/index/openai-broadcom-jalapeno-inference-chip/ | 2026-06-24. wafer 사진 원본: images.ctfassets.net (asset-manifest 참조) |
| LongHorizon-Harness | https://github.com/AMAP-ML/LongHorizon-Harness · https://arxiv.org/abs/2608.01964 | "LongHorizon-Harness: Advancing Long-Horizon Agents" (Ma et al., 2026-08-03). MIT, 330 stars (2026-08-07). MEA loop 수치는 논문 자체 평가 |
| Anthropic 채용공고 | https://job-boards.greenhouse.io/anthropic/jobs/5231612008 | "Research Engineer, Chip Design RL (Reinforcement Learning)", 2026-08-07 LIVE |

## Qwen 발표가 직접 링크한 자료

- https://tianchi.aliyun.com/competition/entrance/532277 (WWW2025 challenge 사례)
- https://www.frontierswe.com (FrontierSWE leaderboard)
- https://artificialanalysis.ai/evaluations/terminalbench-v2-1
- https://www.qwencloud.com/ · https://docs.qwencloud.com/
- Qwen 공식 그림: Fig 1 `…/Qwen3.8/work_showcases/training-score-vs-envs-scale.png`, Fig 2 `…/harness-generalization-3.8.png` (qianwen-res.oss-cn-beijing.aliyuncs.com)
- oh-my-cli 공식 영상: cloud.video.taobao.com/vod/1h6qXKSnAjXp6lHfSDX1xfKukA0Y5hUUQ73qqUtY4aQ.mp4 (72MB, 저장소에 보존)

## 확인 사항

- 칩 섹션 미디어는 `<video>`가 아니라 **iframe embed** — https://docs.qwenlm.ai/resources/CCoLV_eda_agent_square.html (자기완결형 인터랙티브 3D 시각화, 로컬 사본: `docs/assets/chip/eda_agent.html`)
- model card / tech report / HF 링크 없음 (open weights "next week" 예고만)
- RecreationBench는 in-house 벤치마크 — 공개 저장소 없음
