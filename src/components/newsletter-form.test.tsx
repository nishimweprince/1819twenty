import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NewsletterForm } from "./newsletter-form";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("NewsletterForm error display", () => {
  it("hero: shows a failed subscription message in red", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        json: async () => ({
          ok: false,
          message: "Too many attempts. Try again tomorrow.",
        }),
      })),
    );
    render(<NewsletterForm />);
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Join our community" }));
    const status = await screen.findByText(
      "Too many attempts. Try again tomorrow.",
    );
    expect(status.closest("p")).toHaveClass("text-danger");
  });

  it("hero: keeps the success confirmation in the normal color", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ ok: true }),
      })),
    );
    render(<NewsletterForm />);
    fireEvent.change(screen.getByPlaceholderText("Email address"), {
      target: { value: "test@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Join our community" }));
    const status = await screen.findByText(
      "Check your inbox to confirm your subscription.",
    );
    expect(status.closest("p")).not.toHaveClass("text-danger");
  });

  it("footer: shows validation errors in red", async () => {
    render(<NewsletterForm variant="footer" />);
    fireEvent.click(screen.getByRole("button", { name: "Join our community" }));
    const status = await screen.findByText("Enter a valid email address.");
    const paragraph = status.closest("p");
    expect(paragraph).not.toHaveClass("text-paper/82");
    expect(paragraph?.className).toMatch(/text-\[#d1a095\]/);
  });
});
