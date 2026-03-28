import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { compileEnterpriseApp } from "../src/shared/compiler.js";
import { GeneratedAppComposer } from "../src/server/generator.js";
import { NORTHSTAR_MEDICAL_LOGISTICS_PROMPT } from "../src/server/sample.js";

test("composer writes a generated workspace without verification", async () => {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "automind-factory-"));
  const downloadRoot = path.join(tmpRoot, "downloads");
  const composer = new GeneratedAppComposer(tmpRoot, downloadRoot);
  const compiled = compileEnterpriseApp(NORTHSTAR_MEDICAL_LOGISTICS_PROMPT);

  const result = await composer.compose({
    spec: compiled.spec,
    compilerReport: compiled.compilerReport,
    runtimeKit: compiled.runtimeKit,
    evalSuite: compiled.evalSuite,
  }, async () => {});
  const packaged = await composer.packageWorkspace(compiled.spec, result.workspacePath, compiled.runtimeKit, compiled.evalSuite, async () => {});

  const specModule = await fs.readFile(path.join(result.workspacePath, "src", "generated", "app-spec.ts"), "utf8");
  const runtimeKitModule = await fs.readFile(path.join(result.workspacePath, "src", "generated", "runtime-kit.ts"), "utf8");
  expect(specModule).toContain("Northstar Medical Logistics");
  expect(runtimeKitModule).toContain("GeneratedRuntimeKitManifest");
  expect(result.artifacts.some((artifact) => artifact.type === "design")).toBe(true);
  expect(result.artifacts.some((artifact) => artifact.type === "runtime-kit")).toBe(true);
  await expect(fs.access(packaged.artifact.path)).resolves.toBeUndefined();
  expect(packaged.artifact.type).toBe("archive");
  expect(packaged.handoff.startupInstructions.length).toBeGreaterThan(0);
});
