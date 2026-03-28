// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../src/App.js";

test("smoke renders key generated routes", () => {
  render(<App />);
  expect(screen.getByText("Operational workspace built from reusable primitives.")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /workflow highlights/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /reports/i })).toBeInTheDocument();
});
