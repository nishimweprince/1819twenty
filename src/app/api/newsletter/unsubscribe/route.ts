import { failure, success } from "@/lib/api";
import { unsubscribe } from "@/lib/newsletter/repository";
import { verifyUnsubscribeToken } from "@/lib/security";

/**
 * Handles both the unsubscribe page's button and RFC 8058 one-click requests
 * from mail clients, which POST to the List-Unsubscribe URL with the token in
 * its query string. There is deliberately no GET handler: link scanners fetch
 * every URL in an email and must not unsubscribe anyone.
 */
export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const email = verifyUnsubscribeToken(token);
  if (!email)
    return failure(
      "INVALID_TOKEN",
      "This unsubscribe link is not valid. Email hello@1819twenty.com and we'll remove you.",
      400,
    );
  try {
    await unsubscribe(email);
    return success({ status: "unsubscribed" });
  } catch (error) {
    console.error("Newsletter unsubscribe failed", error);
    return failure(
      "PROVIDER_UNAVAILABLE",
      error instanceof Error
        ? error.message
        : "We could not update your subscription. Try again shortly.",
      503,
      { retryable: true },
    );
  }
}
