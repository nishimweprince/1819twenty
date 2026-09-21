import { describe, expect, it } from "vitest";
import { isStorageConfigured, simulatedReference } from "./submission";

describe("isStorageConfigured", () => {
  it("is false when either client storage variable is missing", () => {
    expect(isStorageConfigured({})).toBe(false);
    expect(isStorageConfigured({ url: "https://example.supabase.co" })).toBe(false);
    expect(isStorageConfigured({ anonKey: "anon-key" })).toBe(false);
    expect(isStorageConfigured({ url: "", anonKey: "anon-key" })).toBe(false);
  });

  it("is true when both client storage variables are present", () => {
    expect(isStorageConfigured({ url: "https://example.supabase.co", anonKey: "anon-key" })).toBe(true);
  });
});

describe("simulatedReference", () => {
  it("marks the reference as simulated and derives it from the idempotency key", () => {
    expect(simulatedReference("12345678-90ab-cdef-1234-567890abcdef")).toBe("SIM-12345678");
  });

  it("is deterministic for the same key", () => {
    expect(simulatedReference("abcdef01-2345-6789-abcd-ef0123456789")).toBe(
      simulatedReference("abcdef01-2345-6789-abcd-ef0123456789"),
    );
  });
});
