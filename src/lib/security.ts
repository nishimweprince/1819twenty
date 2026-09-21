import "server-only";
import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { env } from "./env";
import { getSupabaseAdmin } from "./supabase-admin";

const localLimits = new Map<string, { count: number; resetAt: number }>();

export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

export function fingerprint(value: string) {
  const secret = env.APP_SIGNING_SECRET ?? "local-development-only";
  return createHmac("sha256", secret).update(value.toLowerCase()).digest("hex");
}

export async function enforceRateLimit(
  scope: string,
  identity: string,
  limit: number,
  windowSeconds: number,
) {
  const key = `${scope}:${fingerprint(identity)}`;
  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase.rpc("check_submission_rate_limit", {
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });
    if (error) throw new Error(`Rate limiter unavailable: ${error.message}`);
    return Boolean(data);
  }

  const now = Date.now();
  const existing = localLimits.get(key);
  if (!existing || existing.resetAt <= now) {
    localLimits.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return true;
  }
  existing.count += 1;
  return existing.count <= limit;
}

export async function verifyTurnstile(token: string, ip: string) {
  // Without a secret there is no provider to verify against (the widget only
  // renders when a site key is set), so the check is skipped. Once a secret
  // is configured, empty or invalid tokens fail as before.
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  const body = new FormData();
  body.set("secret", env.TURNSTILE_SECRET_KEY);
  body.set("response", token);
  body.set("remoteip", ip);
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body, cache: "no-store" },
  );
  if (!response.ok) return false;
  const result = (await response.json()) as { success?: boolean };
  return Boolean(result.success);
}

export function generateReference(date = new Date()) {
  const year = date.getUTCFullYear();
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let suffix = "";
  for (const byte of bytes) suffix += alphabet[byte % alphabet.length];
  return `ENT-${year}-${suffix}`;
}

type DraftTokenPayload = {
  applicationId: string;
  emailHash: string;
  expiresAt: number;
};

export function createDraftToken(applicationId: string, email: string) {
  const payload: DraftTokenPayload = {
    applicationId,
    emailHash: createHash("sha256").update(email.toLowerCase()).digest("hex"),
    expiresAt: Date.now() + 2 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac(
    "sha256",
    env.APP_SIGNING_SECRET ?? "local-development-only",
  )
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyDraftToken(token: string, applicationId: string) {
  const [encoded, provided] = token.split(".");
  if (!encoded || !provided) return false;
  const expected = createHmac(
    "sha256",
    env.APP_SIGNING_SECRET ?? "local-development-only",
  )
    .update(encoded)
    .digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  if (
    expectedBuffer.length !== providedBuffer.length ||
    !timingSafeEqual(expectedBuffer, providedBuffer)
  )
    return false;
  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as DraftTokenPayload;
    return (
      payload.applicationId === applicationId && payload.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}
