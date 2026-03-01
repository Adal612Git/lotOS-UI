create table if not exists public.entitlements (
  id bigserial primary key,
  user_email text not null,
  plan text not null check (plan in ('free', 'solo', 'pro', 'launch_pack')),
  granted_at timestamptz not null default timezone('utc', now()),
  source text not null,
  metadata jsonb not null default '{}'::jsonb
);

create unique index if not exists entitlements_user_email_plan_key
  on public.entitlements (user_email, plan);

create index if not exists entitlements_user_email_idx
  on public.entitlements (user_email);
