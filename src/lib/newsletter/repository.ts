import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type NewsletterSubscriberInput = {
  email: string;
  source: string;
  consentedAt: string;
  consentCopyVersion: string;
};

function requireSupabase() {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Community signup is not configured yet.");
  return supabase;
}

/**
 * Records a signup. Joining again with an address already on the list
 * refreshes its consent and resubscribes it, and succeeds the same way a first
 * signup does so the response never reveals who is subscribed.
 *
 * `joined` is true only when the address was not already subscribed, so a
 * repeat signup cannot be used to send someone a stream of welcome emails.
 */
export async function saveSubscriber(input: NewsletterSubscriberInput) {
  const supabase = requireSupabase();
  const email = input.email.trim().toLowerCase();

  const existing = await supabase
    .from("newsletter_subscribers")
    .select("status")
    .eq("email", email)
    .maybeSingle();
  if (existing.error) {
    console.error(
      "Newsletter subscriber lookup failed",
      existing.error.message,
    );
    throw new Error("We could not add you to the list. Try again shortly.");
  }

  const { error } = await supabase.from("newsletter_subscribers").upsert(
    {
      email,
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
  return { email, joined: existing.data?.status !== "subscribed" };
}

/** Idempotent: unsubscribing an unknown or already removed address succeeds. */
export async function unsubscribe(email: string) {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
    })
    .eq("email", email.trim().toLowerCase())
    .eq("status", "subscribed");
  if (error) {
    console.error("Newsletter unsubscribe failed", error.message);
    throw new Error(
      "We could not update your subscription. Try again shortly.",
    );
  }
}
