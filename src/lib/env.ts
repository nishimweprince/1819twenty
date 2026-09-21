import "server-only";
import { z } from "zod";

const optional = z.string().trim().optional().transform((value) => value || undefined);

const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: optional,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: optional,
  SUPABASE_SERVICE_ROLE_KEY: optional,
  APP_SIGNING_SECRET: optional,
  CRON_SECRET: optional,
  RESEND_API_KEY: optional,
  RESEND_WEBHOOK_SECRET: optional,
  RESEND_FROM_EMAIL: z.string().default("Eighteen Nineteen Twenty <applications@1819twenty.com>"),
  INTERNAL_APPLICATION_EMAIL: z.string().email().default("hello@1819twenty.com"),
  KLAVIYO_PRIVATE_API_KEY: optional,
  KLAVIYO_LIST_ID: optional,
  KLAVIYO_API_REVISION: z.string().default("2026-07-15"),
  TURNSTILE_SECRET_KEY: optional,
  SHOPIFY_STORE_DOMAIN: optional,
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: optional,
  SHOPIFY_API_VERSION: z.string().default("2026-07"),
});

export const env = schema.parse(process.env);

export function hasSupabaseConfig() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
}
