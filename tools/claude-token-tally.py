#!/usr/bin/env python3
"""Claude Code transcript 토큰 합산.

사용법:
  python3 claude-token-tally.py <~/.claude/projects/ 하위 디렉터리 이름 또는 경로> [...]

각 프로젝트 디렉터리의 모든 세션 JSONL에서 assistant 메시지 usage를
message id로 dedup하여 합산한다. (같은 메시지가 스트리밍으로 여러 줄 기록될 수 있음)
"""
import json, sys, glob, os
from collections import defaultdict

def tally(proj):
    if not os.path.isdir(proj):
        proj = os.path.expanduser(f"~/.claude/projects/{proj}")
    seen = {}  # msg id -> (model, usage)
    for f in glob.glob(os.path.join(proj, "*.jsonl")):
        for line in open(f, encoding="utf-8", errors="ignore"):
            try:
                d = json.loads(line)
            except json.JSONDecodeError:
                continue
            m = d.get("message") or {}
            u = m.get("usage")
            if not u:
                continue
            mid = m.get("id") or d.get("uuid")
            seen[mid] = (m.get("model", "?"), u)
    per_model = defaultdict(lambda: defaultdict(int))
    for model, u in seen.values():
        for k in ("input_tokens", "output_tokens",
                  "cache_creation_input_tokens", "cache_read_input_tokens"):
            per_model[model][k] += u.get(k) or 0
    return per_model, len(seen)

for proj in sys.argv[1:]:
    per_model, n = tally(proj)
    print(f"\n== {proj}  (assistant messages: {n})")
    for model, t in sorted(per_model.items()):
        total_in = t['input_tokens'] + t['cache_creation_input_tokens'] + t['cache_read_input_tokens']
        print(f"  {model}")
        print(f"    output          : {t['output_tokens']:>12,}")
        print(f"    input (fresh)   : {t['input_tokens']:>12,}")
        print(f"    cache write     : {t['cache_creation_input_tokens']:>12,}")
        print(f"    cache read      : {t['cache_read_input_tokens']:>12,}")
        print(f"    input total     : {total_in:>12,}")
