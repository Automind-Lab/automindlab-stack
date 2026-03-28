import { spawn } from "node:child_process";
import fsNative from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import archiver from "archiver";
import { buildDesignHandoff } from "../shared/design-handoff.js";
import { slugify } from "../shared/spec-builder.js";
import type {
  CompilerReport,
  DesignHandoffPackage,
  EnterpriseAppSpec,
  EvalSuiteResult,
  GenerationArtifact,
  GenerationLogEntry,
  GeneratedRuntimeKit,
  OperatorHandoff,
  RepairSummary,
  VerificationStepResult,
} from "../shared/contracts.js";

const TEXT_FILE_EXTENSIONS = new Set([".json", ".md", ".ts", ".tsx", ".css", ".html", ".txt"]);

function packageRoot(): string {
  return path.resolve(import.meta.dirname, "../..");
}

function templateRoot(): string {
  return path.join(packageRoot(), "templates", "generated-app");
}

function npmCommand(): string {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

async function exists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function copyTemplateDirectory(source: string, destination: string, replacements: Record<string, string>): Promise<void> {
  await fs.mkdir(destination, { recursive: true });
  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);
    if (entry.isDirectory()) {
      await copyTemplateDirectory(sourcePath, destinationPath, replacements);
      continue;
    }

    const extension = path.extname(entry.name);
    if (TEXT_FILE_EXTENSIONS.has(extension)) {
      let content = await fs.readFile(sourcePath, "utf8");
      for (const [token, value] of Object.entries(replacements)) {
        content = content.split(token).join(value);
      }
      await fs.writeFile(destinationPath, content, "utf8");
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }
}

async function runCommand(
  args: string[],
  cwd: string,
  log: (entry: Omit<GenerationLogEntry, "at">) => Promise<void>,
): Promise<{ status: "passed" | "failed"; details: string }> {
  const [command, ...rest] = args;
  await log({ stage: "verification", level: "info", message: `Running ${args.join(" ")} in ${cwd}` });
  return new Promise((resolve) => {
    const child =
      process.platform === "win32"
        ? spawn(process.env.comspec ?? "cmd.exe", ["/d", "/s", "/c", `${command} ${rest.join(" ")}`], { cwd, shell: false })
        : spawn(command, rest, { cwd, shell: false });
    let output = "";
    child.stdout.on("data", (chunk: Buffer | string) => {
      output += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer | string) => {
      output += chunk.toString();
    });
    child.on("close", (code) => {
      resolve({
        status: code === 0 ? "passed" : "failed",
        details: output.trim() || `${args.join(" ")} exited with code ${code ?? "unknown"}`,
      });
    });
  });
}

export interface ComposeResult {
  workspacePath: string;
  artifacts: GenerationArtifact[];
  designHandoff: DesignHandoffPackage;
}

export interface ComposeInput {
  spec: EnterpriseAppSpec;
  compilerReport: CompilerReport;
  runtimeKit: GeneratedRuntimeKit;
  evalSuite: EvalSuiteResult;
}

export interface VerificationOutcome {
  steps: VerificationStepResult[];
  passed: boolean;
  failureReason?: string;
}

export class GeneratedAppComposer {
  constructor(
    private readonly generatedRoot: string,
    private readonly downloadRoot: string,
  ) {}

  async compose(
    input: ComposeInput,
    log: (entry: Omit<GenerationLogEntry, "at">) => Promise<void>,
  ): Promise<ComposeResult> {
    const { spec, compilerReport, runtimeKit, evalSuite } = input;
    const appSlug = slugify(spec.customerProfile.name);
    const workspacePath = path.join(this.generatedRoot, appSlug);
    const designHandoff = buildDesignHandoff(spec, runtimeKit);
    const replacements = {
      "__APP_NAME__": spec.customerProfile.name,
      "__APP_SLUG__": appSlug,
      "__APP_SUMMARY__": spec.summary,
      "__APP_PRIMARY__": spec.customerProfile.branding.primaryColor,
      "__APP_SECONDARY__": spec.customerProfile.branding.secondaryColor,
      "__APP_ACCENT__": spec.customerProfile.branding.accentColor,
      "__APP_SURFACE__": spec.customerProfile.branding.surfaceColor,
      "__APP_CANVAS__": spec.customerProfile.branding.canvasColor,
    };

    await fs.rm(workspacePath, { recursive: true, force: true });
    await copyTemplateDirectory(templateRoot(), workspacePath, replacements);

    await fs.mkdir(path.join(workspacePath, "design"), { recursive: true });
    await fs.mkdir(path.join(workspacePath, "docs"), { recursive: true });
    await fs.mkdir(path.join(workspacePath, "runtime"), { recursive: true });
    await fs.writeFile(
      path.join(workspacePath, "src", "generated", "app-spec.ts"),
      `import type { GeneratedAppSpec } from "../types.js";\n\nexport const appSpec: GeneratedAppSpec = ${JSON.stringify(spec, null, 2)};\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "src", "generated", "runtime-kit.ts"),
      `import type { GeneratedRuntimeKitManifest } from "../types.js";\n\nexport const runtimeKit: GeneratedRuntimeKitManifest = ${JSON.stringify(runtimeKit, null, 2)};\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "src", "generated", "eval-suite.ts"),
      `import type { GeneratedEvalSuite } from "../types.js";\n\nexport const evalSuite: GeneratedEvalSuite = ${JSON.stringify(evalSuite, null, 2)};\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "src", "generated", "compiler-report.ts"),
      `import type { GeneratedCompilerReport } from "../types.js";\n\nexport const compilerReport: GeneratedCompilerReport = ${JSON.stringify(compilerReport, null, 2)};\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "design", "design-handoff.json"),
      `${JSON.stringify(designHandoff, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "design", "tokens.json"),
      `${JSON.stringify(designHandoff.tokens, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "design", "screen-map.json"),
      `${JSON.stringify(designHandoff.screenMap, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "design", "content-model.json"),
      `${JSON.stringify(designHandoff.contentModel, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "runtime", "runtime-kit.json"),
      `${JSON.stringify(runtimeKit, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "runtime", "eval-suite.json"),
      `${JSON.stringify(evalSuite, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "runtime", "compiler-report.json"),
      `${JSON.stringify(compilerReport, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "factory-manifest.json"),
      `${JSON.stringify({
        generatedAt: new Date().toISOString(),
        specVersion: spec.schemaVersion,
        compilerVersion: compilerReport.compilerVersion,
        runtimeKitVersion: runtimeKit.kitVersion,
        evalSuiteVersion: evalSuite.suiteVersion,
        appSlug,
        designPackage: "design/design-handoff.json",
        runtimeKit: "runtime/runtime-kit.json",
      }, null, 2)}\n`,
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "docs", "ARCHITECTURE.md"),
      [
        `# ${spec.customerProfile.name} Architecture`,
        "",
        spec.summary,
        "",
        "## Compiler",
        "",
        `- Compiler version: ${compilerReport.compilerVersion}`,
        `- Runtime target: ${compilerReport.targetRuntime}`,
        `- Domain packs: ${compilerReport.selectedDomainPackKeys.join(", ")}`,
        `- Modules: ${compilerReport.selectedModuleKeys.join(", ")}`,
        `- Adapters: ${compilerReport.selectedAdapterKeys.join(", ")}`,
        "",
        "## Persistence ownership",
        "",
        spec.blueprint.persistenceOwnership,
        "",
        "## Eval summary",
        "",
        `${evalSuite.summary}`,
      ].join("\n"),
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "docs", "CUSTOMIZATION.md"),
      [
        `# ${spec.customerProfile.name} Customization Guide`,
        "",
        "Change the generated app through these files:",
        "",
        "- `src/generated/app-spec.ts` for structured spec updates",
        "- `src/generated/runtime-kit.ts` for page and widget composition",
        "- `src/generated/eval-suite.ts` for compiler eval evidence",
        "- `design/design-handoff.json` for design token and component inventory export",
        "- `src/styles.css` for runtime theme refinements",
        "- `docs/ARCHITECTURE.md` to review ownership and approval boundaries",
      ].join("\n"),
      "utf8",
    );
    await fs.writeFile(
      path.join(workspacePath, "docs", "RUNTIME_KIT.md"),
      [
        `# ${spec.customerProfile.name} Runtime Kit`,
        "",
        `Runtime kit version: ${runtimeKit.kitVersion}`,
        "",
        "## Pages",
        "",
        ...runtimeKit.pages.map((page) => `- ${page.title} (${page.route})`),
        "",
        "## Editable files",
        "",
        ...runtimeKit.editableFiles.map((file) => `- ${file.label}: ${file.path}`),
      ].join("\n"),
      "utf8",
    );

    await log({ stage: "compose", level: "info", message: `Generated workspace at ${workspacePath}` });
    return {
      workspacePath,
      designHandoff,
      artifacts: [
        { key: "workspace", type: "workspace", path: workspacePath, label: "Generated workspace" },
        { key: "design-handoff", type: "design", path: path.join(workspacePath, "design", "design-handoff.json"), label: "Design handoff package", downloadable: true, downloadName: `${appSlug}-design-handoff.json` },
        { key: "runtime-kit", type: "runtime-kit", path: path.join(workspacePath, "runtime", "runtime-kit.json"), label: "Generated runtime kit", downloadable: true, downloadName: `${appSlug}-runtime-kit.json` },
        { key: "eval-suite", type: "eval", path: path.join(workspacePath, "runtime", "eval-suite.json"), label: "Compiler eval suite", downloadable: true, downloadName: `${appSlug}-eval-suite.json` },
        { key: "customization-guide", type: "docs", path: path.join(workspacePath, "docs", "CUSTOMIZATION.md"), label: "Customization guide", downloadable: true, downloadName: `${appSlug}-customization.md` },
        { key: "factory-manifest", type: "manifest", path: path.join(workspacePath, "factory-manifest.json"), label: "Factory manifest", downloadable: true, downloadName: `${appSlug}-factory-manifest.json` },
      ],
    };
  }

  async verify(
    workspacePath: string,
    log: (entry: Omit<GenerationLogEntry, "at">) => Promise<void>,
  ): Promise<VerificationOutcome> {
    const steps: VerificationStepResult[] = [];
    const nodeModulesPath = path.join(workspacePath, "node_modules");
    if (!(await exists(nodeModulesPath))) {
      const installResult = await runCommand([npmCommand(), "install"], workspacePath, log);
      steps.push({ step: "install", status: installResult.status, details: installResult.details });
      if (installResult.status === "failed") {
        return { steps, passed: false, failureReason: installResult.details };
      }
    } else {
      steps.push({ step: "install", status: "skipped", details: "Dependencies already present" });
    }

    const commands: Array<[string, string[]]> = [
      ["lint", [npmCommand(), "run", "lint"]],
      ["typecheck", [npmCommand(), "run", "typecheck"]],
      ["test", [npmCommand(), "run", "test"]],
      ["smoke", [npmCommand(), "run", "smoke"]],
      ["build", [npmCommand(), "run", "build"]],
    ];

    for (const [stepName, command] of commands) {
      const result = await runCommand(command, workspacePath, log);
      steps.push({ step: stepName, status: result.status, details: result.details });
      if (result.status === "failed") {
        return { steps, passed: false, failureReason: result.details };
      }
    }

    return { steps, passed: true };
  }

  async repairAndReverify(
    workspacePath: string,
    verification: VerificationOutcome,
    log: (entry: Omit<GenerationLogEntry, "at">) => Promise<void>,
  ): Promise<{ repairSummary: RepairSummary; verification: VerificationOutcome }> {
    const repairSummary: RepairSummary = {
      attempted: false,
      actions: [],
      unresolved: [],
    };

    if (verification.passed) {
      return { repairSummary, verification };
    }

    repairSummary.attempted = true;
    const nodeModulesPath = path.join(workspacePath, "node_modules");
    if (!(await exists(nodeModulesPath))) {
      repairSummary.actions.push("Installed missing dependencies before retrying verification.");
      const installResult = await runCommand([npmCommand(), "install"], workspacePath, log);
      if (installResult.status === "failed") {
        repairSummary.unresolved.push(installResult.details);
        return { repairSummary, verification };
      }
      return {
        repairSummary,
        verification: await this.verify(workspacePath, log),
      };
    }

    repairSummary.actions.push("No deterministic automated repair was available for the failing generated workspace.");
    repairSummary.unresolved.push(verification.failureReason ?? "Generated workspace verification failed without a captured failure reason.");
    return { repairSummary, verification };
  }

  async packageWorkspace(
    spec: EnterpriseAppSpec,
    workspacePath: string,
    runtimeKit: GeneratedRuntimeKit,
    evalSuite: EvalSuiteResult,
    log: (entry: Omit<GenerationLogEntry, "at">) => Promise<void>,
  ): Promise<{ artifact: GenerationArtifact; handoff: OperatorHandoff }> {
    const appSlug = slugify(spec.customerProfile.name);
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const archivePath = path.join(this.downloadRoot, `${appSlug}-${timestamp}.zip`);
    await fs.mkdir(this.downloadRoot, { recursive: true });
    await this.createArchive(workspacePath, archivePath, log);

    return {
      artifact: {
        key: "workspace-archive",
        type: "archive",
        path: archivePath,
        label: "Downloadable package",
        downloadable: true,
        downloadName: path.basename(archivePath),
      },
      handoff: this.buildOperatorHandoff(spec, workspacePath, archivePath, runtimeKit, evalSuite),
    };
  }

  private async createArchive(
    sourceDir: string,
    archivePath: string,
    log: (entry: Omit<GenerationLogEntry, "at">) => Promise<void>,
  ): Promise<void> {
    await log({ stage: "package", level: "info", message: `Packaging verified workspace into ${archivePath}` });
    await new Promise<void>((resolve, reject) => {
      const output = fsNative.createWriteStream(archivePath);
      const archive = archiver("zip", { zlib: { level: 9 } });

      output.on("close", () => resolve());
      output.on("error", (error: Error) => reject(error));
      archive.on("error", (error: Error) => reject(error));

      archive.pipe(output);
      archive.directory(sourceDir, false);
      void archive.finalize();
    });
  }

  private buildOperatorHandoff(
    spec: EnterpriseAppSpec,
    workspacePath: string,
    archivePath: string,
    runtimeKit: GeneratedRuntimeKit,
    evalSuite: EvalSuiteResult,
  ): OperatorHandoff {
    return {
      startupInstructions: [
        `Unzip ${path.basename(archivePath)} or use the workspace at ${workspacePath}.`,
        "Run `npm install` in the generated workspace if dependencies are not already present.",
        "Run `npm run dev` to launch the customer app locally.",
      ],
      architectureSummary: [
        spec.summary,
        spec.blueprint.persistenceOwnership,
        `Core workflows: ${spec.coreWorkflows.map((workflow) => workflow.name).join(", ")}`,
      ],
      assumptions: [...spec.assumptions],
      knownLimitations: [
        ...spec.unresolvedItems,
        "The constrained council runtime is advisory and does not provide full Codex desktop parity.",
      ],
      nextRecommendedEdits: [
        "Review unresolved items and approval gates with the customer operator.",
        "Customize branding tokens and copy before broader stakeholder review.",
        "Confirm identity provider, notification destinations, and integration contracts before production planning.",
      ],
      customizationAreas: [
        { label: "Structured app spec", path: path.join(workspacePath, "src", "generated", "app-spec.ts") },
        { label: "Runtime kit manifest", path: path.join(workspacePath, "src", "generated", "runtime-kit.ts") },
        { label: "Theme and runtime styles", path: path.join(workspacePath, "src", "styles.css") },
        { label: "Design handoff package", path: path.join(workspacePath, "design", "design-handoff.json") },
        { label: "Customization guide", path: path.join(workspacePath, "docs", "CUSTOMIZATION.md") },
      ],
      runtimeKitHighlights: [
        `Pages: ${runtimeKit.pages.map((page) => page.title).join(", ")}`,
        `Eval score: ${evalSuite.score}`,
        `Editable files: ${runtimeKit.editableFiles.map((file) => file.path).join(", ")}`,
      ],
      adapterReviewAreas: spec.adapterBindings.map((binding) => `${binding.name}: ${binding.status}`),
      approvalReviewAreas: spec.approvalGates.map((gate) => `${gate.name}: ${gate.trigger}`),
      testingChecklist: [
        "Open the dashboard and confirm navigation renders all expected modules.",
        "Inspect at least one entity screen, one workflow screen, and the approvals screen.",
        "Review the runtime kit and eval suite artifacts before deeper customization.",
        "Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run smoke`, and `npm run build` after customization changes.",
      ],
    };
  }
}
