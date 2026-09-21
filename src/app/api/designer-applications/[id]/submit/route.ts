import {
  finalizeApplication,
  getApplication,
  verifyLookbook,
} from "@/lib/applications/repository";
import { failure, readJson, success } from "@/lib/api";
import { sendApplicationEmails } from "@/lib/email";
import { subscribeToCommunity } from "@/lib/klaviyo";
import { verifyDraftToken } from "@/lib/security";
import { submitApplicationSchema, zodFieldErrors } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await readJson(request);
  const parsed = submitApplicationSchema.safeParse(body);
  if (!parsed.success)
    return failure(
      "VALIDATION_ERROR",
      "The application could not be finalized.",
      422,
      { fieldErrors: zodFieldErrors(parsed.error) },
    );
  if (!verifyDraftToken(parsed.data.draftToken, id))
    return failure(
      "INVALID_DRAFT",
      "This application session has expired. Start again.",
      401,
    );

  try {
    const existing = await getApplication(id);
    if (!existing)
      return failure("NOT_FOUND", "The application draft was not found.", 404);
    if (existing.idempotency_key !== parsed.data.idempotencyKey)
      return failure(
        "INVALID_DRAFT",
        "The application session does not match.",
        409,
      );

    if (
      existing.status !== "submitted" &&
      !(await verifyLookbook(id, parsed.data.uploadPath))
    ) {
      return failure(
        "UPLOAD_MISSING",
        "The lookbook upload is incomplete. Upload it again.",
        422,
        { retryable: true },
      );
    }

    const application =
      existing.status === "submitted"
        ? existing
        : await finalizeApplication(
            id,
            parsed.data.uploadPath,
            parsed.data.idempotencyKey,
          );
    const emailStatus = await sendApplicationEmails(application);

    if (application.marketing_consent) {
      subscribeToCommunity(
        application.email,
        "/designers/apply",
        application.privacy_consent_at,
      ).catch((error) => {
        console.error("Optional applicant marketing opt-in failed", error);
      });
    }

    return success({
      applicationId: application.id,
      reference: application.reference,
      submittedAt: application.submitted_at,
      receiptEmailStatus: emailStatus.receipt,
    });
  } catch (error) {
    console.error("Application submission failed", error);
    return failure(
      "SUBMISSION_FAILED",
      "Your application could not be finalized. Your saved draft is safe; try again.",
      503,
      { retryable: true },
    );
  }
}
