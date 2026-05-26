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

const requiredFiles = [
  'apps/web/app/free/page.tsx',
  'apps/web/app/claim/page.tsx',
  'apps/web/app/claim/claim-client.tsx',
  'apps/web/app/account/access/page.tsx',
  'apps/web/app/team-access/free-grants/page.tsx',
  'apps/web/app/api/promo/claim/route.ts',
  'apps/web/app/api/promo/grants/route.ts',
  'apps/web/app/access-ui.tsx',
  'apps/web/lib/promo-grants.ts',
  'apps/web/lib/access-resolver.ts',
  'apps/web/supabase/migrations/20260525_0003_promotional_access_grants.sql',
];

for (const relativePath of requiredFiles) {
  if (!exists(relativePath)) {
    fail(`Missing free access file: ${relativePath}`);
  }
}

if (failures.length === 0) {
  const resolver = read('apps/web/lib/access-resolver.ts');
  const resolverMarkers = [
    'owner_bypass',
    'paid',
    'promo_grant',
    'qa_phone',
    'free_default',
    'anonymous',
    'listUserPromoGrantAccess',
    'promoGrants',
  ];

  for (const marker of resolverMarkers) {
    if (!resolver.includes(marker)) {
      fail(`Access resolver missing marker: ${marker}`);
    }
  }

  if (!(resolver.indexOf("source: 'owner_bypass'") < resolver.indexOf('Promise.allSettled'))) {
    fail('Owner bypass should be resolved before paid or promotional storage checks.');
  }

  const promo = read('apps/web/lib/promo-grants.ts');
  const promoMarkers = [
    'FREE_FOUNDATION',
    'PRO_TRIAL',
    'PRO_GIFT',
    'FULL_GIFT',
    'QA_ACCESS',
    'hashPromoCode',
    'max_claims_reached',
    'already_claimed',
    'revoked',
    'expired',
    'configuration_required',
  ];

  for (const marker of promoMarkers) {
    if (!promo.includes(marker)) {
      fail(`Promo grant helper missing marker: ${marker}`);
    }
  }

  const migration = read('apps/web/supabase/migrations/20260525_0003_promotional_access_grants.sql');
  for (const marker of ['access_grants', 'access_grant_claims', 'code_hash', 'enable row level security', 'unique (grant_id, email_normalized)']) {
    if (!migration.includes(marker)) {
      fail(`Promo migration missing marker: ${marker}`);
    }
  }

  const claimRoute = read('apps/web/app/api/promo/claim/route.ts');
  for (const marker of ['getServerSession', 'login_required', 'claimPromoCodeForEmail']) {
    if (!claimRoute.includes(marker)) {
      fail(`Claim API missing marker: ${marker}`);
    }
  }

  const downloadRoute = read('apps/web/app/api/download/[asset]/route.ts');
  for (const marker of ['resolveCurrentAccess', 'accessDecision.allowed', 'accessDecision.capabilities.downloads']) {
    if (!downloadRoute.includes(marker)) {
      fail(`Premium download route missing central resolver marker: ${marker}`);
    }
  }

  const freePage = read('apps/web/app/free/page.tsx');
  for (const marker of ['Foundation', 'Pro Studio', 'Full Signature', 'Pases promocionales', '/claim', '/demo/student-control']) {
    if (!freePage.includes(marker)) {
      fail(`Free page missing marker: ${marker}`);
    }
  }

  const accountPage = read('apps/web/app/account/access/page.tsx');
  if (!accountPage.includes('AccessSummaryCard') || !accountPage.includes('premium')) {
    fail('Account access page must show summarized access and premium boundary copy.');
  }
}

if (failures.length > 0) {
  console.error('verify:free-access failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:free-access OK (${requiredFiles.length} files checked)`);
