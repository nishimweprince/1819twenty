import "server-only";
import { Resend } from "resend";
import { env } from "./env";
import { createLookbookReadUrl, DesignerApplicationRecord, updateEmailDelivery } from "./applications/repository";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]!);
}

export async function sendApplicationEmails(application: DesignerApplicationRecord) {
  if (!env.RESEND_API_KEY) {
    await updateEmailDelivery(application.id, { receipt_email_status: "not_configured", internal_email_status: "not_configured" });
    return { receipt: "not_configured", internal: "not_configured" };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  let lookbookUrl = "Stored privately; open it from Supabase.";
  if (application.upload_path) {
    try { lookbookUrl = await createLookbookReadUrl(application.upload_path); } catch (error) { console.error(error); }
  }

  const receipt = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: application.email,
    subject: `We received your application: ${application.reference}`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#2c3e50;max-width:620px;margin:auto"><h1 style="font-family:Georgia,serif;font-weight:500">Your work is with us.</h1><p>Hello ${escapeHtml(application.contact_name)},</p><p>We received the application for <strong>${escapeHtml(application.brand_name)}</strong>. Our team reviews complete submissions within five business days.</p><p>Your reference is <strong>${escapeHtml(application.reference)}</strong>.</p><p>Keep this email for your records. We will contact you at this address if we need anything else.</p><p>Eighteen Nineteen Twenty<br>Timeless roots. Modern living.</p></div>`,
  }, { idempotencyKey: `application-receipt/${application.id}` });

  await updateEmailDelivery(application.id, {
    receipt_email_id: receipt.data?.id ?? null,
    receipt_email_status: receipt.error ? "failed" : "sent",
  });

  const internal = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: env.INTERNAL_APPLICATION_EMAIL,
    replyTo: application.email,
    subject: `New designer application: ${application.brand_name} (${application.reference})`,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.55;color:#2c3e50;max-width:700px"><h1 style="font-family:Georgia,serif;font-weight:500">New designer application</h1><p><strong>Reference:</strong> ${escapeHtml(application.reference)}</p><p><strong>Brand:</strong> ${escapeHtml(application.brand_name)}<br><strong>Contact:</strong> ${escapeHtml(application.contact_name)}<br><strong>Email:</strong> ${escapeHtml(application.email)}<br><strong>Phone / WhatsApp:</strong> ${escapeHtml(application.phone_whatsapp)}<br><strong>Based in:</strong> ${escapeHtml(application.country_city)}<br><strong>Category:</strong> ${escapeHtml(application.product_category)}<br><strong>Available items:</strong> ${application.sku_count}</p><p><strong>Brand story</strong><br>${escapeHtml(application.brand_story).replaceAll("\n", "<br>")}</p><p><a href="${lookbookUrl}">Open the private lookbook</a> (link expires in seven days).</p></div>`,
  }, { idempotencyKey: `application-internal/${application.id}` });

  await updateEmailDelivery(application.id, {
    internal_email_id: internal.data?.id ?? null,
    internal_email_status: internal.error ? "failed" : "sent",
  });

  return {
    receipt: receipt.error ? "failed" : "sent",
    internal: internal.error ? "failed" : "sent",
  };
}
