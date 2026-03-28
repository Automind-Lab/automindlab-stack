import type { EnterpriseAppSpec, OperatorPromptInput } from "./contracts.js";
import { compileEnterpriseApp, slugify } from "./compiler.js";

export { slugify };

export function buildEnterpriseAppSpec(input: OperatorPromptInput): EnterpriseAppSpec {
  return compileEnterpriseApp(input).spec;
}
