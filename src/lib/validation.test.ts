import { describe, expect, it } from "vitest";
import { designerApplicationSchema, newsletterSchema, submitApplicationSchema, uploadRequestSchema } from "./validation";

const validApplication = {
  fullName: "Aline Example", brandName: "Kigali Studio", email: "aline@example.com",
  phoneWhatsapp: "+250 780 000 000", countryCity: "Kigali, Rwanda", socialHandles: "@kigalistudio", websiteUrl: "",
  categories: ["apparel", "accessories"], brandStory: "We create each collection with local cloth and a small team of makers.",
  yearsInBusiness: "3_5", madeBy: "small_team", madeWhere: "Kigali, Rwanda",
  sellsOnline: true, onlineChannels: "Our website and Instagram", monthlyCapacity: "20_50",
  wholesaleExportExperience: false, shippingCapability: "needs_support", lookbookUrl: "",
  whyJoin: "We want to introduce our work and our makers to a wider audience.",
  goals: ["global_reach", "community"], additionalNotes: "", eventInterest: "tell_me_more",
  privacyConsent: true, marketingConsent: false, consentedAt: "2026-09-22T12:00:00.000Z",
  consentCopyVersion: "2026-09-22", idempotencyKey: "550e8400-e29b-41d4-a716-446655440000",
  website: "", turnstileToken: "",
};

const submitBase = {
  draftToken: "a-valid-draft-token-with-enough-length",
  idempotencyKey: "550e8400-e29b-41d4-a716-446655440000",
};
const paths = Array.from({ length: 6 }, (_, index) => `550e8400-e29b-41d4-a716-446655440000/photo-${index}.jpg`);

describe("designerApplicationSchema", () => {
  it("accepts the original questionnaire", () => {
    expect(designerApplicationSchema.safeParse(validApplication).success).toBe(true);
  });
  it("requires a category and a goal", () => {
    expect(designerApplicationSchema.safeParse({ ...validApplication, categories: [] }).success).toBe(false);
    expect(designerApplicationSchema.safeParse({ ...validApplication, goals: [] }).success).toBe(false);
  });
  it("requires channels only when selling online", () => {
    expect(designerApplicationSchema.safeParse({ ...validApplication, onlineChannels: "" }).success).toBe(false);
    expect(designerApplicationSchema.safeParse({ ...validApplication, sellsOnline: false, onlineChannels: "" }).success).toBe(true);
  });
});

describe("photo submissions", () => {
  it("accepts 3 and 5 distinct paths and rejects 2, 6, or duplicates", () => {
    for (const count of [3, 5]) expect(submitApplicationSchema.safeParse({ ...submitBase, uploadPaths: paths.slice(0, count) }).success).toBe(true);
    for (const count of [2, 6]) expect(submitApplicationSchema.safeParse({ ...submitBase, uploadPaths: paths.slice(0, count) }).success).toBe(false);
    expect(submitApplicationSchema.safeParse({ ...submitBase, uploadPaths: [paths[0], paths[0], paths[1]] }).success).toBe(false);
  });
  it("accepts image uploads up to 20 MB and rejects PDFs", () => {
    const request = { draftToken: submitBase.draftToken, fileName: "work.jpg", fileType: "image/jpeg", fileSize: 20 * 1024 * 1024 };
    expect(uploadRequestSchema.safeParse(request).success).toBe(true);
    expect(uploadRequestSchema.safeParse({ ...request, fileSize: request.fileSize + 1 }).success).toBe(false);
    expect(uploadRequestSchema.safeParse({ ...request, fileType: "application/pdf" }).success).toBe(false);
  });
});

describe("newsletterSchema", () => {
  it("requires explicit consent and rejects honeypot content", () => {
    const input = { email: "reader@example.com", consent: true, consentedAt: "2026-09-18T12:00:00.000Z", consentCopyVersion: "2026-09-18", source: "/", website: "", turnstileToken: "" };
    expect(newsletterSchema.safeParse(input).success).toBe(true);
    expect(newsletterSchema.safeParse({ ...input, consent: false, website: "https://spam.invalid" }).success).toBe(false);
  });
});
