import type { GeneratedEvalSuite } from "../types.js";

export const evalSuite: GeneratedEvalSuite = {
  suiteVersion: "template-eval-suite",
  overallStatus: "passed",
  score: 100,
  summary: "Template runtime kit eval passed.",
  cases: [
    {
      key: "template-smoke",
      label: "Template smoke",
      status: "passed",
      summary: "The generated template ships with runtime kit placeholders wired in.",
      details: ["Replace with compiled eval output during generation."],
    },
  ],
};
