import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type NewsletterSubscriberInput = {
  email: string;
  source: string;
  consentedAt: string;
  consentCopyVersion: string;
};

/**
 * Records a signup. Joining again with an address already on the list
 * refreshes its consent and resubscribes it, and succeeds the same way a first
 * signup does so the response never reveals who is subscribed.
 */
export async function saveSubscriber(input: NewsletterSubscriberInput) {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Community signup is not configured yet.");

  const { error } = await supabase.from("newsletter_subscribers").upsert(
    {
      email: input.email.trim().toLowerCase(),
      status: "subscribed",
      source: input.source,
      consented_at: input.consentedAt,
      consent_copy_version: input.consentCopyVersion,
      unsubscribed_at: null,
    },
    { onConflict: "email" },
  );
  if (error) {
    console.error("Newsletter subscriber insert failed", error.message);
    throw new Error("We could not add you to the list. Try again shortly.");
  }
}
