create extension if not exists pgcrypto;

do $$ begin
  create type public.designer_application_status as enum ('draft', 'submitted', 'under_review', 'approved', 'declined');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.designer_applications (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  status public.designer_application_status not null default 'draft',
  brand_name text not null,
  contact_name text not null,
  email text not null,
  phone_whatsapp text not null,
  country_city text not null,
  website_social text not null,
  product_category text not null check (product_category in ('women', 'men', 'kids', 'home', 'multiple')),
  sku_count integer not null check (sku_count >= 10),
  includes_apparel boolean not null default false,
  size_range text,
  confirms_wholesale boolean not null check (confirms_wholesale),
  confirms_direct_shipping boolean not null check (confirms_direct_shipping),
  brand_story text not null,
  additional_notes text,
  upload_path text,
  privacy_consent_at timestamptz not null,
  consent_copy_version text not null,
  marketing_consent boolean not null default false,
  idempotency_key uuid not null unique,
  submitted_at timestamptz,
  receipt_email_id text,
  receipt_email_status text not null default 'pending',
  internal_email_id text,
  internal_email_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (not includes_apparel or nullif(trim(size_range), '') is not null)
);

create index if not exists designer_applications_status_created_idx on public.designer_applications (status, created_at);
create index if not exists designer_applications_email_idx on public.designer_applications (lower(email));
create unique index if not exists designer_applications_receipt_email_idx on public.designer_applications (receipt_email_id) where receipt_email_id is not null;
create unique index if not exists designer_applications_internal_email_idx on public.designer_applications (internal_email_id) where internal_email_id is not null;

alter table public.designer_applications enable row level security;
revoke all on public.designer_applications from anon, authenticated;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_designer_applications_updated_at on public.designer_applications;
create trigger set_designer_applications_updated_at before update on public.designer_applications
for each row execute function public.set_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('designer-lookbooks', 'designer-lookbooks', false, 20971520, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.submission_rate_limits (
  key text primary key,
  request_count integer not null,
  window_started_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.submission_rate_limits enable row level security;
revoke all on public.submission_rate_limits from anon, authenticated;

create or replace function public.check_submission_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_row public.submission_rate_limits;
begin
  perform pg_advisory_xact_lock(hashtext(p_key));
  select * into current_row from public.submission_rate_limits where key = p_key;
  if current_row is null or current_row.window_started_at < now() - make_interval(secs => p_window_seconds) then
    insert into public.submission_rate_limits (key, request_count, window_started_at, updated_at)
    values (p_key, 1, now(), now())
    on conflict (key) do update set request_count = 1, window_started_at = now(), updated_at = now();
    return true;
  end if;
  update public.submission_rate_limits set request_count = request_count + 1, updated_at = now() where key = p_key;
  return current_row.request_count + 1 <= p_limit;
end;
$$;

revoke all on function public.check_submission_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_submission_rate_limit(text, integer, integer) to service_role;

create or replace function public.cleanup_expired_designer_drafts()
returns integer
language plpgsql
security definer
set search_path = public, storage
as $$
declare
  deleted_count integer;
begin
  delete from storage.objects
  where bucket_id = 'designer-lookbooks'
    and split_part(name, '/', 1) in (
      select id::text from public.designer_applications where status = 'draft' and created_at < now() - interval '7 days'
    );
  delete from public.designer_applications where status = 'draft' and created_at < now() - interval '7 days';
  get diagnostics deleted_count = row_count;
  delete from public.submission_rate_limits where updated_at < now() - interval '2 days';
  return deleted_count;
end;
$$;

revoke all on function public.cleanup_expired_designer_drafts() from public, anon, authenticated;
grant execute on function public.cleanup_expired_designer_drafts() to service_role;
