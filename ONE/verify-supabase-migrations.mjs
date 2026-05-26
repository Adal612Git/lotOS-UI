#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function stripSqlComments(sql) {
  return sql
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');
}

function requireMarkers(label, content, markers) {
  const normalizedContent = content.toLowerCase();
  for (const marker of markers) {
    if (!normalizedContent.includes(marker.toLowerCase())) {
      fail(`${label} is missing marker: ${marker}`);
    }
  }
}

function requireSafeSql(relativePath, content) {
  const stripped = stripSqlComments(content).toLowerCase();
  const forbidden = [
    /\bdrop\s+table\b/,
    /\bdrop\s+schema\b/,
    /\bdrop\s+column\b/,
    /\btruncate\b/,
    /\bdelete\s+from\s+public\.entitlements\b/,
    /\balter\s+table\b[\s\S]{0,160}\brename\b/,
    /\bdisable\s+row\s+level\s+security\b/,
    /\bcascade\b/,
  ];

  for (const pattern of forbidden) {
    if (pattern.test(stripped)) {
      fail(`${relativePath} contains destructive SQL pattern: ${pattern}`);
    }
  }
}

const migrationDir = path.join(root, 'apps', 'web', 'supabase', 'migrations');
if (!fs.existsSync(migrationDir)) {
  fail('Missing apps/web/supabase/migrations directory.');
}

const migrationFiles = fs.existsSync(migrationDir)
  ? fs.readdirSync(migrationDir).filter((entry) => entry.endsWith('.sql')).sort()
  : [];

for (const file of migrationFiles) {
  if (!/^\d{8}_\d{4}_[a-z0-9_]+\.sql$/.test(file)) {
    fail(`Migration filename must use YYYYMMDD_NNNN_slug.sql: ${file}`);
  }
}

const sorted = [...migrationFiles].sort();
if (migrationFiles.join('\n') !== sorted.join('\n')) {
  fail('Migration files are not lexicographically ordered.');
}

const lifecyclePath = 'apps/web/supabase/migrations/20260519_0001_entitlements_lifecycle.sql';
const auditPath = 'apps/web/supabase/migrations/20260519_0002_entitlement_audit_events.sql';
const promoGrantsPath = 'apps/web/supabase/migrations/20260525_0003_promotional_access_grants.sql';
const promoClaimRpcPath = 'apps/web/supabase/migrations/20260525_0004_promotional_claim_rpc.sql';
const docsPath = 'docs/SUPABASE_LOCAL_DRY_RUN.md';

for (const relativePath of [lifecyclePath, auditPath, promoGrantsPath, promoClaimRpcPath, docsPath]) {
  if (!exists(relativePath)) {
    fail(`Missing Supabase migration support file: ${relativePath}`);
  }
}

if (migrationFiles.indexOf(path.basename(lifecyclePath)) > migrationFiles.indexOf(path.basename(auditPath))) {
  fail('Audit migration must run after lifecycle migration.');
}

if (exists(lifecyclePath)) {
  const lifecycle = read(lifecyclePath);
  requireSafeSql(lifecyclePath, lifecycle);
  requireMarkers('Lifecycle migration', lifecycle, [
    'create table if not exists public.entitlements',
    "metadata jsonb not null default '{}'::jsonb",
    'add column if not exists email_normalized text',
    'add column if not exists provider text',
    'add column if not exists provider_customer_id text',
    'add column if not exists provider_subscription_id text',
    'add column if not exists provider_order_id text',
    'add column if not exists provider_event_id_last text',
    'add column if not exists status text',
    'add column if not exists trial_ends_at timestamptz',
    'add column if not exists expires_at timestamptz',
    'add column if not exists revoked_at timestamptz',
    'add column if not exists revoked_by text',
    'add column if not exists revoke_reason text',
    'add column if not exists internal_note text',
    'add column if not exists created_by_owner_email text',
    'add column if not exists created_at timestamptz',
    'add column if not exists updated_at timestamptz',
    'status in (',
    "'active'",
    "'trialing'",
    "'past_due'",
    "'paused'",
    "'cancelled'",
    "'expired'",
    "'revoked'",
    "'manual_recovery'",
    'entitlements_user_email_plan_key',
    'entitlements_email_normalized_idx',
    'entitlements_status_idx',
    'entitlements_expires_at_idx',
    'entitlements_revoked_at_idx',
    'entitlements_provider_subscription_id_idx',
    'entitlements_provider_event_id_last_idx',
    'entitlements_provider_subscription_uidx',
    'entitlements_provider_order_uidx',
    'create or replace function public.set_entitlements_updated_at',
    'new.updated_at = timezone',
    'create trigger set_entitlements_updated_at',
    'Rollback notes',
  ]);
}

if (exists(auditPath)) {
  const audit = read(auditPath);
  requireSafeSql(auditPath, audit);
  requireMarkers('Audit migration', audit, [
    'create table if not exists public.entitlement_audit_events',
    'entitlement_id bigint references public.entitlements(id) on delete set null',
    "actor_type text not null check (actor_type in ('owner', 'webhook', 'system'))",
    'actor_ref_hash text',
    'provider_event_id text',
    "metadata jsonb not null default '{}'::jsonb",
    "check (jsonb_typeof(metadata) = 'object')",
    'entitlement_audit_events_entitlement_id_idx',
    'entitlement_audit_events_provider_event_id_idx',
    'entitlement_audit_events_provider_event_final_uidx',
    "action in ('webhook_applied', 'webhook_ignored')",
    'entitlement_audit_events_created_at_idx',
    'entitlement_audit_events_action_created_at_idx',
    'enable row level security',
    'Append-only sanitized audit trail',
    'Rollback notes',
  ]);

  for (const forbidden of [' buyer_email ', ' owner_email ', ' email text ']) {
    if (audit.includes(forbidden)) {
      fail(`Audit migration must not add raw email column marker: ${forbidden.trim()}`);
    }
  }
}

if (exists(promoGrantsPath)) {
  const promoGrants = read(promoGrantsPath);
  requireSafeSql(promoGrantsPath, promoGrants);
  requireMarkers('Promotional grants migration', promoGrants, [
    'create table if not exists public.access_grants',
    'create table if not exists public.access_grant_claims',
    'code_hash text not null unique',
    "grant_type in ('FREE_FOUNDATION', 'PRO_TRIAL', 'PRO_GIFT', 'FULL_GIFT', 'QA_ACCESS')",
    'unique (grant_id, email_normalized)',
    'enable row level security',
    'Raw promo codes are never stored',
  ]);
}

if (exists(promoClaimRpcPath)) {
  const promoClaimRpc = read(promoClaimRpcPath);
  requireSafeSql(promoClaimRpcPath, promoClaimRpc);
  requireMarkers('Promotional claim RPC migration', promoClaimRpc, [
    'create table if not exists public.access_grant_events',
    'create or replace function public.claim_promotional_access_grant',
    'for update',
    'v_active_claim_count',
    'max_claims_reached',
    'already_claimed',
    'invalid_code',
    'grant execute on function public.claim_promotional_access_grant',
    'Raw codes, tokens, cookies, and secrets are forbidden',
  ]);
}

if (exists(docsPath)) {
  const docs = read(docsPath);
  requireMarkers('Supabase local dry-run docs', docs, [
    'local static dry-run',
    'does not apply migrations',
    'Supabase CLI is optional',
    'staging first',
    'backup',
    'rollback',
  ]);
}

if (failures.length > 0) {
  console.error('verify:supabase-migrations failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:supabase-migrations OK (ordered lifecycle/audit migrations, indexes, constraints, and dry-run docs)');
