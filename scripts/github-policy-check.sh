#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <plan_json_path>" >&2
  exit 1
fi

PLAN_PATH="$1"
if [ ! -f "$PLAN_PATH" ]; then
  echo "Plan file not found: $PLAN_PATH" >&2
  exit 1
fi

python3 - "$PLAN_PATH" <<'PY'
import json
import sys
from pathlib import Path

plan = json.loads(Path(sys.argv[1]).read_text(encoding='utf-8'))
notes = []
decision = 'allow'

if plan['risk'] == 'high':
    decision = 'deny'
    notes.append('High-risk changes require human review.')

if plan['scope'] == 'runtime':
    notes.append('Runtime changes require verifier output before PR open.')

labels = set(plan.get('labels', []))
if 'autonomy:needs-human' in labels:
    decision = 'deny'
    notes.append('Issue is explicitly marked as needing human intervention.')

if not notes:
    notes.append('Change is within the current autonomy scaffold boundary.')

print(json.dumps({
    'issue_number': plan['issue_number'],
    'decision': decision,
    'notes': notes,
}, indent=2))
PY
