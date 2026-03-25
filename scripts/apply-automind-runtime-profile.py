#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

PROFILES = {
    "dev": {
        "AUTOMIND_TEXT_MODEL": "gpt-5.4-thinking",
        "AUTOMIND_LOCAL_TEXT_MODEL": "nemotron-mini:4b-instruct-q2_K",
        "AUTOMIND_CLOUD_TEXT_MODEL": "gpt-5.4-thinking",
        "AUTOMIND_CLOUD_TEXT_ENDPOINT": "",
        "AUTOMIND_STT_BACKEND": "typed",
        "AUTOMIND_STT_COMMAND": "",
        "AUTOMIND_FACE_RENDERER": "basic",
        "AUTOMIND_FACE_SCRIPT": "",
        "AUTOMIND_MODEL_ROUTE_DEFAULT": "local",
        "AUTOMIND_RUNTIME_ENV_FILE": "~/.config/automind-runtime.env",
        "AUTOMIND_SYSTEM_PROMPT_EXTRAS": "Keep responses concise, executive, safe, and operator-trustworthy.",
    },
    "snappy": {
        "AUTOMIND_TEXT_MODEL": "gpt-5.4-thinking",
        "AUTOMIND_LOCAL_TEXT_MODEL": "nemotron-mini:4b-instruct-q2_K",
        "AUTOMIND_CLOUD_TEXT_MODEL": "gpt-5.4-thinking",
        "AUTOMIND_CLOUD_TEXT_ENDPOINT": "",
        "AUTOMIND_STT_BACKEND": "typed",
        "AUTOMIND_STT_COMMAND": "",
        "AUTOMIND_FACE_RENDERER": "basic",
        "AUTOMIND_FACE_SCRIPT": "",
        "AUTOMIND_MODEL_ROUTE_DEFAULT": "local",
        "AUTOMIND_RUNTIME_ENV_FILE": "~/.config/automind-runtime.env",
        "AUTOMIND_SYSTEM_PROMPT_EXTRAS": "Prioritize fast execution plans and clear next actions.",
    },
    "robust": {
        "AUTOMIND_TEXT_MODEL": "gpt-5.4-thinking",
        "AUTOMIND_LOCAL_TEXT_MODEL": "nemotron-mini:4b-instruct-q2_K",
        "AUTOMIND_CLOUD_TEXT_MODEL": "gpt-5.4-thinking",
        "AUTOMIND_CLOUD_TEXT_ENDPOINT": "",
        "AUTOMIND_STT_BACKEND": "typed",
        "AUTOMIND_STT_COMMAND": "",
        "AUTOMIND_FACE_RENDERER": "basic",
        "AUTOMIND_FACE_SCRIPT": "",
        "AUTOMIND_MODEL_ROUTE_DEFAULT": "cloud",
        "AUTOMIND_RUNTIME_ENV_FILE": "~/.config/automind-runtime.env",
        "AUTOMIND_SYSTEM_PROMPT_EXTRAS": "Prioritize verification, rollback safety, approvals, and auditability.",
    },
}


def write_env(path: Path, values: dict[str, str]) -> None:
    lines = [f"{key}={value}" for key, value in values.items()]
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Write an AutoMindLab executive runtime profile.")
    parser.add_argument("profile", choices=sorted(PROFILES))
    parser.add_argument("--env-file", default="workflows/test-automind-runtime.env")
    parser.add_argument("--output", default="workflows/automind-runtime-profile.json")
    args = parser.parse_args()

    values = PROFILES[args.profile]
    env_file = Path(args.env_file)
    env_file.parent.mkdir(parents=True, exist_ok=True)
    write_env(env_file, values)

    payload = {
        "profile": args.profile,
        "values": values,
        "env_file": str(env_file),
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
