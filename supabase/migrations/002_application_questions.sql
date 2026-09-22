-- Apply after 001_phase_one.sql. Preserve earlier submissions while replacing
-- the Phase 1 qualification fields for new designer applications.
alter table public.designer_applications
  add column if not exists website_url text,
  add column if not exists categories text[] not null default '{}',
  add column if not exists years_in_business text,
  add column if not exists made_by text,
  add column if not exists made_where text,
  add column if not exists sells_online boolean,
  add column if not exists online_channels text,
  add column if not exists monthly_capacity text,
  add column if not exists has_wholesale_export_experience boolean,
  add column if not exists shipping_capability text,
  add column if not exists upload_paths text[] not null default '{}',
  add column if not exists lookbook_url text,
  add column if not exists why_join text,
  add column if not exists goals text[] not null default '{}',
  add column if not exists event_interest text;

alter table public.designer_applications
  drop constraint if exists designer_applications_product_category_check,
  drop constraint if exists designer_applications_sku_count_check,
  drop constraint if exists designer_applications_confirms_wholesale_check,
  drop constraint if exists designer_applications_confirms_direct_shipping_check,
  drop constraint if exists designer_applications_check,
  alter column product_category drop not null,
  alter column sku_count drop not null,
  alter column confirms_wholesale drop not null,
  alter column confirms_direct_shipping drop not null;

alter table public.designer_applications
  add constraint designer_applications_categories_check check (categories <@ array['apparel','shoes','accessories','home_decor','art_craft']::text[]),
  add constraint designer_applications_goals_check check (goals <@ array['global_reach','marketing_support','brand_visibility','community']::text[]),
  add constraint designer_applications_shipping_check check (shipping_capability is null or shipping_capability in ('international','needs_support')),
  add constraint designer_applications_event_check check (event_interest is null or event_interest in ('yes','no','tell_me_more')),
  add constraint designer_applications_photo_count_check check (status = 'draft' or upload_path is not null or cardinality(upload_paths) between 3 and 5);

update storage.buckets
set allowed_mime_types = array['image/jpeg','image/png','image/webp']
where id = 'designer-lookbooks';
