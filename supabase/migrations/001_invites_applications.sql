-- Run in Supabase SQL Editor or via Supabase CLI.
-- Service role from Next.js bypasses RLS; anon has no access.

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  inviter_clerk_user_id text not null,
  invitee_email text not null,
  invitee_full_name text not null,
  pitch text not null,
  token text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'submitted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists invites_inviter_idx on public.invites (inviter_clerk_user_id);
create index if not exists invites_token_idx on public.invites (token);
create index if not exists invites_inviter_status_idx
  on public.invites (inviter_clerk_user_id, status);

create table if not exists public.invite_applications (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references public.invites (id) on delete cascade,
  applicant_clerk_user_id text not null,
  shipping_address_line1 text not null,
  shipping_address_line2 text,
  shipping_city text not null,
  shipping_postal_code text not null,
  shipping_country text not null,
  phone_country_code text not null,
  phone_number text not null,
  projects_description text not null,
  linkedin_url text not null,
  tshirt_size text not null
    check (tshirt_size in ('XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL')),
  created_at timestamptz not null default now(),
  unique (invite_id)
);

create index if not exists invite_applications_applicant_idx
  on public.invite_applications (applicant_clerk_user_id);

alter table public.invites enable row level security;
alter table public.invite_applications enable row level security;

-- No policies: only the service role (used server-side) can access these tables.
