#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const [configPath, hostWorkspace, workerWorkspace, hostAgentId, workerAgentId] = process.argv.slice(2);

if (!configPath || !hostWorkspace || !workerWorkspace || !hostAgentId || !workerAgentId) {
  console.error("usage: apply-openclaw-topology.mjs <config_path> <host_workspace> <worker_workspace> <host_agent_id> <worker_agent_id>");
  process.exit(1);
}

let config = {};
if (fs.existsSync(configPath)) {
  const raw = fs.readFileSync(configPath, "utf8").trim();
  config = raw ? JSON.parse(raw) : {};
}

config.agents ??= {};
config.agents.list = Array.isArray(config.agents.list) ? config.agents.list : [];
config.agents.defaults ??= {};
config.agents.defaults.workspace = hostWorkspace;
config.agents.defaults.sandbox = { mode: "off" };

function upsert(agent) {
  const index = config.agents.list.findIndex((item) => item.id === agent.id);
  if (index >= 0) {
    config.agents.list[index] = { ...config.agents.list[index], ...agent };
    return;
  }
  config.agents.list.push(agent);
}

upsert({
  id: hostAgentId,
  default: true,
  workspace: hostWorkspace,
  sandbox: { mode: "off" },
});

upsert({
  id: workerAgentId,
  default: false,
  workspace: workerWorkspace,
  sandbox: {
    mode: "all",
    scope: "agent",
    docker: { network: "bridge" },
  },
});

for (const agent of config.agents.list) {
  if (agent.id !== hostAgentId && agent.default === true) {
    agent.default = false;
  }
}

fs.mkdirSync(path.dirname(configPath), { recursive: true });
fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
