import "server-only";
import { DesignerApplicationInput } from "@/lib/validation";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { generateReference } from "@/lib/security";

export type DesignerApplicationRecord = {
  id: string;
  reference: string;
  status: "draft" | "submitted" | "under_review" | "approved" | "declined";
  brand_name: string;
  contact_name: string;
  email: string;
  phone_whatsapp: string;
  country_city: string;
  website_social: string;
  product_category: string;
  sku_count: number;
  includes_apparel: boolean;
  size_range: string | null;
  confirms_wholesale: boolean;
  confirms_direct_shipping: boolean;
  brand_story: string;
  additional_notes: string | null;
  upload_path: string | null;
  privacy_consent_at: string;
  consent_copy_version: string;
  marketing_consent: boolean;
  idempotency_key: string;
  submitted_at: string | null;
  receipt_email_id: string | null;
  receipt_email_status: string;
  internal_email_id: string | null;
  internal_email_status: string;
  created_at: string;
};

function requireSupabase() {
  const client = getSupabaseAdmin();
  if (!client) throw new Error("Application storage is not configured.");
  return client;
}

export async function createApplicationDraft(input: DesignerApplicationInput): Promise<DesignerApplicationRecord> {
  const supabase = requireSupabase();
  const row = {
    reference: generateReference(),
    status: "draft",
    brand_name: input.brandName,
    contact_name: input.contactName,
    email: input.email.toLowerCase(),
    phone_whatsapp: input.phoneWhatsapp,
    country_city: input.countryCity,
    website_social: input.websiteSocial,
    product_category: input.productCategory,
    sku_count: input.skuCount,
    includes_apparel: input.includesApparel,
    size_range: input.includesApparel ? input.sizeRange : null,
    confirms_wholesale: input.confirmsWholesale,
    confirms_direct_shipping: input.confirmsDirectShipping,
    brand_story: input.brandStory,
    additional_notes: input.additionalNotes || null,
    privacy_consent_at: input.consentedAt,
    consent_copy_version: input.consentCopyVersion,
    marketing_consent: input.marketingConsent,
    idempotency_key: input.idempotencyKey,
  };

  const { data, error } = await supabase.from("designer_applications").insert(row).select("*").single();
  if (!error && data) return data as DesignerApplicationRecord;
  if (error?.code === "23505") {
    const existing = await supabase.from("designer_applications").select("*").eq("idempotency_key", input.idempotencyKey).eq("email", input.email.toLowerCase()).single();
    if (!existing.error && existing.data) return existing.data as DesignerApplicationRecord;
  }
  throw new Error(error?.message ?? "Could not create the application draft.");
}

export async function getApplication(id: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.from("designer_applications").select("*").eq("id", id).single();
  if (error || !data) return null;
  return data as DesignerApplicationRecord;
}

export async function createLookbookUpload(applicationId: string, fileName: string) {
  const supabase = requireSupabase();
  const extension = fileName.includes(".") ? fileName.split(".").pop()!.toLowerCase().replace(/[^a-z0-9]/g, "") : "bin";
  const base = fileName.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "lookbook";
  const path = `${applicationId}/${base}-${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage.from("designer-lookbooks").createSignedUploadUrl(path, { upsert: false });
  if (error || !data) throw new Error(error?.message ?? "Could not create the upload URL.");
  return data;
}

export async function verifyLookbook(applicationId: string, path: string) {
  if (!path.startsWith(`${applicationId}/`) || path.includes("..")) return false;
  const supabase = requireSupabase();
  const fileName = path.split("/").pop();
  const { data, error } = await supabase.storage.from("designer-lookbooks").list(applicationId, { search: fileName, limit: 10 });
  return !error && Boolean(data?.some((file) => file.name === fileName));
}

export async function finalizeApplication(applicationId: string, uploadPath: string, idempotencyKey: string) {
  const supabase = requireSupabase();
  const submittedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("designer_applications")
    .update({ status: "submitted", upload_path: uploadPath, submitted_at: submittedAt })
    .eq("id", applicationId)
    .eq("idempotency_key", idempotencyKey)
    .eq("status", "draft")
    .select("*")
    .maybeSingle();

  if (!error && data) return data as DesignerApplicationRecord;
  if (error) throw new Error(error.message);
  const existing = await getApplication(applicationId);
  if (existing?.status === "submitted" && existing.idempotency_key === idempotencyKey) return existing;
  throw new Error("The application could not be finalized.");
}

export async function createLookbookReadUrl(path: string, expiresInSeconds = 7 * 24 * 60 * 60) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage.from("designer-lookbooks").createSignedUrl(path, expiresInSeconds);
  if (error || !data) throw new Error(error?.message ?? "Could not create a secure lookbook link.");
  return data.signedUrl;
}

export async function updateEmailDelivery(applicationId: string, fields: Partial<Pick<DesignerApplicationRecord, "receipt_email_id" | "receipt_email_status" | "internal_email_id" | "internal_email_status">>) {
  const supabase = requireSupabase();
  const { error } = await supabase.from("designer_applications").update(fields).eq("id", applicationId);
  if (error) throw new Error(error.message);
}

export async function updateDeliveryByEmailId(emailId: string, status: string) {
  const supabase = requireSupabase();
  const receipt = await supabase.from("designer_applications").update({ receipt_email_status: status }).eq("receipt_email_id", emailId).select("id").maybeSingle();
  if (receipt.data) return receipt.data.id as string;
  const internal = await supabase.from("designer_applications").update({ internal_email_status: status }).eq("internal_email_id", emailId).select("id").maybeSingle();
  return internal.data?.id as string | undefined;
}

export async function cleanupExpiredDrafts() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("cleanup_expired_designer_drafts");
  if (error) throw new Error(error.message);
  return Number(data ?? 0);
}
