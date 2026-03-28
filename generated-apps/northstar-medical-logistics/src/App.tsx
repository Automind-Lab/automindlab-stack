import { useMemo, useState, type ReactElement } from "react";
import { DataTable } from "./components/DataTable.js";
import { StatGrid } from "./components/StatGrid.js";
import { WorkflowCard } from "./components/WorkflowCard.js";
import { appSpec } from "./generated/app-spec.js";

function buildSampleRows(): Array<Record<string, string>> {
  return appSpec.businessEntities.slice(0, 3).map((entity, index) => {
    const row: Record<string, string> = {};
    entity.fields.forEach((field) => {
      row[field.label] = `${field.label} ${index + 1}`;
    });
    return row;
  });
}

export default function App(): ReactElement {
  const [activeSection, setActiveSection] = useState(appSpec.navigation[0]?.key ?? "dashboard");

  const stats = useMemo(
    () => [
      { label: "Entities", value: String(appSpec.businessEntities.length) },
      { label: "Workflows", value: String(appSpec.coreWorkflows.length) },
      { label: "Approval Gates", value: String(appSpec.approvalGates.length) },
      { label: "Integrations", value: String(appSpec.integrations.length) },
    ],
    [],
  );

  return (
    <div className="app-shell">
      <aside className="side-nav">
        <p className="eyebrow">Generated Workspace</p>
        <h1>{appSpec.customerProfile.name}</h1>
        <p>{appSpec.summary}</p>
        <nav>
          {appSpec.navigation.map((item) => (
            <button key={item.key} className={activeSection === item.key ? "nav-link active" : "nav-link"} onClick={() => setActiveSection(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main-column">
        <header className="hero">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Operational workspace built from reusable primitives.</h2>
          </div>
          <StatGrid items={stats} />
        </header>

        {activeSection === "dashboard" && (
          <section className="panel-grid">
            <section className="panel">
              <h3>Workflow Highlights</h3>
              <div className="stack">
                {appSpec.coreWorkflows.map((workflow) => <WorkflowCard key={workflow.key} workflow={workflow} />)}
              </div>
            </section>
            <section className="panel">
              <h3>Reports</h3>
              <ul className="stack plain">
                {appSpec.reportingViews.map((report) => (
                  <li key={report.key}>
                    <strong>{report.name}</strong>
                    <span>{report.purpose}</span>
                  </li>
                ))}
              </ul>
            </section>
          </section>
        )}

        {activeSection === "entities" && (
          <section className="panel">
            <h3>Entity Screens</h3>
            {appSpec.businessEntities.map((entity) => (
              <article key={entity.key} className="entity-block">
                <h4>{entity.label}</h4>
                <p>{entity.description}</p>
                <p className="meta">{entity.operations.join(" / ")}</p>
                <DataTable rows={buildSampleRows()} columns={entity.fields.map((field) => field.label)} />
              </article>
            ))}
          </section>
        )}

        {activeSection === "workflows" && (
          <section className="panel">
            <h3>Workflow and Task Views</h3>
            <div className="stack">
              {appSpec.coreWorkflows.map((workflow) => <WorkflowCard key={workflow.key} workflow={workflow} />)}
            </div>
          </section>
        )}

        {activeSection === "approvals" && (
          <section className="panel">
            <h3>Approvals</h3>
            <ul className="stack plain">
              {appSpec.approvalGates.map((gate) => (
                <li key={gate.key}>
                  <strong>{gate.name}</strong>
                  <span>{gate.description}</span>
                  <small>{gate.requiredRoles.join(", ")}</small>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === "audit" && (
          <section className="panel">
            <h3>Audit View</h3>
            <p>{appSpec.blueprint.persistenceOwnership}</p>
            <ul className="stack plain">
              {appSpec.approvalGates.map((gate) => (
                <li key={gate.key}>
                  <strong>{gate.name}</strong>
                  <span>{gate.trigger}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === "roles" && (
          <section className="panel-grid">
            <section className="panel">
              <h3>Roles</h3>
              <ul className="stack plain">
                {appSpec.userRoles.map((role) => (
                  <li key={role.key}>
                    <strong>{role.name}</strong>
                    <span>{role.description}</span>
                    <small>{role.visibleModules.join(", ")}</small>
                  </li>
                ))}
              </ul>
            </section>
            <section className="panel">
              <h3>Notifications</h3>
              <ul className="stack plain">
                {appSpec.notificationRules.map((rule) => (
                  <li key={rule.key}>
                    <strong>{rule.name}</strong>
                    <span>{rule.trigger}</span>
                    <small>{rule.channel}</small>
                  </li>
                ))}
              </ul>
            </section>
          </section>
        )}

        {activeSection === "integrations" && (
          <section className="panel">
            <h3>Integration Panel</h3>
            <ul className="stack plain">
              {appSpec.integrations.map((integration) => (
                <li key={integration.key}>
                  <strong>{integration.name}</strong>
                  <span>{integration.notes}</span>
                  <small>{integration.mode} / {integration.direction}</small>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === "notifications" && (
          <section className="panel">
            <h3>Notification Rules</h3>
            <ul className="stack plain">
              {appSpec.notificationRules.map((rule) => (
                <li key={rule.key}>
                  <strong>{rule.name}</strong>
                  <span>{rule.trigger}</span>
                  <small>{rule.escalation}</small>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === "reports" && (
          <section className="panel">
            <h3>Reports</h3>
            <ul className="stack plain">
              {appSpec.reportingViews.map((report) => (
                <li key={report.key}>
                  <strong>{report.name}</strong>
                  <span>{report.purpose}</span>
                  <small>{report.cadence}</small>
                </li>
              ))}
            </ul>
          </section>
        )}

        {activeSection === "settings" && (
          <section className="panel">
            <h3>Settings</h3>
            <ul className="stack plain">
              {appSpec.settingsSections.map((section) => (
                <li key={section.key}>
                  <strong>{section.name}</strong>
                  <span>{section.purpose}</span>
                  <small>{section.owners.join(", ")}</small>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
