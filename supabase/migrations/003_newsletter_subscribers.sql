-- Apply after 002_application_questions.sql. Stores newsletter signups in
-- Supabase while the Klaviyo integration is set aside. Emails are stored
-- lowercased so the unique constraint also covers case variants.
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  source text not null,
  consented_at timestamptz not null,
  consent_copy_version text not null,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists newsletter_subscribers_status_created_idx on public.newsletter_subscribers (status, created_at);

alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from anon, authenticated;

drop trigger if exists set_newsletter_subscribers_updated_at on public.newsletter_subscribers;
create trigger set_newsletter_subscribers_updated_at before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();
