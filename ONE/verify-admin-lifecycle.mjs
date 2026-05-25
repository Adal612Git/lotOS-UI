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

function requireMarkers(label, relativePath, markers) {
  if (!exists(relativePath)) {
    fail(`${label}: missing ${relativePath}`);
    return '';
  }
  const content = read(relativePath);
  for (const marker of markers) {
    if (!content.includes(marker)) {
      fail(`${label}: missing marker ${marker}`);
    }
  }
  return content;
}

const adminPage = requireMarkers('admin-page', 'apps/web/app/admin/entitlements/page.tsx', [
  'getServerSession',
  'isOwnerEmail',
  'EntitlementLookupForm',
  'GrantAccessForm',
  'RevokeAccessForm',
]);

requireMarkers('grant-access-form', 'apps/web/app/grant-access-form.tsx', [
  'evidenceReviewed',
  'recoveryReason',
]);

for (const [label, route, markers] of [
  ['lookup-route', 'apps/web/app/api/entitlements/lookup/route.ts', ['getServerSession', 'isOwnerEmail', 'listAdminEntitlementsByEmail']],
  ['grant-route', 'apps/web/app/api/entitlements/grant/route.ts', ['getServerSession', 'isOwnerEmail', 'manual_owner_test', 'manual_owner_paid_recovery', 'evidenceReviewed', 'recordEntitlementAuditEvent']],
  ['revoke-route', 'apps/web/app/api/entitlements/revoke/route.ts', ['getServerSession', 'isOwnerEmail', 'revokeEntitlement', 'revokeReason', 'recordEntitlementAuditEvent']],
]) {
  const content = requireMarkers(label, route, markers);
  if (/console\.(log|warn|error)/.test(content) && /(email|secret|token|entitlement|url)/i.test(content)) {
    fail(`${label}: route may print sensitive entitlement details.`);
  }
}

const registry = requireMarkers('registry', 'packages/registry/src/lotos.manifest.ts', [
  "'/admin/entitlements'",
  "'/api/entitlements/grant'",
  "'/api/entitlements/revoke'",
  "'/api/entitlements/lookup'",
  'manual_owner_paid_recovery',
]);

if (!registry.includes('ownerOnly: true')) {
  fail('registry: manual entitlement flows must be ownerOnly.');
}

requireMarkers('admin-docs', 'docs/ADMIN_JOURNEY.md', [
  'paid recovery',
  'evidence',
  'revocation',
  'Google',
]);

if (adminPage.includes('Only client-side')) {
  fail('admin-page: owner checks must be server-side, not only client-side.');
}

if (failures.length > 0) {
  console.error('verify:admin-lifecycle failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:admin-lifecycle OK');
