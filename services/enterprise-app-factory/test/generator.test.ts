import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildEnterpriseAppSpec } from "../src/shared/spec-builder.js";
import { GeneratedAppComposer } from "../src/server/generator.js";
import { NORTHSTAR_MEDICAL_LOGISTICS_PROMPT } from "../src/server/sample.js";

test("composer writes a generated workspace without verification", async () => {
  const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "automind-factory-"));
  const downloadRoot = path.join(tmpRoot, "downloads");
  const composer = new GeneratedAppComposer(tmpRoot, downloadRoot);
  const spec = buildEnterpriseAppSpec(NORTHSTAR_MEDICAL_LOGISTICS_PROMPT);

  const result = await composer.compose(spec, async () => {});
  const packaged = await composer.packageWorkspace(spec, result.workspacePath, async () => {});

  const specModule = await fs.readFile(path.join(result.workspacePath, "src", "generated", "app-spec.ts"), "utf8");
  expect(specModule).toContain("Northstar Medical Logistics");
  expect(result.artifacts.some((artifact) => artifact.type === "design")).toBe(true);
  await expect(fs.access(packaged.artifact.path)).resolves.toBeUndefined();
  expect(packaged.artifact.type).toBe("archive");
  expect(packaged.handoff.startupInstructions.length).toBeGreaterThan(0);
});
