// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../src/App.js";

test("renders generated app shell", () => {
  render(<App />);
  expect(screen.getByText("Northstar Medical Logistics")).toBeInTheDocument();
});
