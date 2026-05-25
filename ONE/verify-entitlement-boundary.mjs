#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { lotosManifest } from '../packages/registry/dist/index.js';

const root = process.cwd();
const failures = [];
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function pass(id, detail) {
  checks.push({ id, status: 'pass', detail });
}

function fail(id, detail) {
  checks.push({ id, status: 'fail', detail });
  failures.push(`${id}: ${detail}`);
}

function requireFile(relativePath) {
  if (!exists(relativePath)) {
    fail(`file:${relativePath}`, 'required entitlement boundary file is missing');
    return null;
  }

  pass(`file:${relativePath}`, 'present');
  return read(relativePath);
}

function requireMarkers(label, content, markers) {
  if (content === null) {
    return;
  }

  for (const marker of markers) {
    if (!content.includes(marker)) {
      fail(`${label}:${marker}`, 'required marker missing');
    } else {
      pass(`${label}:${marker}`, 'marker present');
    }
  }
}

function requireNoSensitiveConsole(label, content) {
  if (content === null) {
    return;
  }

  const sensitiveConsole = content
    .split(/\r?\n/)
    .some((line) => /console\.(log|error|warn)/.test(line) && /(email|userEmail|ownerEmail|entitlement|token|secret|url)/i.test(line));

  if (sensitiveConsole) {
    fail(`${label}:console`, 'route may print sensitive entitlement context');
  } else {
    pass(`${label}:console`, 'no sensitive console output detected');
  }
}

const grantRoute = requireFile('apps/web/app/api/entitlements/grant/route.ts');
requireMarkers('grant-route', grantRoute, [
  'getServerSession',
  'isOwnerEmail',
  'normalizeEmail',
  'upsertEntitlement',
  'manual_owner_test',
  'manual_owner_paid_recovery',
  'normalizeProvider',
  'allowedTrialDays',
  'recoveryReason',
  'trialDays',
  'createdByOwnerEmail',
]);
requireNoSensitiveConsole('grant-route', grantRoute);

const revokeRoute = requireFile('apps/web/app/api/entitlements/revoke/route.ts');
requireMarkers('revoke-route', revokeRoute, [
  'getServerSession',
  'isOwnerEmail',
  'normalizeEmail',
  'revokeEntitlement',
  'revokeReason',
  'cleanRequiredText',
]);
requireNoSensitiveConsole('revoke-route', revokeRoute);

const lifecycle = requireFile('apps/web/lib/entitlement-lifecycle.ts');
requireMarkers('lifecycle-helper', lifecycle, [
  'EntitlementLifecycleMetadata',
  'trialEndsAt',
  'revokedAt',
  'revokedBy',
  'revokeReason',
  'isEntitlementActive',
  'past_due',
  'manual_recovery',
  'mapEntitlementForVault',
  'buildLifecycleMetadata',
]);

const stateMachine = requireFile('apps/web/lib/entitlement-state-machine.ts');
requireMarkers('state-machine', stateMachine, [
  'decideEntitlementTransition',
  'revoked_requires_explicit_owner_reactivation',
  'paid_recovery_requires_reason_and_evidence',
  'invalid_entitlement_transition',
]);

const entitlements = requireFile('apps/web/lib/entitlements.ts');
requireMarkers('entitlements-helper', entitlements, [
  'listUserEntitlements',
  'listAdminEntitlementsByEmail',
  'revokeEntitlement',
  'isEntitlementActive',
  'decideEntitlementTransition',
  'createdByOwnerEmail',
]);

const restHelper = requireFile('apps/web/lib/entitlements-rest.ts');
requireMarkers('entitlements-rest', restHelper, ['canAccessPremiumFromRows']);

const plansHelper = requireFile('apps/web/lib/plans.ts');
requireMarkers('plans-helper', plansHelper, ['@lotosui/registry', 'registryCommercialPlans']);

const adminPage = requireFile('apps/web/app/admin/entitlements/page.tsx');
requireMarkers('admin-page', adminPage, [
  'isOwnerEmail',
  'EntitlementLookupForm',
  'GrantAccessForm',
  'RevokeAccessForm',
  'Prueba sin pago',
  'Pago confirmado',
  'Revocar acceso',
]);

const vaultPage = requireFile('apps/web/app/vault/page.tsx');
requireMarkers('vault-page', vaultPage, [
  'mapSummaryForVault',
  'Entitlement lifecycle',
  '/admin/entitlements',
]);

const webhookRoute = requireFile('apps/web/app/api/webhooks/lemon/route.ts');
requireMarkers('webhook-route', webhookRoute, [
  'mapLemonWebhookEvent',
  'hasProcessedProviderEvent',
  'recordEntitlementAuditEvent',
  'webhook_applied',
]);
requireNoSensitiveConsole('webhook-route', webhookRoute);

const webhookFixtures = requireFile('apps/web/test/fixtures/lemon/README.md');
requireMarkers('webhook-fixtures', webhookFixtures, [
  'not copied from Lemon',
  'example.test',
  'Do not commit real webhook',
]);

const adminDocs = requireFile('docs/ADMIN_JOURNEY.md');
requireMarkers('admin-docs', adminDocs, [
  'manual_owner_test:<provider>',
  'manual_owner_paid_recovery:<provider>',
  '/api/entitlements/revoke',
  'Google',
]);

const buyerDocs = requireFile('docs/BUYER_JOURNEY.md');
requireMarkers('buyer-docs', buyerDocs, [
  'Google',
  'Manual test access is separate',
  'Paid recovery is also separate',
  'Buyer-facing copy must not imply that Google login alone unlocks premium assets.',
]);

const flowDocs = requireFile('docs/PREMIUM_ENTITLEMENT_FLOW.md');
requireMarkers('flow-docs', flowDocs, [
  'revokedAt',
  'trialEndsAt',
  'manual_owner_test:<provider>',
  'manual_owner_paid_recovery:<provider>',
  'Supabase Migration TODO',
]);

const auditDocs = requireFile('docs/ENTITLEMENT_AUDIT.md');
requireMarkers('audit-docs', auditDocs, [
  'verify:entitlement-boundary',
  'manual_owner_revoke',
  'entitlement_audit_events',
  'Do not log entitlement URLs',
]);

const stagingRunbook = requireFile('docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md');
requireMarkers('staging-runbook', stagingRunbook, [
  'Supabase Backup',
  'Provider Contract Validation',
  'Invalid Signature',
  'Paid Recovery With Evidence',
  'Pass Criteria',
]);

const expectedFlowIds = [
  'paid_checkout',
  'subscription_payment_recovered',
  'manual_owner_test',
  'manual_owner_paid_recovery',
  'manual_owner_revoke',
];

const flowIds = new Set((lotosManifest.entitlementFlows ?? []).map((entry) => entry.id));
for (const id of expectedFlowIds) {
  if (!flowIds.has(id)) {
    fail(`registry-flow:${id}`, 'registry entitlement flow is missing');
  } else {
    pass(`registry-flow:${id}`, 'registered');
  }
}

if (!lotosManifest.routes.ownerOnly.includes('/api/entitlements/revoke')) {
  fail('registry-route:/api/entitlements/revoke', 'revoke route must be ownerOnly');
} else {
  pass('registry-route:/api/entitlements/revoke', 'ownerOnly');
}

if (!lotosManifest.validation.includes('pnpm run verify:entitlement-boundary')) {
  fail('registry-validation:verify:entitlement-boundary', 'registry validation must include entitlement boundary gate');
} else {
  pass('registry-validation:verify:entitlement-boundary', 'listed');
}

for (const command of [
  'pnpm run verify:webhook-contracts',
  'pnpm run verify:entitlement-state-machine',
  'pnpm run verify:admin-lifecycle',
  'pnpm run verify:vault-lifecycle',
  'pnpm run verify:rls-policy-plan',
]) {
  if (!lotosManifest.validation.includes(command)) {
    fail(`registry-validation:${command}`, 'registry validation must include Phase 5 lifecycle gate');
  } else {
    pass(`registry-validation:${command}`, 'listed');
  }
}

const entitlementsAi = exists('.ai/lotos.entitlements.json')
  ? JSON.parse(read('.ai/lotos.entitlements.json'))
  : null;

if (!entitlementsAi) {
  fail('generated-ai:entitlements', '.ai/lotos.entitlements.json is missing');
} else if (!Array.isArray(entitlementsAi.entitlementFlows)) {
  fail('generated-ai:entitlementFlows', 'generated entitlement AI manifest is missing flows');
} else {
  pass('generated-ai:entitlementFlows', 'present');
}

const commercialAi = exists('.ai/lotos.commercial.json')
  ? JSON.parse(read('.ai/lotos.commercial.json'))
  : null;

if (!commercialAi) {
  fail('generated-ai:commercial', '.ai/lotos.commercial.json is missing');
} else if (!Array.isArray(commercialAi.entitlementFlows)) {
  fail('generated-ai:commercial entitlementFlows', 'commercial AI manifest is missing flows');
} else {
  pass('generated-ai:commercial entitlementFlows', 'present');
}

const checklist = {
  generatedFrom: 'ONE/verify-entitlement-boundary.mjs',
  generatedAt: 'static',
  status: failures.length === 0 ? 'pass' : 'fail',
  checks,
  notes: [
    'No secret values are printed by this verifier.',
    'Manual test grants are temporary and separate from paid checkout.',
    'Paid recovery requires owner review of payment evidence.',
    'Revoked or expired entitlements must not unlock premium access.',
  ],
};

fs.mkdirSync(path.join(root, '.release'), { recursive: true });
fs.writeFileSync(
  path.join(root, '.release', 'entitlement-audit-checklist.json'),
  `${JSON.stringify(checklist, null, 2)}\n`
);

if (failures.length > 0) {
  console.error('verify:entitlement-boundary failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:entitlement-boundary OK (${checks.length} checks)`);
