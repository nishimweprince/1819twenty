import { describe, expect, it } from "vitest";
import { createDraftToken, generateReference, verifyDraftToken } from "./security";

describe("application references", () => {
  it("generates a non-sequential public reference", () => {
    const reference = generateReference(new Date("2026-09-18T00:00:00Z"));
    expect(reference).toMatch(/^ENT-2026-[A-Z2-9]{6}$/);
  });
});

describe("draft tokens", () => {
  it("accepts the intended application and rejects another", () => {
    const token = createDraftToken("application-a", "maker@example.com");
    expect(verifyDraftToken(token, "application-a")).toBe(true);
    expect(verifyDraftToken(token, "application-b")).toBe(false);
  });

  it("rejects tampering", () => {
    const token = createDraftToken("application-a", "maker@example.com");
    expect(verifyDraftToken(`${token}x`, "application-a")).toBe(false);
  });
});
