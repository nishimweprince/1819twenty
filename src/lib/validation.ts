import { z } from "zod";
import { isPhoneValid } from "./phone";

export const applicationCategories = [
  "apparel",
  "shoes",
  "accessories",
  "home_decor",
  "art_craft",
] as const;
export const categoryLabels: Record<
  (typeof applicationCategories)[number],
  string
> = {
  apparel: "Apparel",
  shoes: "Shoes",
  accessories: "Accessories",
  home_decor: "Home décor",
  art_craft: "Art & craft",
};
export const businessAges = [
  "under_1",
  "1_3",
  "3_5",
  "5_10",
  "10_plus",
] as const;
export const businessAgeLabels: Record<(typeof businessAges)[number], string> =
  {
    under_1: "Less than 1 year",
    "1_3": "1–3 years",
    "3_5": "3–5 years",
    "5_10": "5–10 years",
    "10_plus": "10+ years",
  };
export const makerTypes = [
  "myself",
  "small_team",
  "artisan_collective",
  "manufacturing_partner",
  "other",
] as const;
export const makerLabels: Record<(typeof makerTypes)[number], string> = {
  myself: "Myself",
  small_team: "A small team",
  artisan_collective: "An artisan collective",
  manufacturing_partner: "A manufacturing partner",
  other: "Other",
};
export const capacityRanges = [
  "under_20",
  "20_50",
  "50_100",
  "100_250",
  "250_plus",
] as const;
export const capacityLabels: Record<(typeof capacityRanges)[number], string> = {
  under_20: "Fewer than 20 pieces",
  "20_50": "20–50 pieces",
  "50_100": "50–100 pieces",
  "100_250": "100–250 pieces",
  "250_plus": "More than 250 pieces",
};
export const shippingCapabilities = ["international", "needs_support"] as const;
export const shippingLabels: Record<
  (typeof shippingCapabilities)[number],
  string
> = {
  international: "I can ship internationally",
  needs_support: "I'd need support with logistics",
};
export const platformGoals = [
  "global_reach",
  "marketing_support",
  "brand_visibility",
  "community",
] as const;
export const goalLabels: Record<(typeof platformGoals)[number], string> = {
  global_reach: "Global reach",
  marketing_support: "Marketing support",
  brand_visibility: "Brand visibility",
  community: "Community",
};
export const eventInterestOptions = ["yes", "no", "tell_me_more"] as const;
export const eventInterestLabels: Record<
  (typeof eventInterestOptions)[number],
  string
> = {
  yes: "Yes",
  no: "No",
  tell_me_more: "Tell me more",
};
export const allowedUploadTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

const optionalUrl = z.union([
  z.url("Enter a valid URL, including https://."),
  z.literal(""),
]);

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
  fullName: z.string().trim().min(2, "Enter your full name.").max(120),
  brandName: z
    .string()
    .trim()
    .min(2, "Enter your brand or business name.")
    .max(120),
  email: z.email("Enter a valid email address.").max(254),
  phoneWhatsapp: z
    .string()
    .trim()
    .min(1, "Enter a phone number.")
    .max(40)
    .refine(
      isPhoneValid,
      "Enter a valid phone number, including the country code.",
    ),
  countryCity: z
    .string()
    .trim()
    .min(3, "Enter your city and country.")
    .max(160),
  socialHandles: z.string().trim().min(2, "Enter a social handle.").max(300),
  websiteUrl: optionalUrl,
  categories: z
    .array(z.enum(applicationCategories))
    .min(1, "Choose at least one category."),
  brandStory: z
    .string()
    .trim()
    .min(40, "Tell us more about your story (at least 40 characters).")
    .max(5000),
  yearsInBusiness: z.enum(businessAges, {
    error: "Choose how long you have been in business.",
  }),
  madeBy: z.enum(makerTypes, { error: "Choose who makes your pieces." }),
  madeWhere: z
    .string()
    .trim()
    .min(2, "Tell us where your pieces are made.")
    .max(300),
  sellsOnline: z.boolean(),
  onlineChannels: z.string().trim().max(500),
  monthlyCapacity: z.enum(capacityRanges, {
    error: "Choose your monthly production capacity.",
  }),
  wholesaleExportExperience: z.boolean(),
  shippingCapability: z.enum(shippingCapabilities, {
    error: "Choose a shipping option.",
  }),
  lookbookUrl: optionalUrl,
  whyJoin: z
    .string()
    .trim()
    .min(40, "Tell us why you want to join (at least 40 characters).")
    .max(5000),
  goals: z.array(z.enum(platformGoals)).min(1, "Choose at least one goal."),
  additionalNotes: z.string().trim().max(3000),
  eventInterest: z.enum(eventInterestOptions, {
    error: "Choose an event option.",
  }),
  privacyConsent: z.literal(true, {
    error: "Consent is required to review your application.",
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
    if (input.sellsOnline && !input.onlineChannels)
      context.addIssue({
        code: "custom",
        path: ["onlineChannels"],
        message: "Tell us where you sell online.",
      });
  });

export const uploadRequestSchema = z.object({
  draftToken: z.string().min(20).max(4096),
  fileName: z.string().trim().min(1).max(180),
  fileType: z.enum(allowedUploadTypes),
  fileSize: z.number().int().positive().max(MAX_UPLOAD_BYTES),
});

export const submitApplicationSchema = z.object({
  draftToken: z.string().min(20).max(4096),
  uploadPaths: z
    .array(z.string().min(5).max(600))
    .min(3)
    .max(5)
    .refine(
      (paths) => new Set(paths).size === paths.length,
      "Choose distinct photos.",
    ),
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
