import type { ReactElement } from "react";
import type { GeneratedAppSpec } from "../types.js";

interface WorkflowCardProps {
  workflow: GeneratedAppSpec["coreWorkflows"][number];
}

export function WorkflowCard({ workflow }: WorkflowCardProps): ReactElement {
  return (
    <article className="workflow-card">
      <h3>{workflow.name}</h3>
      <p>{workflow.description}</p>
      <ol>
        {workflow.steps.map((step) => (
          <li key={step.key}>
            <strong>{step.label}</strong>
            <span>{step.action}</span>
            <small>{step.ownerRoles.join(", ")}</small>
          </li>
        ))}
      </ol>
    </article>
  );
}
