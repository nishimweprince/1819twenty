import { beforeEach, describe, expect, it, vi } from "vitest";

const { upsertMock, fromMock } = vi.hoisted(() => {
  const upsertMock = vi.fn();
  return { upsertMock, fromMock: vi.fn(() => ({ upsert: upsertMock })) };
});
vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({ from: fromMock }),
}));
import { saveSubscriber } from "./repository";

const input = {
  email: "  Aline@Example.com ",
  source: "/",
  consentedAt: "2026-09-24T12:00:00.000Z",
  consentCopyVersion: "2026-09-18",
};

beforeEach(() => {
  upsertMock.mockReset();
  fromMock.mockClear();
  upsertMock.mockResolvedValue({ error: null });
});

describe("saveSubscriber", () => {
  it("upserts a lowercased, resubscribed row keyed on email", async () => {
    await saveSubscriber(input);
    expect(fromMock).toHaveBeenCalledWith("newsletter_subscribers");
    expect(upsertMock).toHaveBeenCalledWith(
      {
        email: "aline@example.com",
        status: "subscribed",
        source: "/",
        consented_at: input.consentedAt,
        consent_copy_version: "2026-09-18",
        unsubscribed_at: null,
      },
      { onConflict: "email" },
    );
  });

  it("throws a user-facing message when the insert fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    upsertMock.mockResolvedValue({ error: { message: "boom" } });
    await expect(saveSubscriber(input)).rejects.toThrow(
      "We could not add you to the list. Try again shortly.",
    );
  });
});
