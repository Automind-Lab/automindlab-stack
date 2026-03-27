#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const storePath = path.join(root, "data", "adaptive-skills-store.json");
const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
const grouped = new Map();

for (const record of store.records || []) {
  const skill = String(record.skill || "unknown");
  if (!grouped.has(skill)) {
    grouped.set(skill, { success: 0, failure: 0 });
  }
  const stats = grouped.get(skill);
  if (record.success === true) {
    stats.success += 1;
  } else {
    stats.failure += 1;
  }
}

const rows = [...grouped.entries()].map(([skill, stats]) => {
  const attempts = stats.success + stats.failure;
  return {
    skill,
    attempts,
    success: stats.success,
    failure: stats.failure,
    success_rate: attempts === 0 ? 0 : Number((stats.success / attempts).toFixed(3)),
  };
});

rows.sort((a, b) => b.attempts - a.attempts || a.skill.localeCompare(b.skill));
console.log(JSON.stringify(rows, null, 2));
