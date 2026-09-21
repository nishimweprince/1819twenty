import { describe, expect, it } from "vitest";
import { designerApplicationSchema, newsletterSchema } from "./validation";

const validApplication = {
  brandName: "Kigali Studio",
  contactName: "Aline Example",
  email: "aline@example.com",
  phoneWhatsapp: "+250 780 000 000",
  countryCity: "Kigali, Rwanda",
  websiteSocial: "@kigalistudio",
  productCategory: "women",
  skuCount: 10,
  includesApparel: true,
  sizeRange: "XS, S, M, L, XL",
  confirmsWholesale: true,
  confirmsDirectShipping: true,
  brandStory: "We build each collection with local cloth and a small team of makers.",
  additionalNotes: "",
  privacyConsent: true,
  marketingConsent: false,
  consentedAt: "2026-09-18T12:00:00.000Z",
  consentCopyVersion: "2026-09-18",
  idempotencyKey: "550e8400-e29b-41d4-a716-446655440000",
  website: "",
  turnstileToken: "",
} as const;

describe("designerApplicationSchema", () => {
  it("accepts a complete qualifying application", () => {
    expect(designerApplicationSchema.safeParse(validApplication).success).toBe(true);
  });

  it("requires ten available items", () => {
    const result = designerApplicationSchema.safeParse({ ...validApplication, skuCount: 9 });
    expect(result.success).toBe(false);
  });

  it("requires five sizes when apparel is included", () => {
    const result = designerApplicationSchema.safeParse({ ...validApplication, sizeRange: "S, M, L" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === "sizeRange")).toBe(true);
  });

  it("allows a home collection without sizes", () => {
    const result = designerApplicationSchema.safeParse({ ...validApplication, productCategory: "home", includesApparel: false, sizeRange: "" });
    expect(result.success).toBe(true);
  });
});

describe("newsletterSchema", () => {
  it("requires explicit consent and rejects honeypot content", () => {
    expect(newsletterSchema.safeParse({ email: "reader@example.com", consent: true, consentedAt: "2026-09-18T12:00:00.000Z", consentCopyVersion: "2026-09-18", source: "/", website: "", turnstileToken: "" }).success).toBe(true);
    expect(newsletterSchema.safeParse({ email: "reader@example.com", consent: false, consentedAt: "2026-09-18T12:00:00.000Z", consentCopyVersion: "2026-09-18", source: "/", website: "https://spam.invalid", turnstileToken: "" }).success).toBe(false);
  });
});
