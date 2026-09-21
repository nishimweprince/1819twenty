# Eighteen Nineteen Twenty — Technical Roadmap

Last updated: 2026-09-18

## Status

- `[x]` Complete
- `[~]` In progress
- `[ ]` Planned
- `[!]` Waiting on an external input

Active milestone: Phase 1 implementation and integration setup.

## Decisions

- Next.js App Router with strict TypeScript and CSS Modules.
- Phase 1 is public at `/`, `/about`, `/designers`, and `/designers/apply`.
- Shopify Storefront API is isolated behind a server-only client and is not required to render Phase 1.
- Supabase is the private Phase 1 application store; approved applications may be synced later with a separate Shopify Admin API token.
- Resend sends transactional application receipts; Klaviyo owns newsletter consent and marketing subscriptions.
- Phase 2 has no public routes until written approval removes the staging gate.

## Phase 1

### Foundation

- [x] Scaffold Next.js, TypeScript, linting, unit tests, and Playwright.
- [x] Add design tokens, typography, shared shell, and responsive navigation.
- [x] Add typed environment and provider boundaries.
- [x] Add Supabase schema and storage migration.
- [x] Add Shopify Storefront client contract.

### Public experience

- [x] Coming Soon page and community signup.
- [x] About page and brand narrative.
- [x] Designer recruitment page.
- [x] Tier One application and receipt page.
- [x] Privacy and Terms legal-review placeholders.
- [x] Metadata, robots, sitemap, 404, and error states.

### Integrations

- [x] Supabase draft, signed upload, submission, and retention flows.
- [x] Resend applicant receipt, internal alert, and webhook handler.
- [x] Klaviyo double-opt-in subscription endpoint.
- [x] Turnstile, honeypot, throttling, and idempotency controls.
- [!] Configure provider credentials and verify production domains.

### Launch gate

- [ ] Approve final site copy.
- [ ] Approve Privacy and Terms copy with legal counsel.
- [ ] Confirm Instagram, Facebook, TikTok, and Pinterest URLs.
- [ ] Verify Resend sender-domain DNS.
- [ ] Create Klaviyo list with double opt-in and welcome flow.
- [ ] Apply Supabase migration and confirm private bucket policies.
- [ ] Add Shopify Storefront credentials when available.
- [ ] Review mobile and desktop preview deployments.
- [ ] Confirm production launch date and connect `1819twenty.com`.

## Phase 2 — Protected commerce

- [ ] Collections, category pages, filtering, sorting, and product grids.
- [ ] Product pages with variants, designer attribution, and shipping/duties copy.
- [ ] Search, cart, hosted Shopify checkout, and customer accounts.
- [ ] Editorial homepage, journal, and verified reviews/press content.
- [ ] Shopify metaobjects for designer profiles and editorial content.
- [ ] Password-protected staging, `noindex`, and explicit production approval gate.

## Test gates

- [x] Schema and domain-unit tests.
- [x] Route and accessibility end-to-end coverage authored.
- [ ] Run provider sandbox smoke tests after keys are supplied.
- [ ] Confirm no serious or critical accessibility violations.
- [ ] Confirm Lighthouse performance ≥ 90 and accessibility ≥ 95.
- [ ] Confirm commerce URLs are absent from Phase 1 navigation and sitemap.

## Credentials checklist

- [!] `NEXT_PUBLIC_SUPABASE_URL`
- [!] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [!] `SUPABASE_SERVICE_ROLE_KEY`
- [!] `RESEND_API_KEY` and `RESEND_WEBHOOK_SECRET`
- [!] `KLAVIYO_PRIVATE_API_KEY` and `KLAVIYO_LIST_ID`
- [!] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
- [!] `APP_SIGNING_SECRET` and `CRON_SECRET`
- [!] `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

## Change log

- 2026-09-18 — Created Phase 1 application, design system, provider adapters, tests, database migration, and deployment configuration.
