import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => {
    throw new Error("network must not be touched in the simulated flow");
  }),
}));

import { DesignerApplicationForm } from "./designer-application-form";

beforeEach(() => {
  pushMock.mockClear();
  // No provider credentials: the form must simulate the send.
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  // jsdom does not implement scrolling.
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

async function completeStepZero() {
  fireEvent.change(screen.getByLabelText(/Brand or designer name/i), {
    target: { value: "Test Brand" },
  });
  fireEvent.change(screen.getByLabelText(/Contact name/i), {
    target: { value: "Test Contact" },
  });
  fireEvent.change(screen.getByLabelText(/Email address/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/Phone or WhatsApp/i), {
    target: { value: "+250788000000" },
  });
  fireEvent.change(screen.getByLabelText(/Country and city/i), {
    target: { value: "Kigali, Rwanda" },
  });
  fireEvent.change(screen.getByLabelText(/Website or social handle/i), {
    target: { value: "@testbrand" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  await screen.findByRole("group", { name: "Your collection" });
}

async function completeStepOne() {
  fireEvent.click(screen.getByRole("combobox"));
  fireEvent.mouseDown(await screen.findByRole("option", { name: "Women's" }));
  fireEvent.change(screen.getByLabelText(/Available items or SKUs/i), {
    target: { value: "12" },
  });
  fireEvent.click(screen.getByLabelText(/wholesale pricing/i));
  fireEvent.click(screen.getByLabelText(/directly to customers/i));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  await screen.findByRole("group", { name: "Story and lookbook" });
}

async function completeStepTwo() {
  const file = new File(["lookbook"], "look.png", { type: "image/png" });
  const fileInput = document.querySelector(
    'input[type="file"]',
  ) as HTMLInputElement;
  fireEvent.change(fileInput, { target: { files: [file] } });
  fireEvent.change(screen.getByLabelText(/Brand story or description/i), {
    target: {
      value:
        "A maker story long enough to satisfy the forty character minimum.",
    },
  });
  fireEvent.click(screen.getByLabelText(/authorize Eighteen Nineteen Twenty/i));
  fireEvent.click(screen.getByRole("button", { name: "Continue" }));
  await screen.findByRole("group", { name: "Review your application" });
}

describe("DesignerApplicationForm without provider env", () => {
  it("simulates the send and flags the confirmation as simulated", async () => {
    render(<DesignerApplicationForm />);
    await screen.findByRole("group", { name: "Your brand" });

    await completeStepZero();
    await completeStepOne();
    await completeStepTwo();

    fireEvent.click(screen.getByRole("button", { name: "Send application" }));

    await waitFor(() => expect(pushMock).toHaveBeenCalledTimes(1));
    const destination = pushMock.mock.calls[0][0] as string;
    expect(destination).toMatch(
      /^\/designers\/apply\/received\?reference=SIM-[0-9A-F]{8}&simulated=1$/,
    );
  });
});
