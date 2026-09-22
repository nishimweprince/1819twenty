import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: pushMock }) }));
vi.mock("@supabase/supabase-js", () => ({ createClient: vi.fn(() => { throw new Error("network must not be touched in the simulated flow"); }) }));
import { DesignerApplicationForm } from "./designer-application-form";

beforeEach(() => {
  pushMock.mockClear();
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  window.scrollTo = vi.fn();
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

async function continueTo(name: string) {
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  await screen.findByRole("group", { name });
}

async function fillThroughReview() {
  render(<DesignerApplicationForm />);
  await screen.findByRole("group", { name: "Contact & brand" });
  fireEvent.change(screen.getByLabelText(/^Full name/i), { target: { value: "Aline Example" } });
  fireEvent.change(screen.getByLabelText(/^Brand\/business name/i), { target: { value: "Kigali Studio" } });
  fireEvent.change(screen.getByLabelText(/^Email address/i), { target: { value: "aline@example.com" } });
  fireEvent.change(screen.getByLabelText(/^Phone number/i), { target: { value: "+250780000000" } });
  fireEvent.change(screen.getByLabelText(/^Country\/city based in/i), { target: { value: "Kigali, Rwanda" } });
  fireEvent.change(screen.getByLabelText(/^Instagram\/social handles/i), { target: { value: "@kigalistudio" } });
  await continueTo("About the brand");

  fireEvent.click(screen.getByLabelText("Apparel"));
  fireEvent.click(screen.getByLabelText("Accessories"));
  fireEvent.change(screen.getByLabelText(/^9\. Tell us about/i), { target: { value: "We create each collection with local cloth and a small team of makers." } });
  fireEvent.change(screen.getByLabelText(/^10\. How long/i), { target: { value: "3_5" } });
  fireEvent.change(screen.getByLabelText(/^11\. Who/i), { target: { value: "small_team" } });
  fireEvent.change(screen.getByLabelText(/^11\. Where/i), { target: { value: "Kigali, Rwanda" } });
  await continueTo("Production & fulfillment");

  fireEvent.click(within(screen.getByRole("group", { name: /12\. Do you currently sell online/i })).getByLabelText("Yes"));
  fireEvent.change(screen.getByLabelText(/^12\. If so/i), { target: { value: "Instagram" } });
  fireEvent.change(screen.getByLabelText(/^13\. What's/i), { target: { value: "20_50" } });
  fireEvent.click(within(screen.getByRole("group", { name: /14\. Do you have existing/i })).getByLabelText("No"));
  fireEvent.change(screen.getByLabelText(/^15\. Can you ship/i), { target: { value: "needs_support" } });
  await continueTo("Portfolio");

  const files = [1, 2, 3].map((index) => new File(["photo"], `work-${index}.png`, { type: "image/png" }));
  fireEvent.change(screen.getByLabelText(/^16\. Upload/i), { target: { files } });
  expect(screen.getByRole("list", { name: "Selected photos" }).children).toHaveLength(3);
  await continueTo("Fit & goals");

  fireEvent.change(screen.getByLabelText(/^18\. Why/i), { target: { value: "We want to introduce our work and our makers to a wider audience." } });
  fireEvent.click(screen.getByLabelText("Global reach"));
  fireEvent.change(screen.getByLabelText(/^20\. Anything/i), { target: { value: "" } });
  fireEvent.click(screen.getByLabelText("Tell me more"));
  fireEvent.click(screen.getByLabelText(/I authorize Eighteen/i));
  await continueTo("Review your application");
  expect(screen.getByText("work-1.png, work-2.png, work-3.png")).toBeVisible();
}

describe("DesignerApplicationForm without provider env", () => {
  it("walks all six steps and simulates submission", async () => {
    await fillThroughReview();
    fireEvent.click(screen.getByRole("button", { name: "Send application" }));
    await waitFor(() => expect(pushMock).toHaveBeenCalledTimes(1));
    expect(pushMock.mock.calls[0][0]).toMatch(/^\/designers\/apply\/received\?reference=SIM-[0-9A-F]{8}&simulated=1$/);
  });
  it("shows sending progress and disables duplicate submission", async () => {
    await fillThroughReview();
    fireEvent.click(screen.getByRole("button", { name: "Send application" }));
    await screen.findByRole("status");
    expect(screen.getByRole("status")).toHaveTextContent("Saving your application");
    expect(screen.getByRole("button", { name: "Sending" })).toBeDisabled();
  });
});
