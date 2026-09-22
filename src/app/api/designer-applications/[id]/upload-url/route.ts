import {
  createPhotoUpload,
  getApplication,
  listPhotoUploads,
} from "@/lib/applications/repository";
import { failure, readJson, success } from "@/lib/api";
import { verifyDraftToken } from "@/lib/security";
import { uploadRequestSchema, zodFieldErrors } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await readJson(request);
  const parsed = uploadRequestSchema.safeParse(body);
  if (!parsed.success)
    return failure(
      "VALIDATION_ERROR",
      "Check the selected photo.",
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
    const application = await getApplication(id);
    if (!application || application.status !== "draft")
      return failure(
        "INVALID_DRAFT",
        "This application can no longer accept an upload.",
        409,
      );
    const files = await listPhotoUploads(id);
    if (files.length >= 5)
      return failure("PHOTO_LIMIT", "This application already has five uploaded photos.", 409);
    const upload = await createPhotoUpload(id, parsed.data.fileName);
    return success({
      path: upload.path,
      token: upload.token,
      signedUrl: upload.signedUrl,
    });
  } catch (error) {
    console.error("Upload URL failed", error);
    return failure(
      "UPLOAD_UNAVAILABLE",
      "The secure upload could not be prepared. Try again.",
      503,
      { retryable: true },
    );
  }
}
