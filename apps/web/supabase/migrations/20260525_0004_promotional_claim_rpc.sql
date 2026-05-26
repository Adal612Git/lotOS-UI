create extension if not exists pgcrypto;

create table if not exists public.access_grant_events (
  id uuid primary key default gen_random_uuid(),
  grant_id uuid references public.access_grants(id) on delete set null,
  actor_user_id text,
  event_type text not null check (
    event_type in (
      'created',
      'claimed',
      'revoked',
      'expired_check',
      'max_claims_reached',
      'failed_claim',
      'updated'
    )
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (jsonb_typeof(metadata) = 'object')
);

create index if not exists access_grant_events_grant_idx on public.access_grant_events(grant_id);
create index if not exists access_grant_events_type_created_idx on public.access_grant_events(event_type, created_at desc);
create index if not exists access_grant_events_created_idx on public.access_grant_events(created_at desc);

alter table public.access_grant_events enable row level security;

comment on table public.access_grant_events is 'Sanitized audit events for promotional grants. Do not store raw promo codes or raw PII.';
comment on column public.access_grant_events.actor_user_id is 'Optional app/user reference. Prefer opaque ids or hashes; do not store raw promo codes.';
comment on column public.access_grant_events.metadata is 'Sanitized JSON metadata for grant lifecycle events. Raw codes, tokens, cookies, and secrets are forbidden.';

create or replace function public.claim_promotional_access_grant(
  p_code_hash text,
  p_email_normalized text,
  p_source_ip_hash text default null,
  p_user_agent_hash text default null
)
returns table (
  status text,
  grant_id uuid,
  claim_id uuid,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_grant public.access_grants%rowtype;
  v_claim public.access_grant_claims%rowtype;
  v_now timestamptz := now();
  v_email text := lower(trim(coalesce(p_email_normalized, '')));
  v_actor_hash text;
  v_active_claim_count integer;
  v_claim_expires_at timestamptz;
begin
  if p_code_hash is null or length(trim(p_code_hash)) <> 64 or v_email = '' then
    status := 'invalid_code';
    grant_id := null;
    claim_id := null;
    expires_at := null;
    return next;
    return;
  end if;

  v_actor_hash := encode(digest(v_email, 'sha256'), 'hex');

  select *
    into v_grant
    from public.access_grants
   where code_hash = lower(trim(p_code_hash))
   for update;

  if not found then
    insert into public.access_grant_events (grant_id, actor_user_id, event_type, metadata)
    values (
      null,
      v_actor_hash,
      'failed_claim',
      jsonb_build_object('reason', 'invalid_code')
    );

    status := 'invalid_code';
    grant_id := null;
    claim_id := null;
    expires_at := null;
    return next;
    return;
  end if;

  if v_grant.revoked_at is not null then
    insert into public.access_grant_events (grant_id, actor_user_id, event_type, metadata)
    values (
      v_grant.id,
      v_actor_hash,
      'failed_claim',
      jsonb_build_object('reason', 'revoked')
    );

    status := 'revoked';
    grant_id := v_grant.id;
    claim_id := null;
    expires_at := v_grant.expires_at;
    return next;
    return;
  end if;

  if v_grant.starts_at is not null and v_grant.starts_at > v_now then
    insert into public.access_grant_events (grant_id, actor_user_id, event_type, metadata)
    values (
      v_grant.id,
      v_actor_hash,
      'failed_claim',
      jsonb_build_object('reason', 'not_started')
    );

    status := 'invalid_code';
    grant_id := v_grant.id;
    claim_id := null;
    expires_at := v_grant.expires_at;
    return next;
    return;
  end if;

  if v_grant.expires_at is not null and v_grant.expires_at <= v_now then
    insert into public.access_grant_events (grant_id, actor_user_id, event_type, metadata)
    values (
      v_grant.id,
      v_actor_hash,
      'expired_check',
      jsonb_build_object('reason', 'grant_expired')
    );

    status := 'expired';
    grant_id := v_grant.id;
    claim_id := null;
    expires_at := v_grant.expires_at;
    return next;
    return;
  end if;

  select *
    into v_claim
    from public.access_grant_claims
   where grant_id = v_grant.id
     and email_normalized = v_email
   for update;

  if found then
    v_claim_expires_at := least(coalesce(v_claim.expires_at, v_grant.expires_at), coalesce(v_grant.expires_at, v_claim.expires_at));

    if v_claim.revoked_at is not null then
      status := 'revoked';
    elsif v_claim_expires_at is not null and v_claim_expires_at <= v_now then
      status := 'expired';
    else
      status := 'already_claimed';
    end if;

    insert into public.access_grant_events (grant_id, actor_user_id, event_type, metadata)
    values (
      v_grant.id,
      v_actor_hash,
      'failed_claim',
      jsonb_build_object('reason', status)
    );

    grant_id := v_grant.id;
    claim_id := v_claim.id;
    expires_at := v_claim_expires_at;
    return next;
    return;
  end if;

  select count(*)
    into v_active_claim_count
    from public.access_grant_claims
   where grant_id = v_grant.id
     and revoked_at is null
     and (expires_at is null or expires_at > v_now);

  v_active_claim_count := greatest(v_active_claim_count, coalesce(v_grant.claim_count, 0));

  if v_grant.max_claims is not null and v_active_claim_count >= v_grant.max_claims then
    insert into public.access_grant_events (grant_id, actor_user_id, event_type, metadata)
    values (
      v_grant.id,
      v_actor_hash,
      'max_claims_reached',
      jsonb_build_object('maxClaims', v_grant.max_claims, 'claimCount', v_active_claim_count)
    );

    status := 'max_claims_reached';
    grant_id := v_grant.id;
    claim_id := null;
    expires_at := v_grant.expires_at;
    return next;
    return;
  end if;

  insert into public.access_grant_claims (
    grant_id,
    email_normalized,
    expires_at,
    source_ip_hash,
    user_agent_hash
  )
  values (
    v_grant.id,
    v_email,
    v_grant.expires_at,
    p_source_ip_hash,
    p_user_agent_hash
  )
  returning * into v_claim;

  update public.access_grants
     set claim_count = v_active_claim_count + 1,
         updated_at = v_now
   where id = v_grant.id;

  insert into public.access_grant_events (grant_id, actor_user_id, event_type, metadata)
  values (
    v_grant.id,
    v_actor_hash,
    'claimed',
    jsonb_build_object('grantType', v_grant.grant_type, 'planKey', v_grant.plan_key)
  );

  status := 'success';
  grant_id := v_grant.id;
  claim_id := v_claim.id;
  expires_at := v_claim.expires_at;
  return next;
  return;
exception
  when unique_violation then
    select *
      into v_claim
      from public.access_grant_claims
     where grant_id = v_grant.id
       and email_normalized = v_email;

    status := 'already_claimed';
    grant_id := v_grant.id;
    claim_id := v_claim.id;
    expires_at := coalesce(v_claim.expires_at, v_grant.expires_at);
    return next;
    return;
end;
$$;

revoke all on function public.claim_promotional_access_grant(text, text, text, text) from public;
grant execute on function public.claim_promotional_access_grant(text, text, text, text) to service_role;

comment on function public.claim_promotional_access_grant(text, text, text, text) is 'Transactional promotional claim RPC. Locks the grant row, validates state, inserts an idempotent claim, and increments claim_count atomically without exposing raw promo codes.';
