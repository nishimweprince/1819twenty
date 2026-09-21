import { cleanupExpiredDrafts } from "@/lib/applications/repository";
import { failure, success } from "@/lib/api";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!env.CRON_SECRET || authorization !== `Bearer ${env.CRON_SECRET}`) return failure("UNAUTHORIZED", "Unauthorized.", 401);
  try {
    const removed = await cleanupExpiredDrafts();
    return success({ removed });
  } catch (error) {
    console.error("Draft cleanup failed", error);
    return failure("CLEANUP_FAILED", "Draft cleanup failed.", 500, { retryable: true });
  }
}
