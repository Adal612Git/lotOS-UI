#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
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

function requireFile(relativePath) {
  if (!exists(relativePath)) {
    fail(`Missing file: ${relativePath}`);
    return '';
  }

  return read(relativePath);
}

function requireMarkers(label, content, markers) {
  for (const marker of markers) {
    if (!content.includes(marker)) {
      fail(`${label} missing marker: ${marker}`);
    }
  }
}

const migration = requireFile('apps/web/supabase/migrations/20260525_0004_promotional_claim_rpc.sql');
requireMarkers('promo RPC migration', migration, [
  'create table if not exists public.access_grant_events',
  'create or replace function public.claim_promotional_access_grant',
  'for update',
  'v_active_claim_count',
  'claim_count = v_active_claim_count + 1',
  'unique_violation',
  'invalid_code',
  'expired',
  'revoked',
  'max_claims_reached',
  'already_claimed',
  'grant execute on function public.claim_promotional_access_grant',
]);

for (const forbidden of ['insert into public.access_grants', 'CREATOR-', 'FOUNDER-', 'FULL-', 'gmail.com', 'hotmail.com']) {
  if (migration.toLowerCase().includes(forbidden.toLowerCase())) {
    fail(`promo RPC migration includes forbidden public/data marker: ${forbidden}`);
  }
}

const helper = requireFile('apps/web/lib/promo-grants.ts');
requireMarkers('promo helper', helper, [
  'buildRpcEndpoint',
  'claim_promotional_access_grant',
  'claimPromoCodeViaRpc',
  'hashPromoCode',
  'recordPromoGrantEvent',
  'listPromoGrantEventsForOwner',
  'claimPromoCodeForEmailLegacy',
]);

const claimFunctionIndex = helper.indexOf('export async function claimPromoCodeForEmail(');
const rpcCallIndex = helper.indexOf('return claimPromoCodeViaRpc', claimFunctionIndex);
if (claimFunctionIndex === -1 || rpcCallIndex === -1) {
  fail('claimPromoCodeForEmail must call the transactional RPC path.');
}

const adminRoute = requireFile('apps/web/app/api/promo/grants/route.ts');
requireMarkers('promo grants API', adminRoute, [
  'isOwnerEmail',
  'listPromoGrantEventsForOwner',
  'createPromoGrant',
  'revokePromoGrant',
]);

const adminClient = requireFile('apps/web/app/team-access/free-grants/free-grants-client.tsx');
requireMarkers('promo grants admin UI', adminClient, [
  'Creator Pass 14',
  'Founder Pass 30',
  'Studio Ally',
  'Full Signature Gift',
  'Guarda este codigo/link ahora',
  'RPC transaccional',
  'maxClaims debe ser 1 o mayor',
]);

if (failures.length > 0) {
  console.error('verify:promo-rpc failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:promo-rpc OK (transactional claim RPC, event audit, and admin controls present)');
