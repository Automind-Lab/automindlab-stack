import { startTransition, useDeferredValue, useEffect, useMemo, useState, type ReactElement } from "react";
import type {
  AgentDefinition,
  AgentRegistry,
  AgentRun,
  AgentRunNode,
  DesignImportResult,
  DesignHandoffPackage,
  EnterpriseAppSpec,
  GenerationArtifact,
  GenerationJob,
  OperatorPromptInput,
  ValidationResult,
} from "../shared/contracts.js";

type ParseResponse = {
  prompt: OperatorPromptInput;
  spec: EnterpriseAppSpec;
  validation: ValidationResult;
  designHandoff: DesignHandoffPackage;
};

const TAB_ORDER = ["overview", "model", "design", "council", "jobs"] as const;

const EMPTY_PROMPT: OperatorPromptInput = {
  customerName: "",
  businessDescription: "",
  applicationNeeds: "",
  constraints: {
    industry: "",
    compliance: [],
    integrations: [],
    branding: {},
    roles: [],
    approvalRequirements: [],
    environment: "",
    deploymentTarget: "",
    tenancy: "multi-tenant",
  },
};

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json() as Promise<T>;
}

function listToText(items: string[]): string {
  return items.join(", ");
}

function textToList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function metricCards(spec: EnterpriseAppSpec | null): Array<{ label: string; value: string }> {
  if (!spec) {
    return [
      { label: "Entities", value: "0" },
      { label: "Workflows", value: "0" },
      { label: "Approval Gates", value: "0" },
      { label: "Integrations", value: "0" },
    ];
  }

  return [
    { label: "Entities", value: String(spec.businessEntities.length) },
    { label: "Workflows", value: String(spec.coreWorkflows.length) },
    { label: "Approval Gates", value: String(spec.approvalGates.length) },
    { label: "Integrations", value: String(spec.integrations.length) },
  ];
}

function artifactDownloadUrl(job: GenerationJob, artifact: GenerationArtifact): string {
  return `/api/factory/jobs/${job.id}/artifacts/${artifact.key}/download`;
}

function sortSeatOptions(registry: AgentRegistry | null): AgentDefinition[] {
  return registry?.agents.filter((agent) => agent.type === "council-seat") ?? [];
}

function supportClass(support: string): string {
  switch (support) {
    case "supported":
      return "status-good";
    case "unsupported":
      return "status-risk";
    default:
      return "status-caution";
  }
}

function AgentTree({ node }: { node: AgentRunNode }): ReactElement {
  return (
    <article className={`agent-node depth-${Math.min(node.depth, 3)}`}>
      <header className="agent-node-header">
        <div>
          <p className="eyebrow">{node.type}</p>
          <h4>{node.name}</h4>
          <p>{node.summary}</p>
        </div>
        <span className={`job-status ${node.status}`}>{node.status}</span>
      </header>
      {node.findings.length > 0 ? (
        <ul className="line-list compact">
          {node.findings.map((item) => (
            <li key={`${node.id}-${item.title}`}>
              <strong>{item.severity.toUpperCase()}</strong> {item.title}: {item.detail}
            </li>
          ))}
        </ul>
      ) : null}
      {node.recommendations.length > 0 ? (
        <div className="recommendation-stack">
          {node.recommendations.map((item) => (
            <div key={item.key} className="recommendation">
              <strong>{item.title}</strong>
              <span>{item.rationale}</span>
              <small>{item.owner} / {item.priority}{item.blocking ? " / blocking" : ""}</small>
            </div>
          ))}
        </div>
      ) : null}
      {node.children.length > 0 ? (
        <div className="agent-children">
          {node.children.map((child) => <AgentTree key={child.id} node={child} />)}
        </div>
      ) : null}
    </article>
  );
}

function CapabilityMatrix({ registry }: { registry: AgentRegistry | null }): ReactElement {
  return (
    <div className="capability-grid">
      {registry?.capabilityMatrix.map((capability) => (
        <article key={capability.key} className="capability-card">
          <div className="capability-head">
            <h4>{capability.label}</h4>
            <span className={supportClass(capability.support)}>{capability.support}</span>
          </div>
          <p>{capability.notes}</p>
        </article>
      )) ?? <p>No capability registry loaded yet.</p>}
    </div>
  );
}

export default function App(): ReactElement {
  const [prompt, setPrompt] = useState<OperatorPromptInput>(EMPTY_PROMPT);
  const [parseResult, setParseResult] = useState<ParseResponse | null>(null);
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [agentRegistry, setAgentRegistry] = useState<AgentRegistry | null>(null);
  const [agentRuns, setAgentRuns] = useState<AgentRun[]>([]);
  const [currentAgentRun, setCurrentAgentRun] = useState<AgentRun | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TAB_ORDER)[number]>("overview");
  const [operatorName, setOperatorName] = useState("Enterprise Operator");
  const [approvalReason, setApprovalReason] = useState("Generate an editable customer workspace from the reviewed spec.");
  const [currentJob, setCurrentJob] = useState<GenerationJob | null>(null);
  const [designImportText, setDesignImportText] = useState("");
  const [designImportResult, setDesignImportResult] = useState<DesignImportResult | null>(null);
  const [jobFilter, setJobFilter] = useState("");
  const [agentFocusText, setAgentFocusText] = useState("architecture, security, download, test");
  const [requestedSeatKeys, setRequestedSeatKeys] = useState<string[]>([]);
  const [allowDelegation, setAllowDelegation] = useState(true);
  const [delegationDepth, setDelegationDepth] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deferredJobFilter = useDeferredValue(jobFilter);

  useEffect(() => {
    void (async () => {
      try {
        const [defaultPrompt, initialJobs, registry, initialAgentRuns] = await Promise.all([
          getJson<OperatorPromptInput>("/api/factory/default-prompt"),
          getJson<GenerationJob[]>("/api/factory/jobs"),
          getJson<AgentRegistry>("/api/factory/agent-registry"),
          getJson<AgentRun[]>("/api/factory/agent-runs"),
        ]);
        startTransition(() => {
          setPrompt(defaultPrompt);
          setJobs(initialJobs);
          setCurrentJob(initialJobs[0] ?? null);
          setAgentRegistry(registry);
          setAgentRuns(initialAgentRuns);
          setCurrentAgentRun(initialAgentRuns[0] ?? null);
        });
      } catch (loadError) {
        setError((loadError as Error).message);
      }
    })();
  }, []);

  useEffect(() => {
    if (!currentJob || !["queued", "running"].includes(currentJob.status)) {
      return;
    }
    const handle = window.setInterval(() => {
      void (async () => {
        try {
          const job = await getJson<GenerationJob>(`/api/factory/jobs/${currentJob.id}`);
          startTransition(() => {
            setCurrentJob(job);
            setJobs((previous) => [job, ...previous.filter((candidate) => candidate.id !== job.id)]);
          });
        } catch (pollError) {
          setError((pollError as Error).message);
        }
      })();
    }, 2000);
    return () => window.clearInterval(handle);
  }, [currentJob]);

  const visibleJobs = useMemo(() => {
    const query = deferredJobFilter.trim().toLowerCase();
    if (!query) {
      return jobs;
    }
    return jobs.filter((job) =>
      [job.spec.customerProfile.name, job.status, job.approval.approvedBy]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [deferredJobFilter, jobs]);

  const displaySpec = parseResult?.spec ?? currentJob?.spec ?? currentAgentRun?.request.spec ?? null;
  const displayValidation = parseResult?.validation ?? currentJob?.validation ?? null;
  const displayDesign = parseResult?.designHandoff ?? null;
  const seatOptions = sortSeatOptions(agentRegistry);

  async function handleParse(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const result = await postJson<ParseResponse>("/api/factory/parse", prompt);
      startTransition(() => {
        setParseResult(result);
        setActiveTab("overview");
      });
    } catch (parseError) {
      setError((parseError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCouncilReview(): Promise<void> {
    if (!parseResult) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const run = await postJson<AgentRun>("/api/factory/agent-runs", {
        prompt,
        spec: parseResult.spec,
        operator: operatorName,
        focus: textToList(agentFocusText),
        requestedSeatKeys,
        allowDelegation,
        maxDelegationDepth: delegationDepth,
        providerMode: "deterministic",
      });
      startTransition(() => {
        setCurrentAgentRun(run);
        setAgentRuns((previous) => [run, ...previous.filter((candidate) => candidate.id !== run.id)]);
        setActiveTab("council");
      });
    } catch (runError) {
      setError((runError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(): Promise<void> {
    if (!parseResult) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const job = await postJson<GenerationJob>("/api/factory/generate", {
        prompt,
        spec: parseResult.spec,
        approval: {
          approvedBy: operatorName,
          approvedAt: new Date().toISOString(),
          reason: approvalReason,
          acknowledgedRisks: [
            "Workspace files will be written to generated-apps",
            "Verification commands will install dependencies when needed",
            "Open questions remain visible in the spec and handoff package",
          ],
        },
      });
      startTransition(() => {
        setCurrentJob(job);
        setJobs((previous) => [job, ...previous.filter((candidate) => candidate.id !== job.id)]);
        setActiveTab("jobs");
      });
    } catch (generationError) {
      setError((generationError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDesignImport(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const result = await postJson<DesignImportResult>("/api/factory/design/import", {
        packageName: "manual-import",
        json: designImportText,
      });
      startTransition(() => setDesignImportResult(result));
    } catch (designError) {
      setError((designError as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function toggleSeat(seatKey: string): void {
    setRequestedSeatKeys((previous) =>
      previous.includes(seatKey)
        ? previous.filter((candidate) => candidate !== seatKey)
        : [...previous, seatKey],
    );
  }

  return (
    <div className="shell">
      <aside className="rail">
        <div className="brand">
          <p className="eyebrow">AutoMindLab</p>
          <h1>Enterprise App Factory</h1>
          <p className="lede">Typed operator review, bounded council delegation, verified generation, and downloadable customer app packages.</p>
        </div>

        <section className="panel">
          <h2>Prompt Intake</h2>
          <label>
            Customer Name
            <input value={prompt.customerName} onChange={(event) => setPrompt({ ...prompt, customerName: event.target.value })} />
          </label>
          <label>
            Business Description
            <textarea value={prompt.businessDescription} onChange={(event) => setPrompt({ ...prompt, businessDescription: event.target.value })} rows={4} />
          </label>
          <label>
            Application Needs
            <textarea value={prompt.applicationNeeds} onChange={(event) => setPrompt({ ...prompt, applicationNeeds: event.target.value })} rows={6} />
          </label>
          <label>
            Industry
            <input value={prompt.constraints.industry ?? ""} onChange={(event) => setPrompt({ ...prompt, constraints: { ...prompt.constraints, industry: event.target.value } })} />
          </label>
          <label>
            Compliance
            <input value={listToText(prompt.constraints.compliance)} onChange={(event) => setPrompt({ ...prompt, constraints: { ...prompt.constraints, compliance: textToList(event.target.value) } })} />
          </label>
          <label>
            Integrations
            <input value={listToText(prompt.constraints.integrations)} onChange={(event) => setPrompt({ ...prompt, constraints: { ...prompt.constraints, integrations: textToList(event.target.value) } })} />
          </label>
          <label>
            Roles
            <input value={listToText(prompt.constraints.roles)} onChange={(event) => setPrompt({ ...prompt, constraints: { ...prompt.constraints, roles: textToList(event.target.value) } })} />
          </label>
          <label>
            Approval Requirements
            <input value={listToText(prompt.constraints.approvalRequirements)} onChange={(event) => setPrompt({ ...prompt, constraints: { ...prompt.constraints, approvalRequirements: textToList(event.target.value) } })} />
          </label>
          <label>
            Environment
            <input value={prompt.constraints.environment ?? ""} onChange={(event) => setPrompt({ ...prompt, constraints: { ...prompt.constraints, environment: event.target.value } })} />
          </label>
          <button className="primary" onClick={() => void handleParse()} disabled={loading}>
            {loading ? "Working..." : "Parse and Preview Spec"}
          </button>
        </section>

        <section className="panel">
          <h2>Council Review</h2>
          <p className="panel-copy">Deterministic, operator-visible, and bounded. Seats can delegate only to approved specialists and checks.</p>
          <label>
            Review Focus
            <input value={agentFocusText} onChange={(event) => setAgentFocusText(event.target.value)} />
          </label>
          <div className="seat-picker">
            {seatOptions.map((seat) => (
              <button key={seat.key} className={requestedSeatKeys.includes(seat.key) ? "seat-chip active" : "seat-chip"} onClick={() => toggleSeat(seat.key)} type="button">
                {seat.name}
              </button>
            ))}
          </div>
          <label className="checkbox">
            <input type="checkbox" checked={allowDelegation} onChange={(event) => setAllowDelegation(event.target.checked)} />
            Allow nested delegation
          </label>
          <label>
            Max Delegation Depth
            <input
              type="number"
              min={1}
              max={3}
              value={delegationDepth}
              onChange={(event) => setDelegationDepth(Number(event.target.value))}
            />
          </label>
          <button className="secondary" onClick={() => void handleCouncilReview()} disabled={!parseResult || loading}>
            Run Council Review
          </button>
        </section>
      </aside>

      <main className="workspace">
        <header className="workspace-header">
          <div className="workspace-hero panel hero-panel">
            <div>
              <p className="eyebrow">Operator Review</p>
              <h2>{displaySpec?.customerProfile.name ?? "Awaiting structured spec"}</h2>
              <p>{displaySpec?.summary ?? "Parse the operator prompt to review structure, council guidance, and generation readiness before writing a workspace."}</p>
            </div>
            <div className="metrics-row">
              {metricCards(displaySpec).map((item) => (
                <div key={item.label} className="metric-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="approval-box">
            <label>
              Approved By
              <input value={operatorName} onChange={(event) => setOperatorName(event.target.value)} />
            </label>
            <label>
              Approval Reason
              <textarea value={approvalReason} onChange={(event) => setApprovalReason(event.target.value)} rows={3} />
            </label>
            <button className="primary" onClick={() => void handleGenerate()} disabled={!parseResult || loading || Boolean(displayValidation && !displayValidation.valid)}>
              Approve and Generate Package
            </button>
          </div>
        </header>

        {error ? <div className="error-banner">{error}</div> : null}

        <nav className="tab-strip">
          {TAB_ORDER.map((tab) => (
            <button key={tab} className={activeTab === tab ? "tab active" : "tab"} onClick={() => setActiveTab(tab)}>
              {tab}
            </button>
          ))}
        </nav>

        {activeTab === "overview" && (
          <section className="content-grid">
            <article className="panel">
              <h3>Validation and Uncertainty</h3>
              <p className={displayValidation?.valid ? "status-good" : "status-risk"}>{displayValidation?.summary ?? "No validation yet."}</p>
              <ul className="line-list">
                {displayValidation?.issues.length
                  ? displayValidation.issues.map((issue) => (
                      <li key={`${issue.code}-${issue.path}`}>
                        <strong>{issue.severity.toUpperCase()}</strong> {issue.message}
                      </li>
                    ))
                  : <li>Parse the prompt to surface required-field and conflict checks.</li>}
              </ul>
              {displaySpec ? (
                <div className="uncertainty-box">
                  <strong>Confidence: {displaySpec.uncertainty.level}</strong>
                  <p>{displaySpec.uncertainty.reasons.join(" ")}</p>
                </div>
              ) : null}
            </article>

            <article className="panel">
              <h3>Assumptions and Unresolved Items</h3>
              <div className="split-list">
                <div>
                  <h4>Assumptions</h4>
                  <ul className="line-list">
                    {displaySpec?.assumptions.map((item) => <li key={item}>{item}</li>) ?? <li>No assumptions yet.</li>}
                  </ul>
                </div>
                <div>
                  <h4>Unresolved</h4>
                  <ul className="line-list">
                    {displaySpec?.unresolvedItems.map((item) => <li key={item}>{item}</li>) ?? <li>No unresolved items yet.</li>}
                  </ul>
                </div>
              </div>
            </article>

            <article className="panel full">
              <h3>Capability Matrix</h3>
              <CapabilityMatrix registry={agentRegistry} />
            </article>

            <article className="panel full">
              <h3>Generated App Preview</h3>
              <div className="preview-shell">
                <nav className="preview-nav">
                  {displaySpec?.navigation.map((item) => <span key={item.key}>{item.label}</span>) ?? null}
                </nav>
                <div className="preview-main">
                  <div>
                    <p className="eyebrow">Ready-To-Test Handoff</p>
                    <h4>{displaySpec?.customerProfile.name ?? "Generated workspace"}</h4>
                    <p>{displaySpec?.blueprint.persistenceOwnership ?? "Generated apps keep ownership of their business records and approvals."}</p>
                  </div>
                  <div className="pill-row">
                    {displaySpec?.reportingViews.map((report) => <span key={report.key} className="pill">{report.name}</span>) ?? null}
                  </div>
                </div>
              </div>
            </article>
          </section>
        )}

        {activeTab === "model" && (
          <section className="content-grid">
            <article className="panel">
              <h3>Entity Model</h3>
              <div className="entity-grid">
                {displaySpec?.businessEntities.map((entity) => (
                  <article key={entity.key} className="entity">
                    <h4>{entity.label}</h4>
                    <p>{entity.description}</p>
                    <p className="meta">{entity.operations.join(" / ")}</p>
                    <ul className="line-list compact">
                      {entity.fields.map((field) => (
                        <li key={field.key}>{field.label} ({field.type})</li>
                      ))}
                    </ul>
                  </article>
                )) ?? <p>Parse the prompt to derive entities.</p>}
              </div>
            </article>

            <article className="panel">
              <h3>Workflows</h3>
              {displaySpec?.coreWorkflows.map((workflow) => (
                <article key={workflow.key} className="workflow">
                  <header>
                    <h4>{workflow.name}</h4>
                    <p>{workflow.description}</p>
                  </header>
                  <ol className="timeline">
                    {workflow.steps.map((step) => (
                      <li key={step.key}>
                        <strong>{step.label}</strong>
                        <span>{step.action}</span>
                        <small>{step.ownerRoles.join(", ")}</small>
                      </li>
                    ))}
                  </ol>
                </article>
              )) ?? <p>Parse the prompt to derive workflows.</p>}
            </article>

            <article className="panel">
              <h3>Roles and Permissions</h3>
              <ul className="line-list">
                {displaySpec?.userRoles.map((role) => (
                  <li key={role.key}>
                    <strong>{role.name}</strong> {role.description}
                  </li>
                )) ?? <li>No roles yet.</li>}
              </ul>
            </article>

            <article className="panel">
              <h3>Integrations and Compliance</h3>
              <ul className="line-list">
                {displaySpec?.integrations.map((integration) => (
                  <li key={integration.key}>
                    <strong>{integration.name}</strong> {integration.notes}
                  </li>
                )) ?? <li>No integrations yet.</li>}
              </ul>
              <div className="divider" />
              <ul className="line-list">
                {displaySpec?.complianceRequirements.map((requirement) => (
                  <li key={requirement.key}>
                    <strong>{requirement.name}</strong> {requirement.controls.join(", ")}
                  </li>
                )) ?? <li>No compliance requirements yet.</li>}
              </ul>
            </article>
          </section>
        )}

        {activeTab === "design" && (
          <section className="content-grid">
            <article className="panel">
              <h3>Design Export</h3>
              <p className="panel-copy">The design handoff stays optional and Figma-friendly. Generation never depends on the adapter being available.</p>
              <pre>{displayDesign ? JSON.stringify(displayDesign, null, 2) : "Run the parser to prepare design export output."}</pre>
            </article>

            <article className="panel">
              <h3>Design Import</h3>
              <textarea value={designImportText} onChange={(event) => setDesignImportText(event.target.value)} rows={18} />
              <button className="secondary" onClick={() => void handleDesignImport()} disabled={loading || !designImportText.trim()}>
                Validate Imported Package
              </button>
              {designImportResult ? <pre>{JSON.stringify(designImportResult, null, 2)}</pre> : null}
            </article>
          </section>
        )}

        {activeTab === "council" && (
          <section className="content-grid">
            <article className="panel">
              <h3>Council Registry</h3>
              <p className="panel-copy">This runtime is bounded on purpose. Seats and specialists have typed scopes, explicit delegate lists, and clear unsupported capability flags.</p>
              <div className="entity-grid">
                {seatOptions.map((seat) => (
                  <article key={seat.key} className="entity">
                    <h4>{seat.name}</h4>
                    <p>{seat.description}</p>
                    <p className="meta">{seat.lens}</p>
                    <small>Delegates: {seat.allowedDelegates.join(", ")}</small>
                  </article>
                ))}
              </div>
              <div className="divider" />
              <CapabilityMatrix registry={agentRegistry} />
            </article>

            <article className="panel">
              <h3>Latest Council Run</h3>
              <p className="panel-copy">Recent runs recorded: {agentRuns.length}</p>
              {currentAgentRun ? (
                <>
                  <p><strong>Provider:</strong> {currentAgentRun.providerMode}</p>
                  <p>{currentAgentRun.summary}</p>
                  <ul className="line-list compact">
                    {currentAgentRun.delegationPlan.map((entry, index) => (
                      <li key={`${entry.from}-${entry.to}-${index}`}>
                        <strong>{entry.from}</strong> {"->"} <strong>{entry.to}</strong>: {entry.purpose}
                      </li>
                    ))}
                  </ul>
                  {currentAgentRun.warnings.length > 0 ? (
                    <div className="uncertainty-box">
                      <strong>Warnings</strong>
                      <p>{currentAgentRun.warnings.join(" ")}</p>
                    </div>
                  ) : null}
                  <AgentTree node={currentAgentRun.root} />
                </>
              ) : (
                <p>Run a council review after parsing a prompt to inspect bounded seat delegation and explicit capability coverage.</p>
              )}
            </article>
          </section>
        )}

        {activeTab === "jobs" && (
          <section className="content-grid">
            <article className="panel">
              <h3>Generation Jobs</h3>
              <label>
                Filter Jobs
                <input value={jobFilter} onChange={(event) => setJobFilter(event.target.value)} />
              </label>
              <ul className="line-list">
                {visibleJobs.map((job) => (
                  <li key={job.id}>
                    <button className="job-link" onClick={() => setCurrentJob(job)}>{job.spec.customerProfile.name}</button>
                    <span className={`job-status ${job.status}`}>{job.status}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="panel">
              <h3>Selected Job</h3>
              {currentJob ? (
                <>
                  <p><strong>{currentJob.spec.customerProfile.name}</strong></p>
                  <p>{currentJob.workspacePath ?? "Workspace pending."}</p>
                  <ul className="line-list compact">
                    {currentJob.verification.map((step) => (
                      <li key={step.step}>
                        <strong>{step.step}</strong> {step.status}
                      </li>
                    ))}
                  </ul>

                  <div className="divider" />
                  <h4>Downloads</h4>
                  <ul className="line-list compact">
                    {currentJob.artifacts.filter((artifact) => artifact.downloadable).map((artifact) => (
                      <li key={artifact.key}>
                        <a href={artifactDownloadUrl(currentJob, artifact)}>{artifact.label}</a>
                      </li>
                    ))}
                  </ul>

                  {currentJob.handoff ? (
                    <>
                      <div className="divider" />
                      <h4>Ready-To-Test Handoff</h4>
                      <ul className="line-list compact">
                        {currentJob.handoff.startupInstructions.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                      <div className="split-list">
                        <div>
                          <h4>Next Edits</h4>
                          <ul className="line-list compact">
                            {currentJob.handoff.nextRecommendedEdits.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4>Testing Checklist</h4>
                          <ul className="line-list compact">
                            {currentJob.handoff.testingChecklist.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : null}

                  <div className="divider" />
                  <pre>{JSON.stringify(currentJob.logs, null, 2)}</pre>
                </>
              ) : (
                <p>No job selected yet.</p>
              )}
            </article>
          </section>
        )}
      </main>
    </div>
  );
}
