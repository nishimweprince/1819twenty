# Eighteen Nineteen Twenty

Phase 1 of the headless Eighteen Nineteen Twenty storefront. The public site runs independently of Shopify while the protected commerce experience is prepared in the background.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

The UI renders without provider keys. Newsletter and designer submissions return a clear configuration error until their corresponding credentials are supplied.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

## Supabase

Apply `supabase/migrations/001_phase_one.sql`, then `supabase/migrations/002_application_questions.sql`, then `supabase/migrations/003_newsletter_subscribers.sql`, in the Supabase SQL editor before deploying the updated designer form. The migrations create the private application table and photo bucket, rate limiter, draft-cleanup function, and newsletter subscriber table. Keep the service-role key server-side.

## Provider setup

- Newsletter signups are stored in Supabase (`newsletter_subscribers`), and each new subscriber gets a welcome email through Resend with a signed unsubscribe link (`/newsletter/unsubscribe`) and one-click `List-Unsubscribe` headers. `APP_SIGNING_SECRET` must stay stable in production, or earlier unsubscribe links stop working. The Klaviyo integration in `src/lib/klaviyo.ts` is set aside; to re-enable it, configure a double-opt-in list and call it from `/api/newsletter/subscribe`.
- Verify `1819twenty.com` in Resend and register `/api/webhooks/resend`.
- Create Cloudflare Turnstile keys for production.
- Add Shopify Storefront credentials when the store is available; Phase 1 does not call Shopify at render time.

See `plan.md` for the launch checklist and Phase 2 roadmap.
