import path from "node:path";
import { buildDesignHandoff, importDesignHandoff } from "../shared/design-handoff.js";
import { APP_FACTORY_AGENT_REGISTRY } from "../shared/agent-registry.js";
import type {
  AgentRegistry,
  AgentRun,
  AgentRunRequest,
  DesignImportRequest,
  DesignImportResult,
  EnterpriseAppSpec,
  GenerationApproval,
  GenerationJob,
  GenerationRequest,
  GenerationLogEntry,
  OperatorPromptInput,
  ValidationResult,
} from "../shared/contracts.js";
import { buildEnterpriseAppSpec } from "../shared/spec-builder.js";
import { validateEnterpriseAppSpec, validatePromptInput } from "../shared/spec-validation.js";
import { DeterministicCouncilRuntime } from "./agent-runtime.js";
import { AppFactoryFileStore } from "./file-store.js";
import { GeneratedAppComposer } from "./generator.js";
import { NORTHSTAR_MEDICAL_LOGISTICS_PROMPT } from "./sample.js";

function now(): string {
  return new Date().toISOString();
}

function createJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface ParseResult {
  prompt: OperatorPromptInput;
  spec: EnterpriseAppSpec;
  validation: ValidationResult;
  designHandoff: ReturnType<typeof buildDesignHandoff>;
}

export class EnterpriseAppFactoryService {
  readonly store = new AppFactoryFileStore();
  readonly composer = new GeneratedAppComposer(this.store.generatedAppRoot, this.store.downloadDir);
  readonly councilRuntime = new DeterministicCouncilRuntime();
  readonly ready: Promise<void>;

  constructor() {
    this.ready = this.store.init().then(() => this.store.recoverInterruptedJobs());
  }

  async getDefaultPrompt(): Promise<OperatorPromptInput> {
    await this.ready;
    return NORTHSTAR_MEDICAL_LOGISTICS_PROMPT;
  }

  async parsePrompt(prompt: OperatorPromptInput): Promise<ParseResult> {
    await this.ready;
    const promptIssues = validatePromptInput(prompt);
    if (promptIssues.some((issue) => issue.severity === "error")) {
      return {
        prompt,
        spec: buildEnterpriseAppSpec(prompt),
        validation: {
          valid: false,
          confidence: "low",
          issues: promptIssues,
          summary: `Prompt has ${promptIssues.length} blocking issue(s).`,
        },
        designHandoff: buildDesignHandoff(buildEnterpriseAppSpec(prompt)),
      };
    }
    const spec = buildEnterpriseAppSpec(prompt);
    return {
      prompt,
      spec,
      validation: validateEnterpriseAppSpec(spec),
      designHandoff: buildDesignHandoff(spec),
    };
  }

  async importDesignPackage(request: DesignImportRequest): Promise<DesignImportResult> {
    await this.ready;
    return importDesignHandoff(request);
  }

  async listJobs(): Promise<GenerationJob[]> {
    await this.ready;
    return this.store.listJobs();
  }

  async getAgentRegistry(): Promise<AgentRegistry> {
    await this.ready;
    return APP_FACTORY_AGENT_REGISTRY;
  }

  async listAgentRuns(): Promise<AgentRun[]> {
    await this.ready;
    return this.store.listAgentRuns();
  }

  async getAgentRun(runId: string): Promise<AgentRun | undefined> {
    await this.ready;
    return this.store.readAgentRun(runId);
  }

  async getJob(jobId: string): Promise<GenerationJob | undefined> {
    await this.ready;
    return this.store.readJob(jobId);
  }

  async createAgentRun(request: AgentRunRequest): Promise<AgentRun> {
    await this.ready;
    const validation = validateEnterpriseAppSpec(request.spec);
    if (!validation.valid) {
      throw new Error(`Cannot run council review on an invalid spec: ${validation.summary}`);
    }
    const run = await this.councilRuntime.run(request);
    await this.store.writeAgentRun(run);
    await this.store.appendAuditEvent({
      at: now(),
      type: "agent.run.completed",
      actor: request.operator,
      subject: request.spec.customerProfile.slug,
      details: {
        runId: run.id,
        selectedSeatKeys: run.selectedSeatKeys,
        linkedGenerationJobId: request.linkedGenerationJobId,
      },
    });
    return run;
  }

  async createGenerationJob(request: GenerationRequest, startProcessing = true): Promise<GenerationJob> {
    await this.ready;
    this.ensureApproval(request.approval);
    const initialValidation = validateEnterpriseAppSpec(request.spec);
    const job: GenerationJob = {
      id: createJobId(),
      status: "queued",
      createdAt: now(),
      updatedAt: now(),
      prompt: request.prompt,
      spec: request.spec,
      validation: initialValidation,
      approval: request.approval,
      artifacts: [],
      verification: [],
      repairSummary: {
        attempted: false,
        actions: [],
        unresolved: [],
      },
      logs: [
        {
          at: now(),
          stage: "queue",
          level: "info",
          message: `Generation job created for ${request.spec.customerProfile.name}.`,
        },
      ],
    };

    await this.store.writeJob(job);
    await this.store.appendAuditEvent({
      at: now(),
      type: "generation.requested",
      actor: request.approval.approvedBy,
      subject: request.spec.customerProfile.slug,
      details: {
        jobId: job.id,
        reason: request.approval.reason,
      },
    });

    if (startProcessing) {
      void this.processGenerationJob(job.id);
    }
    return job;
  }

  async runGenerationAndWait(request: GenerationRequest): Promise<GenerationJob> {
    const job = await this.createGenerationJob(request, false);
    await this.processGenerationJob(job.id);
    const completed = await this.getJob(job.id);
    if (!completed) {
      throw new Error(`Generation job ${job.id} disappeared during processing.`);
    }
    return completed;
  }

  private ensureApproval(approval: GenerationApproval): void {
    if (!approval.approvedBy.trim() || !approval.reason.trim()) {
      throw new Error("Generation approval must include approver name and reason.");
    }
    if (approval.acknowledgedRisks.length === 0) {
      throw new Error("Generation approval must acknowledge at least one risk.");
    }
  }

  private async processGenerationJob(jobId: string): Promise<void> {
    const job = await this.getJob(jobId);
    if (!job || (job.status !== "queued" && job.status !== "running")) {
      return;
    }

    const appendLog = async (entry: Omit<GenerationLogEntry, "at">): Promise<void> => {
      job.logs.push({ ...entry, at: now() });
      job.updatedAt = now();
      await this.store.writeJob(job);
    };

    try {
      job.status = "running";
      job.updatedAt = now();
      await this.store.writeJob(job);

      await appendLog({ stage: "validate", level: "info", message: "Validating structured spec before generation." });
      job.validation = validateEnterpriseAppSpec(job.spec);
      if (!job.validation.valid) {
        job.status = "failed";
        job.failureReason = job.validation.summary;
        await appendLog({ stage: "validate", level: "error", message: job.validation.summary });
        await this.store.writeJob(job);
        return;
      }

      const composeResult = await this.composer.compose(job.spec, appendLog);
      job.workspacePath = composeResult.workspacePath;
      job.artifacts = composeResult.artifacts;

      const verification = await this.composer.verify(composeResult.workspacePath, appendLog);
      job.verification = verification.steps;
      const repaired = await this.composer.repairAndReverify(composeResult.workspacePath, verification, appendLog);
      job.repairSummary = repaired.repairSummary;
      job.verification = repaired.verification.steps;

      if (!repaired.verification.passed) {
        job.status = "failed";
        job.failureReason = repaired.verification.failureReason ?? "Generated app verification failed.";
        await appendLog({ stage: "verify", level: "error", message: job.failureReason });
      } else {
        const packaged = await this.composer.packageWorkspace(job.spec, composeResult.workspacePath, appendLog);
        job.artifacts = [...job.artifacts, packaged.artifact];
        job.handoff = packaged.handoff;
        job.status = "completed";
        await appendLog({ stage: "complete", level: "info", message: `Generated and verified workspace at ${path.relative(path.resolve(import.meta.dirname, "../../../../"), composeResult.workspacePath)}` });
      }

      job.updatedAt = now();
      await this.store.writeJob(job);
      await this.store.appendAuditEvent({
        at: now(),
        type: job.status === "completed" ? "generation.completed" : "generation.failed",
        actor: job.approval.approvedBy,
        subject: job.spec.customerProfile.slug,
        details: {
          jobId: job.id,
          status: job.status,
          workspacePath: job.workspacePath,
          failureReason: job.failureReason,
        },
      });
    } catch (error) {
      job.status = "failed";
      job.failureReason = (error as Error).message;
      job.updatedAt = now();
      await appendLog({ stage: "runtime", level: "error", message: job.failureReason });
      await this.store.writeJob(job);
      await this.store.appendAuditEvent({
        at: now(),
        type: "generation.failed",
        actor: job.approval.approvedBy,
        subject: job.spec.customerProfile.slug,
        details: {
          jobId: job.id,
          error: job.failureReason,
        },
      });
    }
  }
}
