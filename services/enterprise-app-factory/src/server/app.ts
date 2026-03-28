import express from "express";
import rateLimit from "express-rate-limit";
import fs from "node:fs/promises";
import path from "node:path";
import type { AgentRunRequest, DesignImportRequest, GenerationRequest, OperatorPromptInput } from "../shared/contracts.js";
import { EnterpriseAppFactoryService } from "./factory-service.js";

const app = express();
const service = new EnterpriseAppFactoryService();

function packageRoot(): string {
  return path.resolve(import.meta.dirname, "../..");
}

async function fileExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

const fileAccessLimiter = rateLimit({
  windowMs: 60_000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many file-backed requests. Please retry shortly.",
  },
});

function getParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

app.use(express.json({ limit: "2mb" }));
app.use(express.static(path.join(packageRoot(), "dist", "client")));

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "automindlab-enterprise-app-factory",
  });
});

app.get("/api/factory/default-prompt", async (_request, response, next) => {
  try {
    response.json(await service.getDefaultPrompt());
  } catch (error) {
    next(error);
  }
});

app.get("/api/factory/jobs", async (_request, response, next) => {
  try {
    response.json(await service.listJobs());
  } catch (error) {
    next(error);
  }
});

app.get("/api/factory/jobs/:jobId", async (request, response, next) => {
  try {
    const job = await service.getJob(request.params.jobId);
    if (!job) {
      response.status(404).json({ error: "Job not found." });
      return;
    }
    response.json(job);
  } catch (error) {
    next(error);
  }
});

app.get("/api/factory/jobs/:jobId/artifacts/:artifactKey/download", fileAccessLimiter, async (request, response, next) => {
  try {
    const jobId = getParam(request.params.jobId);
    const artifactKey = getParam(request.params.artifactKey);
    const job = await service.getJob(jobId);
    if (!job) {
      response.status(404).json({ error: "Job not found." });
      return;
    }
    const artifact = job.artifacts.find((candidate) => candidate.key === artifactKey && candidate.downloadable);
    if (!artifact) {
      response.status(404).json({ error: "Downloadable artifact not found." });
      return;
    }
    response.download(artifact.path, artifact.downloadName ?? path.basename(artifact.path));
  } catch (error) {
    next(error);
  }
});

app.get("/api/factory/agent-registry", async (_request, response, next) => {
  try {
    response.json(await service.getAgentRegistry());
  } catch (error) {
    next(error);
  }
});

app.get("/api/factory/module-registry", async (_request, response, next) => {
  try {
    response.json(await service.getModuleRegistry());
  } catch (error) {
    next(error);
  }
});

app.get("/api/factory/domain-packs", async (_request, response, next) => {
  try {
    response.json(await service.getDomainPackCatalog());
  } catch (error) {
    next(error);
  }
});

app.get("/api/factory/adapters", async (_request, response, next) => {
  try {
    response.json(await service.getAdapterCatalog());
  } catch (error) {
    next(error);
  }
});

app.get("/api/factory/agent-runs", async (_request, response, next) => {
  try {
    response.json(await service.listAgentRuns());
  } catch (error) {
    next(error);
  }
});

app.get("/api/factory/agent-runs/:runId", async (request, response, next) => {
  try {
    const run = await service.getAgentRun(request.params.runId);
    if (!run) {
      response.status(404).json({ error: "Agent run not found." });
      return;
    }
    response.json(run);
  } catch (error) {
    next(error);
  }
});

app.post("/api/factory/parse", async (request, response, next) => {
  try {
    response.json(await service.parsePrompt(request.body as OperatorPromptInput));
  } catch (error) {
    next(error);
  }
});

app.post("/api/factory/design/import", async (request, response, next) => {
  try {
    response.json(await service.importDesignPackage(request.body as DesignImportRequest));
  } catch (error) {
    next(error);
  }
});

app.post("/api/factory/agent-runs", async (request, response, next) => {
  try {
    const run = await service.createAgentRun(request.body as AgentRunRequest);
    response.status(201).json(run);
  } catch (error) {
    next(error);
  }
});

app.post("/api/factory/generate", async (request, response, next) => {
  try {
    const job = await service.createGenerationJob(request.body as GenerationRequest);
    response.status(202).json(job);
  } catch (error) {
    next(error);
  }
});

app.use(fileAccessLimiter, async (request, response, next) => {
  if (request.path.startsWith("/api/")) {
    next();
    return;
  }
  const clientIndex = path.join(packageRoot(), "dist", "client", "index.html");
  if (await fileExists(clientIndex)) {
    response.sendFile(clientIndex);
    return;
  }
  response.type("html").send(`
    <!doctype html>
    <html lang="en">
      <body style="font-family: sans-serif; padding: 24px;">
        <h1>Enterprise App Factory</h1>
        <p>The client bundle has not been built yet. Run <code>npm run build</code> inside <code>services/enterprise-app-factory</code>.</p>
      </body>
    </html>
  `);
});

app.use((error: Error, _request: express.Request, response: express.Response, next: express.NextFunction) => {
  void next;
  response.status(500).json({
    error: error.message,
  });
});

export { app, service };
