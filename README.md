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

Apply `supabase/migrations/001_phase_one.sql` in the Supabase SQL editor. It creates the private application table, upload bucket, rate limiter, and draft-cleanup function. Keep the service-role key server-side.

## Provider setup

- Configure a double-opt-in Klaviyo list and set its ID.
- Verify `1819twenty.com` in Resend and register `/api/webhooks/resend`.
- Create Cloudflare Turnstile keys for production.
- Add Shopify Storefront credentials when the store is available; Phase 1 does not call Shopify at render time.

See `plan.md` for the launch checklist and Phase 2 roadmap.
