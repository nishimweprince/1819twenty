import { failure, readJson, success } from "@/lib/api";
import { saveSubscriber } from "@/lib/newsletter/repository";
import { clientIp, enforceRateLimit, verifyTurnstile } from "@/lib/security";
import { newsletterSchema, zodFieldErrors } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await readJson(request);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success)
    return failure(
      "VALIDATION_ERROR",
      "Check the email and consent fields.",
      422,
      { fieldErrors: zodFieldErrors(parsed.error) },
    );

  const ip = clientIp(request.headers);
  try {
    if (
      !(await enforceRateLimit(
        "newsletter",
        `${ip}:${parsed.data.email}`,
        5,
        3600,
      ))
    ) {
      return failure(
        "RATE_LIMITED",
        "Too many signup attempts. Try again later.",
        429,
        { retryable: true },
      );
    }
    if (!(await verifyTurnstile(parsed.data.turnstileToken, ip))) {
      return failure(
        "BOT_CHECK_FAILED",
        "Complete the security check and try again.",
        403,
        { retryable: true },
      );
    }
    // Klaviyo (src/lib/klaviyo.ts) is set aside for now; signups are kept in
    // Supabase until the email provider is chosen.
    await saveSubscriber({
      email: parsed.data.email,
      source: parsed.data.source,
      consentedAt: parsed.data.consentedAt,
      consentCopyVersion: parsed.data.consentCopyVersion,
    });
    return success({ status: "subscribed" }, 201);
  } catch (error) {
    console.error("Newsletter signup failed", error);
    return failure(
      "PROVIDER_UNAVAILABLE",
      error instanceof Error
        ? error.message
        : "Email signup is temporarily unavailable.",
      503,
      { retryable: true },
    );
  }
}
