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
  website_url: string | null;
  categories: string[];
  years_in_business: string | null;
  made_by: string | null;
  made_where: string | null;
  sells_online: boolean | null;
  online_channels: string | null;
  monthly_capacity: string | null;
  has_wholesale_export_experience: boolean | null;
  shipping_capability: string | null;
  lookbook_url: string | null;
  why_join: string | null;
  goals: string[];
  event_interest: string | null;
  product_category: string | null;
  sku_count: number | null;
  includes_apparel: boolean;
  size_range: string | null;
  confirms_wholesale: boolean | null;
  confirms_direct_shipping: boolean | null;
  brand_story: string;
  additional_notes: string | null;
  upload_path: string | null;
  upload_paths: string[];
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

export async function createApplicationDraft(
  input: DesignerApplicationInput,
): Promise<DesignerApplicationRecord> {
  const supabase = requireSupabase();
  const row = {
    reference: generateReference(),
    status: "draft",
    brand_name: input.brandName,
    contact_name: input.fullName,
    email: input.email.toLowerCase(),
    phone_whatsapp: input.phoneWhatsapp,
    country_city: input.countryCity,
    website_social: input.socialHandles,
    website_url: input.websiteUrl || null,
    categories: input.categories,
    years_in_business: input.yearsInBusiness,
    made_by: input.madeBy,
    made_where: input.madeWhere,
    sells_online: input.sellsOnline,
    online_channels: input.sellsOnline ? input.onlineChannels : null,
    monthly_capacity: input.monthlyCapacity,
    has_wholesale_export_experience: input.wholesaleExportExperience,
    shipping_capability: input.shippingCapability,
    lookbook_url: input.lookbookUrl || null,
    why_join: input.whyJoin,
    goals: input.goals,
    event_interest: input.eventInterest,
    brand_story: input.brandStory,
    additional_notes: input.additionalNotes || null,
    privacy_consent_at: input.consentedAt,
    consent_copy_version: input.consentCopyVersion,
    marketing_consent: input.marketingConsent,
    idempotency_key: input.idempotencyKey,
  };

  const { data, error } = await supabase
    .from("designer_applications")
    .insert(row)
    .select("*")
    .single();
  if (!error && data) return data as DesignerApplicationRecord;
  if (error?.code === "23505") {
    const existing = await supabase
      .from("designer_applications")
      .select("*")
      .eq("idempotency_key", input.idempotencyKey)
      .eq("email", input.email.toLowerCase())
      .single();
    if (!existing.error && existing.data)
      return existing.data as DesignerApplicationRecord;
  }
  throw new Error(error?.message ?? "Could not create the application draft.");
}

export async function getApplication(id: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("designer_applications")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return data as DesignerApplicationRecord;
}

export async function createPhotoUpload(
  applicationId: string,
  fileName: string,
) {
  const supabase = requireSupabase();
  const extension = fileName.includes(".")
    ? fileName
        .split(".")
        .pop()!
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
    : "bin";
  const base =
    fileName
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "photo";
  const path = `${applicationId}/${base}-${crypto.randomUUID()}.${extension}`;
  const { data, error } = await supabase.storage
    .from("designer-lookbooks")
    .createSignedUploadUrl(path, { upsert: false });
  if (error || !data)
    throw new Error(error?.message ?? "Could not create the upload URL.");
  return data;
}

export async function listPhotoUploads(applicationId: string) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage
    .from("designer-lookbooks")
    .list(applicationId, { limit: 100 });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function verifyUploads(applicationId: string, paths: string[]) {
  if (
    paths.length < 3 ||
    paths.length > 5 ||
    new Set(paths).size !== paths.length
  )
    return false;
  if (
    paths.some(
      (path) =>
        !path.startsWith(`${applicationId}/`) ||
        path.includes("..") ||
        path.slice(applicationId.length + 1).includes("/"),
    )
  )
    return false;
  const files = await listPhotoUploads(applicationId);
  const names = new Set(files.map((file) => file.name));
  return paths.every((path) => names.has(path.slice(applicationId.length + 1)));
}

export async function finalizeApplication(
  applicationId: string,
  uploadPaths: string[],
  idempotencyKey: string,
) {
  const supabase = requireSupabase();
  const submittedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("designer_applications")
    .update({
      status: "submitted",
      upload_paths: uploadPaths,
      submitted_at: submittedAt,
    })
    .eq("id", applicationId)
    .eq("idempotency_key", idempotencyKey)
    .eq("status", "draft")
    .select("*")
    .maybeSingle();

  if (!error && data) return data as DesignerApplicationRecord;
  if (error) throw new Error(error.message);
  const existing = await getApplication(applicationId);
  if (
    existing?.status === "submitted" &&
    existing.idempotency_key === idempotencyKey
  )
    return existing;
  throw new Error("The application could not be finalized.");
}

export async function createPhotoReadUrl(
  path: string,
  expiresInSeconds = 7 * 24 * 60 * 60,
) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage
    .from("designer-lookbooks")
    .createSignedUrl(path, expiresInSeconds);
  if (error || !data)
    throw new Error(error?.message ?? "Could not create a secure photo link.");
  return data.signedUrl;
}

export async function updateEmailDelivery(
  applicationId: string,
  fields: Partial<
    Pick<
      DesignerApplicationRecord,
      | "receipt_email_id"
      | "receipt_email_status"
      | "internal_email_id"
      | "internal_email_status"
    >
  >,
) {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("designer_applications")
    .update(fields)
    .eq("id", applicationId);
  if (error) throw new Error(error.message);
}

export async function updateDeliveryByEmailId(emailId: string, status: string) {
  const supabase = requireSupabase();
  const receipt = await supabase
    .from("designer_applications")
    .update({ receipt_email_status: status })
    .eq("receipt_email_id", emailId)
    .select("id")
    .maybeSingle();
  if (receipt.data) return receipt.data.id as string;
  const internal = await supabase
    .from("designer_applications")
    .update({ internal_email_status: status })
    .eq("internal_email_id", emailId)
    .select("id")
    .maybeSingle();
  return internal.data?.id as string | undefined;
}

export async function cleanupExpiredDrafts() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.rpc("cleanup_expired_designer_drafts");
  if (error) throw new Error(error.message);
  return Number(data ?? 0);
}
