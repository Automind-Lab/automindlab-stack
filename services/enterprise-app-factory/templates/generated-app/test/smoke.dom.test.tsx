// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../src/App.js";

test("smoke renders key generated routes", () => {
  render(<App />);
  expect(screen.getByText(/Generated Runtime Kit/i)).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Runtime Kit/i })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /Compiler and Eval/i })).toBeInTheDocument();
});
