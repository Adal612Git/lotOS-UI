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

const files = [
  'apps/web/supabase/migrations/20260519_0002_entitlement_audit_events.sql',
  'apps/web/lib/entitlement-audit.ts',
  'apps/web/app/api/entitlements/grant/route.ts',
  'apps/web/app/api/entitlements/revoke/route.ts',
  'apps/web/app/api/webhooks/lemon/route.ts',
  'docs/ENTITLEMENT_AUDIT.md',
];

for (const file of files) {
  if (!exists(file)) {
    fail(`Missing entitlement audit file: ${file}`);
  }
}

if (exists('apps/web/lib/entitlement-audit.ts')) {
  const helper = read('apps/web/lib/entitlement-audit.ts');
  for (const marker of [
    'hashActorRef',
    'ENTITLEMENT_AUDIT_HASH_PEPPER',
    'sanitizeAuditMetadata',
    'recordEntitlementAuditEvent',
    'hasProcessedProviderEvent',
    'forbiddenMetadataKey',
  ]) {
    if (!helper.includes(marker)) {
      fail(`Audit helper is missing marker: ${marker}`);
    }
  }
}

for (const routeFile of [
  'apps/web/app/api/entitlements/grant/route.ts',
  'apps/web/app/api/entitlements/revoke/route.ts',
  'apps/web/app/api/webhooks/lemon/route.ts',
]) {
  if (!exists(routeFile)) {
    continue;
  }
  const source = read(routeFile);
  if (!source.includes('recordEntitlementAuditEvent')) {
    fail(`${routeFile} must record entitlement audit events.`);
  }
}

if (exists('docs/ENTITLEMENT_AUDIT.md')) {
  const docs = read('docs/ENTITLEMENT_AUDIT.md');
  for (const marker of ['entitlement_audit_events', 'actor_ref_hash', 'retention', 'rollback']) {
    if (!docs.toLowerCase().includes(marker.toLowerCase())) {
      fail(`Entitlement audit docs are missing marker: ${marker}`);
    }
  }
}

if (failures.length > 0) {
  console.error('verify:entitlement-audit failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:entitlement-audit OK');
