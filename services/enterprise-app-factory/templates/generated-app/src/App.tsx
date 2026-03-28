import { useState, type ReactElement } from "react";
import { DataTable } from "./components/DataTable.js";
import { StatGrid } from "./components/StatGrid.js";
import { WorkflowCard } from "./components/WorkflowCard.js";
import { appSpec } from "./generated/app-spec.js";
import { compilerReport } from "./generated/compiler-report.js";
import { evalSuite } from "./generated/eval-suite.js";
import { runtimeKit } from "./generated/runtime-kit.js";

function buildSampleRows(columns: string[]): Array<Record<string, string>> {
  return Array.from({ length: 3 }, (_, index) =>
    columns.reduce<Record<string, string>>((row, column) => {
      row[column] = `${column} ${index + 1}`;
      return row;
    }, {}),
  );
}

function renderWidget(kind: string): ReactElement {
  switch (kind) {
    case "workflow-list":
      return <div className="stack">{appSpec.coreWorkflows.map((workflow) => <WorkflowCard key={workflow.key} workflow={workflow} />)}</div>;
    case "entity-table":
      return <div className="stack">{appSpec.businessEntities.map((entity) => <article key={entity.key} className="entity-block"><h4>{entity.label}</h4><p>{entity.description}</p><DataTable rows={buildSampleRows(entity.fields.map((field) => field.label))} columns={entity.fields.map((field) => field.label)} /></article>)}</div>;
    case "approval-list":
      return <ul className="stack plain">{appSpec.approvalGates.map((gate) => <li key={gate.key}><strong>{gate.name}</strong><span>{gate.description}</span><small>{gate.requiredRoles.join(", ")}</small></li>)}</ul>;
    case "audit-feed":
      return <p>{appSpec.blueprint.persistenceOwnership}</p>;
    case "role-list":
      return <ul className="stack plain">{appSpec.userRoles.map((role) => <li key={role.key}><strong>{role.name}</strong><span>{role.description}</span><small>{role.visibleModules.join(", ")}</small></li>)}</ul>;
    case "integration-list":
      return <ul className="stack plain">{appSpec.integrations.map((integration) => <li key={integration.key}><strong>{integration.name}</strong><span>{integration.notes}</span><small>{integration.mode} / {integration.direction}</small></li>)}</ul>;
    case "notification-list":
      return <ul className="stack plain">{appSpec.notificationRules.map((rule) => <li key={rule.key}><strong>{rule.name}</strong><span>{rule.trigger}</span><small>{rule.escalation}</small></li>)}</ul>;
    case "report-list":
      return <ul className="stack plain">{appSpec.reportingViews.map((report) => <li key={report.key}><strong>{report.name}</strong><span>{report.purpose}</span><small>{report.cadence}</small></li>)}</ul>;
    case "settings-list":
      return <ul className="stack plain">{appSpec.settingsSections.map((section) => <li key={section.key}><strong>{section.name}</strong><span>{section.purpose}</span><small>{section.owners.join(", ")}</small></li>)}</ul>;
    default:
      return <p>Replace this generated placeholder with live data after adapter and persistence wiring is complete.</p>;
  }
}

export default function App(): ReactElement {
  const [activePageKey, setActivePageKey] = useState(runtimeKit.shell.homePageKey ?? runtimeKit.pages[0]?.key ?? "dashboard");
  const activePage = runtimeKit.pages.find((page) => page.key === activePageKey) ?? runtimeKit.pages[0];
  const adapterBindings = appSpec.adapterBindings ?? [];
  const stats = [
    { label: "Entities", value: String(appSpec.businessEntities.length) },
    { label: "Workflows", value: String(appSpec.coreWorkflows.length) },
    { label: "Modules", value: String(runtimeKit.pages.length) },
    { label: "Adapters", value: String(adapterBindings.length) },
    { label: "Eval Score", value: String(evalSuite.score) },
  ];

  return (
    <div className="app-shell">
      <aside className="side-nav">
        <p className="eyebrow">Generated Runtime Kit</p>
        <h1>{appSpec.customerProfile.name}</h1>
        <p>{appSpec.summary}</p>
        <nav>
          {runtimeKit.pages.map((page) => (
            <button key={page.key} className={activePageKey === page.key ? "nav-link active" : "nav-link"} onClick={() => setActivePageKey(page.key)}>
              {page.title}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-column">
        <header className="hero">
          <div>
            <p className="eyebrow">Compiler Output</p>
            <h2>{activePage?.title ?? "Generated page"}</h2>
            <p>{activePage?.summary ?? runtimeKit.shell.tenantBanner}</p>
          </div>
          <StatGrid items={stats} />
        </header>

        <section className="panel-grid">
          <section className="panel">
            <h3>Runtime Kit</h3>
            <p>{runtimeKit.shell.tenantBanner}</p>
            <p>{runtimeKit.shell.approvalBanner}</p>
            <ul className="stack plain">
              {runtimeKit.editableFiles.map((file) => (
                <li key={file.path}>
                  <strong>{file.label}</strong>
                  <span>{file.path}</span>
                  <small>{file.purpose}</small>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h3>Compiler and Eval</h3>
            <ul className="stack plain">
              <li><strong>Compiler</strong><span>{compilerReport.compilerVersion}</span></li>
              <li><strong>Domain Packs</strong><span>{compilerReport.selectedDomainPackKeys.join(", ")}</span></li>
              <li><strong>Adapters</strong><span>{compilerReport.selectedAdapterKeys.join(", ")}</span></li>
              <li><strong>Eval</strong><span>{evalSuite.summary}</span></li>
            </ul>
          </section>
        </section>

        <section className="panel">
          <h3>{activePage?.title ?? "Generated Page"}</h3>
          {activePage ? activePage.widgets.map((widget) => (
            <article key={widget.key} className="entity-block">
              <h4>{widget.title}</h4>
              <p>{widget.description}</p>
              {renderWidget(widget.kind)}
            </article>
          )) : <p>No page selected yet.</p>}
        </section>
      </main>
    </div>
  );
}
