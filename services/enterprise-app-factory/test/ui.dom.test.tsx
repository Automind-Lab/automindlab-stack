// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import App from "../src/client/App.js";
import { NORTHSTAR_MEDICAL_LOGISTICS_PROMPT } from "../src/server/sample.js";

test("operator console loads default prompt", async () => {
  vi.stubGlobal("fetch", vi.fn(async (input: string | URL) => {
    const url = input.toString();
    if (url.endsWith("/api/factory/default-prompt")) {
      return new Response(JSON.stringify(NORTHSTAR_MEDICAL_LOGISTICS_PROMPT), { status: 200 });
    }
    if (url.endsWith("/api/factory/jobs")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    if (url.endsWith("/api/factory/agent-registry")) {
      return new Response(JSON.stringify({
        providerModes: ["deterministic"],
        host: { key: "automind-host", name: "AutoMindLab Host", type: "host", description: "", lens: "", capabilities: [], allowedDelegates: [], maxDelegationDepth: 3, boundaries: [] },
        agents: [
          { key: "tesla", name: "Nikola Tesla", type: "council-seat", description: "Systems review", lens: "Systems", capabilities: [], allowedDelegates: [], maxDelegationDepth: 2, boundaries: [] },
        ],
        capabilityMatrix: [],
      }), { status: 200 });
    }
    if (url.endsWith("/api/factory/agent-runs")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    if (url.endsWith("/api/factory/module-registry")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    if (url.endsWith("/api/factory/domain-packs")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    if (url.endsWith("/api/factory/adapters")) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    throw new Error(`Unexpected fetch: ${url}`);
  }));

  render(<App />);

  await waitFor(() => {
    expect(screen.getByDisplayValue("Northstar Medical Logistics")).toBeInTheDocument();
  });
  expect(screen.getByText("Enterprise App Factory")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /compile spec/i })).toBeInTheDocument();
  expect(screen.getByText(/Registry Snapshot/i)).toBeInTheDocument();
});
