#!/usr/bin/env python3
from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STORE = ROOT / 'data' / 'adaptive-skills-store.json'


def main() -> None:
    data = json.loads(STORE.read_text(encoding='utf-8'))
    grouped: dict[str, dict[str, int]] = defaultdict(lambda: {'success': 0, 'failure': 0})

    for record in data.get('records', []):
        skill = str(record.get('skill', 'unknown'))
        if record.get('success') is True:
            grouped[skill]['success'] += 1
        else:
            grouped[skill]['failure'] += 1

    rows = []
    for skill, stats in grouped.items():
        attempts = stats['success'] + stats['failure']
        success_rate = 0.0 if attempts == 0 else stats['success'] / attempts
        rows.append({
            'skill': skill,
            'attempts': attempts,
            'success': stats['success'],
            'failure': stats['failure'],
            'success_rate': round(success_rate, 3),
        })

    rows.sort(key=lambda row: (-row['attempts'], row['skill']))
    print(json.dumps(rows, indent=2))


if __name__ == '__main__':
    main()
