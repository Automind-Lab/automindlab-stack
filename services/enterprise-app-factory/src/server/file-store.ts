import fs from "node:fs/promises";
import path from "node:path";
import type { AgentRun, GenerationJob } from "../shared/contracts.js";

function repoRoot(): string {
  return path.resolve(import.meta.dirname, "../../../../");
}

function dataRoot(): string {
  const configured = process.env.AUTOMIND_APP_FACTORY_DATA_ROOT;
  return configured
    ? path.resolve(import.meta.dirname, configured)
    : path.join(repoRoot(), "data", "app-factory");
}

function generatedRoot(): string {
  const configured = process.env.AUTOMIND_APP_FACTORY_GENERATED_ROOT;
  return configured
    ? path.resolve(import.meta.dirname, configured)
    : path.join(repoRoot(), "generated-apps");
}

function downloadRoot(): string {
  const configured = process.env.AUTOMIND_APP_FACTORY_DOWNLOAD_ROOT;
  return configured
    ? path.resolve(import.meta.dirname, configured)
    : path.join(dataRoot(), "downloads");
}

export interface AuditEvent {
  at: string;
  type: string;
  actor: string;
  subject: string;
  details: Record<string, unknown>;
}

function isSafeRecordId(value: string): boolean {
  return /^[A-Za-z0-9_-]+$/.test(value);
}

function resolveRecordPath(directory: string, recordId: string): string {
  if (!isSafeRecordId(recordId)) {
    throw new Error(`Unsafe record id: ${recordId}`);
  }
  return path.join(directory, `${recordId}.json`);
}

function isJsonRecordFile(fileName: string): boolean {
  return fileName.endsWith(".json");
}

export class AppFactoryFileStore {
  readonly baseDir = dataRoot();
  readonly jobDir = path.join(this.baseDir, "jobs");
  readonly agentRunDir = path.join(this.baseDir, "agent-runs");
  readonly downloadDir = downloadRoot();
  readonly auditLogPath = path.join(this.baseDir, "audit-log.ndjson");
  readonly generatedAppRoot = generatedRoot();

  async init(): Promise<void> {
    await fs.mkdir(this.jobDir, { recursive: true });
    await fs.mkdir(this.agentRunDir, { recursive: true });
    await fs.mkdir(this.downloadDir, { recursive: true });
    await fs.mkdir(this.generatedAppRoot, { recursive: true });
  }

  async recoverInterruptedJobs(): Promise<void> {
    await this.init();
    const files = await fs.readdir(this.jobDir);
    await Promise.all(
      files
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          const job = await this.readJob(path.basename(file, ".json"));
          if (!job) {
            return;
          }
          if (job.status === "queued" || job.status === "running") {
            job.status = "interrupted";
            job.updatedAt = new Date().toISOString();
            job.logs.push({
              at: job.updatedAt,
              stage: "recovery",
              level: "warning",
              message: "Job was marked interrupted during service startup recovery.",
            });
            await this.writeJob(job);
          }
        }),
    );

    const agentRunFiles = await fs.readdir(this.agentRunDir);
    await Promise.all(
      agentRunFiles
        .filter((file) => file.endsWith(".json"))
        .map(async (file) => {
          const run = await this.readAgentRun(path.basename(file, ".json"));
          if (!run) {
            return;
          }
          if (run.status === "queued" || run.status === "running") {
            run.status = "interrupted";
            run.updatedAt = new Date().toISOString();
            run.logs.push({
              at: run.updatedAt,
              agentKey: "automind-host",
              depth: 0,
              level: "warning",
              message: "Agent run was marked interrupted during service startup recovery.",
            });
            await this.writeAgentRun(run);
          }
        }),
    );
  }

  async writeJob(job: GenerationJob): Promise<void> {
    await this.init();
    const location = resolveRecordPath(this.jobDir, job.id);
    await fs.writeFile(location, `${JSON.stringify(job, null, 2)}\n`, "utf8");
  }

  private async readJobFile(location: string): Promise<GenerationJob | undefined> {
    try {
      const raw = await fs.readFile(location, "utf8");
      return JSON.parse(raw) as GenerationJob;
    } catch {
      return undefined;
    }
  }

  async readJob(jobId: string): Promise<GenerationJob | undefined> {
    if (!isSafeRecordId(jobId)) {
      return undefined;
    }
    await this.init();
    const fileName = `${jobId}.json`;
    const files = await fs.readdir(this.jobDir);
    const matchedFile = files.find((file) => file === fileName);
    if (!matchedFile) {
      return undefined;
    }
    return this.readJobFile(path.join(this.jobDir, matchedFile));
  }

  async listJobs(): Promise<GenerationJob[]> {
    await this.init();
    const files = await fs.readdir(this.jobDir);
    const jobs = await Promise.all(
      files
        .filter(isJsonRecordFile)
        .map(async (file) => this.readJobFile(path.join(this.jobDir, file))),
    );
    return jobs
      .filter((job): job is GenerationJob => Boolean(job))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  async writeAgentRun(run: AgentRun): Promise<void> {
    await this.init();
    const location = resolveRecordPath(this.agentRunDir, run.id);
    await fs.writeFile(location, `${JSON.stringify(run, null, 2)}\n`, "utf8");
  }

  private async readAgentRunFile(location: string): Promise<AgentRun | undefined> {
    try {
      const raw = await fs.readFile(location, "utf8");
      return JSON.parse(raw) as AgentRun;
    } catch {
      return undefined;
    }
  }

  async readAgentRun(runId: string): Promise<AgentRun | undefined> {
    if (!isSafeRecordId(runId)) {
      return undefined;
    }
    await this.init();
    const fileName = `${runId}.json`;
    const files = await fs.readdir(this.agentRunDir);
    const matchedFile = files.find((file) => file === fileName);
    if (!matchedFile) {
      return undefined;
    }
    return this.readAgentRunFile(path.join(this.agentRunDir, matchedFile));
  }

  async listAgentRuns(): Promise<AgentRun[]> {
    await this.init();
    const files = await fs.readdir(this.agentRunDir);
    const runs = await Promise.all(
      files
        .filter(isJsonRecordFile)
        .map(async (file) => this.readAgentRunFile(path.join(this.agentRunDir, file))),
    );
    return runs
      .filter((run): run is AgentRun => Boolean(run))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  async appendAuditEvent(event: AuditEvent): Promise<void> {
    await this.init();
    await fs.appendFile(this.auditLogPath, `${JSON.stringify(event)}\n`, "utf8");
  }
}
