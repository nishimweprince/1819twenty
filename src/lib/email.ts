import "server-only";
import { Resend } from "resend";
import { env } from "./env";
import {
  createPhotoReadUrl,
  DesignerApplicationRecord,
  updateEmailDelivery,
} from "./applications/repository";
import {
  businessAgeLabels,
  capacityLabels,
  categoryLabels,
  eventInterestLabels,
  goalLabels,
  makerLabels,
  shippingLabels,
} from "./validation";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        char
      ]!,
  );
}

function answer(value: string | null | undefined) {
  return escapeHtml(value || "Not provided").replaceAll("\n", "<br>");
}

function row(label: string, value: string | null | undefined) {
  return `<tr><th style="text-align:left;vertical-align:top;padding:7px 14px 7px 0">${escapeHtml(label)}</th><td style="padding:7px 0">${answer(value)}</td></tr>`;
}

function named(value: string | null, labels: Record<string, string>) {
  return value ? (labels[value] ?? value) : null;
}

export async function sendApplicationEmails(
  application: DesignerApplicationRecord,
) {
  if (!env.RESEND_API_KEY) {
    await updateEmailDelivery(application.id, {
      receipt_email_status: "not_configured",
      internal_email_status: "not_configured",
    });
    return { receipt: "not_configured", internal: "not_configured" };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const photoLinks = await Promise.all(
    (application.upload_paths ?? []).map(async (path, index) => {
      try {
        const url = await createPhotoReadUrl(path);
        return `<li><a href="${escapeHtml(url)}">Photo ${index + 1}: ${escapeHtml(path.split("/").pop() ?? "View photo")}</a> (expires in seven days)</li>`;
      } catch (error) {
        console.error("Could not sign application photo", error);
        return `<li>Photo ${index + 1}: stored privately in Supabase</li>`;
      }
    }),
  );

  const receipt = await resend.emails.send(
    {
      from: env.RESEND_FROM_EMAIL,
      to: application.email,
      subject: `We received your application: ${application.reference}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1e3448;max-width:620px;margin:auto"><h1 style="font-family:Georgia,serif;font-weight:500">Your work is with us.</h1><p>Hello ${escapeHtml(application.contact_name)},</p><p>We received the application for <strong>${escapeHtml(application.brand_name)}</strong>. Our team reviews complete submissions within five business days.</p><p>Your reference is <strong>${escapeHtml(application.reference)}</strong>.</p><p>Keep this email for your records. We will contact you at this address if we need anything else.</p><p>Eighteen Nineteen Twenty<br>Timeless roots. Modern living.</p></div>`,
    },
    { idempotencyKey: `application-receipt/${application.id}` },
  );

  await updateEmailDelivery(application.id, {
    receipt_email_id: receipt.data?.id ?? null,
    receipt_email_status: receipt.error ? "failed" : "sent",
  });

  const rows = [
    row("1. Full name", application.contact_name),
    row("2. Brand/business name", application.brand_name),
    row("3. Email address", application.email),
    row("4. Phone number / WhatsApp", application.phone_whatsapp),
    row("5. Country/city", application.country_city),
    row("6. Instagram/social handles", application.website_social),
    row("7. Website", application.website_url),
    row(
      "8. Categories",
      application.categories
        .map(
          (value) =>
            categoryLabels[value as keyof typeof categoryLabels] ?? value,
        )
        .join(", "),
    ),
    row("9. Brand and design story", application.brand_story),
    row(
      "10. Time in business",
      named(application.years_in_business, businessAgeLabels),
    ),
    row("11. Made by", named(application.made_by, makerLabels)),
    row("11. Made where", application.made_where),
    row("12. Sells online", application.sells_online ? "Yes" : "No"),
    row("12. Online channels", application.online_channels),
    row(
      "13. Monthly production capacity",
      named(application.monthly_capacity, capacityLabels),
    ),
    row(
      "14. Wholesale/export experience",
      application.has_wholesale_export_experience ? "Yes" : "No",
    ),
    row(
      "15. International shipping",
      named(application.shipping_capability, shippingLabels),
    ),
    row("16. Photos", `${application.upload_paths.length} uploaded`),
    row("17. Lookbook/catalog URL", application.lookbook_url),
    row("18. Why join", application.why_join),
    row(
      "19. Goals",
      application.goals
        .map((value) => goalLabels[value as keyof typeof goalLabels] ?? value)
        .join(", "),
    ),
    row("20. Additional notes", application.additional_notes),
    row(
      "21. 2027 event interest",
      named(application.event_interest, eventInterestLabels),
    ),
    row("Privacy consent", application.privacy_consent_at),
    row("Marketing updates", application.marketing_consent ? "Yes" : "No"),
  ].join("");

  const internal = await resend.emails.send(
    {
      from: env.RESEND_FROM_EMAIL,
      to: env.INTERNAL_APPLICATION_EMAIL,
      replyTo: application.email,
      subject: `New designer application: ${application.brand_name} (${application.reference})`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.55;color:#1e3448;max-width:700px"><h1 style="font-family:Georgia,serif;font-weight:500">New designer application</h1><p><strong>Reference:</strong> ${escapeHtml(application.reference)}</p><table style="border-collapse:collapse">${rows}</table><h2>Portfolio photos</h2><ol>${photoLinks.join("")}</ol></div>`,
    },
    { idempotencyKey: `application-internal/${application.id}` },
  );

  await updateEmailDelivery(application.id, {
    internal_email_id: internal.data?.id ?? null,
    internal_email_status: internal.error ? "failed" : "sent",
  });

  return {
    receipt: receipt.error ? "failed" : "sent",
    internal: internal.error ? "failed" : "sent",
  };
}
