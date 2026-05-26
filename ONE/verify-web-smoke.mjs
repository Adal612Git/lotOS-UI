#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const routeFiles = [
  'apps/web/app/page.tsx',
  'apps/web/app/ai/page.tsx',
  'apps/web/app/templates/page.tsx',
  'apps/web/app/pricing/page.tsx',
  'apps/web/app/free/page.tsx',
  'apps/web/app/claim/page.tsx',
  'apps/web/app/account/access/page.tsx',
  'apps/web/app/team-access/free-grants/page.tsx',
  'apps/web/app/design-lab/page.tsx',
  'apps/web/app/vault/page.tsx',
  'apps/web/app/admin/entitlements/page.tsx',
  'apps/web/app/grant-access-form.tsx',
  'apps/web/app/checkout/[plan]/page.tsx',
  'apps/web/app/api/download/[asset]/route.ts',
  'apps/web/app/api/entitlements/grant/route.ts',
  'apps/web/app/api/entitlements/revoke/route.ts',
  'apps/web/app/api/entitlements/lookup/route.ts',
  'apps/web/app/api/promo/claim/route.ts',
  'apps/web/app/api/promo/grants/route.ts',
  'apps/web/app/api/webhooks/lemon/route.ts',
  'apps/web/app/loading.tsx',
  'apps/web/app/not-found.tsx',
  'apps/web/lib/seo.ts',
  'apps/web/lib/promo-grants.ts',
  'apps/web/lib/entitlement-lifecycle.ts',
  'apps/web/lib/entitlement-audit.ts',
  'apps/web/lib/webhooks/lemon-event-mapper.ts',
];

for (const relativePath of routeFiles) {
  if (!exists(relativePath)) {
    fail(`Missing critical web smoke file: ${relativePath}`);
  }
}

if (failures.length === 0) {
  const checkout = read('apps/web/app/checkout/[plan]/page.tsx');
  if (!checkout.includes('getServerSession') || !checkout.includes('buildLemonCheckoutUrl') || !checkout.includes('redirect(')) {
    fail('Checkout route must require session and redirect to managed checkout.');
  }

  const download = read('apps/web/app/api/download/[asset]/route.ts');
  for (const marker of ['resolveCurrentAccess', 'accessDecision.allowed', 'accessDecision.capabilities.downloads', 'Cache-Control', 'private, no-store', 'X-Content-Type-Options']) {
    if (!download.includes(marker)) {
      fail(`Download route is missing protected download marker: ${marker}`);
    }
  }

  const accessResolver = read('apps/web/lib/access-resolver.ts');
  for (const marker of ['getServerSession', 'listUserPlans', 'listUserEntitlements', 'listUserPromoGrantAccess', 'isOwnerEmail', 'getActiveTesterAccess', 'accessSatisfies']) {
    if (!accessResolver.includes(marker)) {
      fail(`Central access resolver is missing marker: ${marker}`);
    }
  }

  const promoGrants = read('apps/web/lib/promo-grants.ts');
  for (const marker of ['hashPromoCode', 'claimPromoCodeForEmail', 'max_claims', 'revoked_at', 'expires_at', 'listUserPromoGrantAccess']) {
    if (!promoGrants.includes(marker)) {
      fail(`Promo grant helper is missing marker: ${marker}`);
    }
  }

  const claimRoute = read('apps/web/app/api/promo/claim/route.ts');
  for (const marker of ['getServerSession', 'claimPromoCodeForEmail', 'login_required']) {
    if (!claimRoute.includes(marker)) {
      fail(`Promo claim route is missing marker: ${marker}`);
    }
  }

  const grant = read('apps/web/app/api/entitlements/grant/route.ts');
  for (const marker of ['isOwnerEmail', 'upsertEntitlement', 'manual_owner_test', 'manual_owner_paid_recovery', 'trialDays', 'recoveryReason']) {
    if (!grant.includes(marker)) {
      fail(`Manual grant route is missing owner-only grant marker: ${marker}`);
    }
  }

  const revoke = read('apps/web/app/api/entitlements/revoke/route.ts');
  for (const marker of ['isOwnerEmail', 'revokeEntitlement', 'revokeReason', 'cleanRequiredText']) {
    if (!revoke.includes(marker)) {
      fail(`Manual revoke route is missing owner-only revoke marker: ${marker}`);
    }
  }

  const admin = read('apps/web/app/admin/entitlements/page.tsx');
  for (const marker of ['isOwnerEmail', 'EntitlementLookupForm', 'GrantAccessForm', 'RevokeAccessForm', 'Prueba sin pago', 'Normal paid unlock', 'Revocar acceso']) {
    if (!admin.includes(marker)) {
      fail(`Entitlement admin page is missing marker: ${marker}`);
    }
  }

  const grantForm = read('apps/web/app/grant-access-form.tsx');
  for (const marker of ['grantMode', 'test', 'paid_recovery', 'trialDays', 'RevokeAccessForm', 'EntitlementLookupForm']) {
    if (!grantForm.includes(marker)) {
      fail(`Grant form is missing manual grant mode marker: ${marker}`);
    }
  }

  const webhook = read('apps/web/app/api/webhooks/lemon/route.ts');
  for (const marker of ['timingSafeEqual', 'LEMON_WEBHOOK_SECRET', 'upsertEntitlement', 'isSupportedEvent', 'mapLemonWebhookEvent']) {
    if (!webhook.includes(marker)) {
      fail(`Lemon webhook route is missing marker: ${marker}`);
    }
  }
}

if (failures.length > 0) {
  console.error('verify:web-smoke failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:web-smoke OK (${routeFiles.length} critical files checked)`);
