import { Webhook } from "svix";
import { env } from "@/lib/env";
import { updateDeliveryByEmailId } from "@/lib/applications/repository";
import { failure, success } from "@/lib/api";

type ResendEvent = { type: string; data?: { email_id?: string } };

export async function POST(request: Request) {
  if (!env.RESEND_WEBHOOK_SECRET)
    return failure(
      "NOT_CONFIGURED",
      "Webhook verification is not configured.",
      503,
    );
  const payload = await request.text();
  try {
    const event = new Webhook(env.RESEND_WEBHOOK_SECRET).verify(payload, {
      "svix-id": request.headers.get("svix-id") ?? "",
      "svix-timestamp": request.headers.get("svix-timestamp") ?? "",
      "svix-signature": request.headers.get("svix-signature") ?? "",
    }) as unknown as ResendEvent;
    const emailId = event.data?.email_id;
    if (emailId)
      await updateDeliveryByEmailId(emailId, event.type.replace("email.", ""));
    return success({ received: true });
  } catch (error) {
    console.error("Invalid Resend webhook", error);
    return failure("INVALID_SIGNATURE", "Invalid webhook signature.", 400);
  }
}
