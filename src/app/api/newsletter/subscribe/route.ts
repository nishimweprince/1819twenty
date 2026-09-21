import { failure, readJson, success } from "@/lib/api";
import { subscribeToCommunity } from "@/lib/klaviyo";
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
    await subscribeToCommunity(
      parsed.data.email.toLowerCase(),
      parsed.data.source,
      parsed.data.consentedAt,
    );
    return success({ status: "confirmation_pending" }, 202);
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
