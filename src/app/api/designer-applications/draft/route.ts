import { createApplicationDraft } from "@/lib/applications/repository";
import { failure, readJson, success } from "@/lib/api";
import {
  clientIp,
  createDraftToken,
  enforceRateLimit,
  verifyTurnstile,
} from "@/lib/security";
import { designerApplicationSchema, zodFieldErrors } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await readJson(request);
  const parsed = designerApplicationSchema.safeParse(body);
  if (!parsed.success)
    return failure(
      "VALIDATION_ERROR",
      "Check the highlighted application fields.",
      422,
      { fieldErrors: zodFieldErrors(parsed.error) },
    );

  const ip = clientIp(request.headers);
  try {
    if (
      !(await enforceRateLimit(
        "designer-draft",
        `${ip}:${parsed.data.email}`,
        4,
        24 * 60 * 60,
      ))
    ) {
      return failure(
        "RATE_LIMITED",
        "Too many application attempts. Try again tomorrow or email us for help.",
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
    const application = await createApplicationDraft(parsed.data);
    return success(
      {
        applicationId: application.id,
        reference: application.reference,
        draftToken: createDraftToken(application.id, application.email),
        status: application.status,
      },
      201,
    );
  } catch (error) {
    console.error("Designer draft failed", error);
    return failure(
      "STORAGE_UNAVAILABLE",
      error instanceof Error
        ? error.message
        : "Application storage is temporarily unavailable.",
      503,
      { retryable: true },
    );
  }
}
