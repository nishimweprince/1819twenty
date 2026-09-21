import "server-only";
import { env } from "./env";

export async function subscribeToCommunity(
  email: string,
  source: string,
  consentedAt: string,
) {
  if (!env.KLAVIYO_PRIVATE_API_KEY || !env.KLAVIYO_LIST_ID)
    throw new Error("Community signup is not configured yet.");

  const response = await fetch(
    "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs",
    {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${env.KLAVIYO_PRIVATE_API_KEY}`,
        revision: env.KLAVIYO_API_REVISION,
        accept: "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            custom_source: source,
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: "SUBSCRIBED",
                          consented_at: consentedAt,
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: { data: { type: "list", id: env.KLAVIYO_LIST_ID } },
          },
        },
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    console.error(
      "Klaviyo subscription failed",
      response.status,
      detail.slice(0, 500),
    );
    throw new Error(
      "We could not start the email confirmation. Try again shortly.",
    );
  }
}
