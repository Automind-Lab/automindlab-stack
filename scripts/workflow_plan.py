#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORKFLOWS = ROOT / 'config' / 'workflows'


def main() -> None:
    parser = argparse.ArgumentParser(description='Print a compact plan for a workflow config.')
    parser.add_argument('--workflow', required=True, help='Workflow file name, e.g. diagnostic_review.workflow.json')
    args = parser.parse_args()

    workflow_path = WORKFLOWS / args.workflow
    payload = json.loads(workflow_path.read_text(encoding='utf-8'))

    plan = {
        'name': payload.get('name'),
        'entry_skill': payload.get('entry_skill'),
        'steps': [
            {
                'id': step.get('id'),
                'type': step.get('type'),
                'skill': step.get('skill'),
                'timeoutMs': step.get('timeoutMs'),
            }
            for step in payload.get('steps', [])
        ],
        'outputs': payload.get('outputs', []),
    }

    print(json.dumps(plan, indent=2))


if __name__ == '__main__':
    main()
