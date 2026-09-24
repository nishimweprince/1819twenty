import { beforeEach, describe, expect, it, vi } from "vitest";

const { upsertMock, maybeSingleMock, updateMock, updateEqMock, fromMock } =
  vi.hoisted(() => {
    const upsertMock = vi.fn();
    const maybeSingleMock = vi.fn();
    const updateEqMock = vi.fn();
    const updateMock = vi.fn(() => ({
      eq: () => ({ eq: updateEqMock }),
    }));
    const fromMock = vi.fn(() => ({
      select: () => ({ eq: () => ({ maybeSingle: maybeSingleMock }) }),
      upsert: upsertMock,
      update: updateMock,
    }));
    return { upsertMock, maybeSingleMock, updateMock, updateEqMock, fromMock };
  });
vi.mock("@/lib/supabase-admin", () => ({
  getSupabaseAdmin: () => ({ from: fromMock }),
}));
import { saveSubscriber, unsubscribe } from "./repository";

const input = {
  email: "  Aline@Example.com ",
  source: "/",
  consentedAt: "2026-09-24T12:00:00.000Z",
  consentCopyVersion: "2026-09-18",
};

beforeEach(() => {
  vi.clearAllMocks();
  upsertMock.mockResolvedValue({ error: null });
  maybeSingleMock.mockResolvedValue({ data: null, error: null });
  updateEqMock.mockResolvedValue({ error: null });
});

describe("saveSubscriber", () => {
  it("upserts a lowercased, resubscribed row keyed on email", async () => {
    expect(await saveSubscriber(input)).toEqual({
      email: "aline@example.com",
      joined: true,
    });
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

  it("reports a returning subscriber as joined, a current one as not", async () => {
    maybeSingleMock.mockResolvedValue({
      data: { status: "unsubscribed" },
      error: null,
    });
    expect((await saveSubscriber(input)).joined).toBe(true);
    maybeSingleMock.mockResolvedValue({
      data: { status: "subscribed" },
      error: null,
    });
    expect((await saveSubscriber(input)).joined).toBe(false);
  });

  it("throws a user-facing message when the insert fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    upsertMock.mockResolvedValue({ error: { message: "boom" } });
    await expect(saveSubscriber(input)).rejects.toThrow(
      "We could not add you to the list. Try again shortly.",
    );
  });
});

describe("unsubscribe", () => {
  it("marks the subscribed row as unsubscribed", async () => {
    await unsubscribe("Aline@Example.com");
    expect(updateMock).toHaveBeenCalledWith({
      status: "unsubscribed",
      unsubscribed_at: expect.any(String),
    });
  });
});
