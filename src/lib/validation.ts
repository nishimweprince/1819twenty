import { z } from "zod";

export const productCategories = [
  "women",
  "men",
  "kids",
  "home",
  "multiple",
] as const;
export const allowedUploadTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

export function sizeCount(value: string) {
  return value
    .split(/[,;/\n]+/)
    .map((item) => item.trim())
    .filter(Boolean).length;
}

export const newsletterSchema = z.object({
  email: z.email("Enter a valid email address."),
  consent: z.literal(true, { error: "Consent is required." }),
  consentedAt: z.iso.datetime(),
  consentCopyVersion: z.string().min(1).max(40),
  source: z.string().min(1).max(200),
  website: z.string().max(0, "Spam protection failed."),
  turnstileToken: z.string().max(4096).optional().default(""),
});

export const designerApplicationBaseSchema = z.object({
  brandName: z.string().trim().min(2).max(120),
  contactName: z.string().trim().min(2).max(120),
  email: z.email().max(254),
  phoneWhatsapp: z.string().trim().min(5).max(80),
  countryCity: z.string().trim().min(3).max(160),
  websiteSocial: z.string().trim().min(2).max(300),
  productCategory: z.enum(productCategories),
  skuCount: z.number().int().min(10).max(100000),
  includesApparel: z.boolean(),
  sizeRange: z.string().trim().max(500),
  confirmsWholesale: z.literal(true, {
    error: "Wholesale pricing confirmation is required.",
  }),
  confirmsDirectShipping: z.literal(true, {
    error: "Direct shipping confirmation is required.",
  }),
  brandStory: z.string().trim().min(40).max(5000),
  additionalNotes: z.string().trim().max(3000),
  privacyConsent: z.literal(true, {
    error: "Application consent is required.",
  }),
  marketingConsent: z.boolean(),
  consentedAt: z.iso.datetime(),
  consentCopyVersion: z.string().min(1).max(40),
  idempotencyKey: z.uuid(),
  website: z.string().max(0, "Spam protection failed."),
  turnstileToken: z.string().max(4096).optional().default(""),
});

export const designerApplicationSchema =
  designerApplicationBaseSchema.superRefine((input, context) => {
    if (input.includesApparel && sizeCount(input.sizeRange) < 5) {
      context.addIssue({
        code: "custom",
        path: ["sizeRange"],
        message: "List at least five apparel sizes.",
      });
    }
  });

export const uploadRequestSchema = z.object({
  draftToken: z.string().min(20).max(4096),
  fileName: z.string().trim().min(1).max(180),
  fileType: z.enum(allowedUploadTypes),
  fileSize: z.number().int().positive().max(MAX_UPLOAD_BYTES),
});

export const submitApplicationSchema = z.object({
  draftToken: z.string().min(20).max(4096),
  uploadPath: z.string().min(5).max(600),
  idempotencyKey: z.uuid(),
});

export type NewsletterSignupInput = z.infer<typeof newsletterSchema>;
export type DesignerApplicationInput = z.infer<
  typeof designerApplicationSchema
>;
export type DesignerApplicationStatus =
  "draft" | "submitted" | "under_review" | "approved" | "declined";
export type UploadRequest = z.infer<typeof uploadRequestSchema>;

export function zodFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>;
}
