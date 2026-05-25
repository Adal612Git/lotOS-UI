#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { lotosManifest } from '../packages/registry/dist/index.js';

const root = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const docs = [
  'docs/PREMIUM_ENTITLEMENT_FLOW.md',
  'docs/BUYER_JOURNEY.md',
  'docs/ADMIN_JOURNEY.md',
  'docs/COMMERCIAL_LAUNCH_CHECKLIST.md',
  'docs/RELEASE_PROCESS.md',
  'docs/HUMAN_RELEASE_ACTIONS.md',
  'docs/SUPABASE_ENTITLEMENT_SCHEMA.md',
  'docs/SUPABASE_LOCAL_DRY_RUN.md',
  'docs/SUPABASE_RLS_POLICY_PLAN.md',
  'docs/WEBHOOK_LIFECYCLE.md',
  'docs/LEMON_FIXTURES.md',
  'docs/ENTITLEMENT_AUDIT.md',
  'docs/STAGING_LIFECYCLE_TEST_RUNBOOK.md',
];

for (const doc of docs) {
  if (!fs.existsSync(path.join(root, doc))) {
    fail(`Missing commercial lifecycle doc: ${doc}`);
  }
}

const requiredDocMarkers = [
  'payment failed',
  'cancel',
  'revocation',
  'paid recovery',
  'Supabase',
  'Lemon',
  'wide sales',
  'staging',
];
const aggregateDocs = docs
  .filter((entry) => fs.existsSync(path.join(root, entry)))
  .map(read)
  .join('\n')
  .toLowerCase();

for (const marker of requiredDocMarkers) {
  if (!aggregateDocs.includes(marker.toLowerCase())) {
    fail(`Commercial lifecycle docs are missing aggregate marker: ${marker}`);
  }
}

const flowIds = new Set((lotosManifest.entitlementFlows ?? []).map((entry) => entry.id));
for (const flowId of [
  'paid_checkout',
  'subscription_payment_failed',
  'subscription_payment_recovered',
  'subscription_paused',
  'subscription_cancelled',
  'subscription_expired',
  'manual_owner_test',
  'manual_owner_paid_recovery',
  'manual_owner_revoke',
]) {
  if (!flowIds.has(flowId)) {
    fail(`Registry entitlement flow missing: ${flowId}`);
  }
}

const lifecycleValidation = lotosManifest.releaseReadiness?.lifecycleValidation;
if (!lifecycleValidation) {
  fail('Registry release readiness is missing lifecycleValidation.');
} else {
  for (const [key, expected] of [
    ['migrations_local_validated', true],
    ['webhook_contracts_validated', true],
    ['audit_validated', true],
    ['entitlement_boundary_validated', true],
    ['supabase_remote_validated', false],
    ['lemon_remote_validated', false],
    ['wide_sales_ready', false],
  ]) {
    if (lifecycleValidation[key] !== expected) {
      fail(`Lifecycle validation flag ${key} must be ${expected}.`);
    }
  }

  const releaseDir = path.join(root, '.release');
  fs.mkdirSync(releaseDir, { recursive: true });

  const evidence = {
    generatedFrom: 'ONE/verify-commercial-lifecycle.mjs',
    generatedAt: 'static',
    schemaVersion: 1,
    ...lifecycleValidation,
    blockers: [
      {
        id: 'supabase_remote_not_validated',
        severity: 'blocker',
        message: 'Run lifecycle and audit migrations against staging Supabase, then validate RLS, indexed lifecycle columns, revocation, and audit writes.',
      },
      {
        id: 'lemon_remote_not_validated',
        severity: 'blocker',
        message: 'Validate exact Lemon webhook event names, signatures, duplicate delivery, and subscription lifecycle in Lemon test/live dashboard before wide sales.',
      },
    ],
    required_human_tests: lifecycleValidation.requiredHumanTests,
    validation_commands: lifecycleValidation.validationCommands,
  };

  fs.writeFileSync(
    path.join(releaseDir, 'lifecycle-validation.json'),
    `${JSON.stringify(evidence, null, 2)}\n`
  );

  fs.writeFileSync(
    path.join(releaseDir, 'human-actions.json'),
    `${JSON.stringify({
      generatedFrom: 'ONE/verify-commercial-lifecycle.mjs',
      generatedAt: 'static',
      status: 'human-action-required',
      public_release_ready: false,
      wide_sales_ready: false,
      actions: lifecycleValidation.requiredHumanTests,
      runbook: lifecycleValidation.runbook,
    }, null, 2)}\n`
  );

  fs.writeFileSync(
    path.join(releaseDir, 'public-release-blockers.md'),
    [
      '# Public Release Blockers',
      '',
      '- Local secrets must be removed or rotated before public sharing.',
      '- Premium source and private assets must move out of the public repo before public launch.',
      '- Public release remains separate from wide-sales readiness.',
      '- Wide sales remain blocked until Supabase and Lemon staging validation evidence exists.',
      '',
      `Lifecycle evidence: \`${lifecycleValidation.evidencePath}\``,
      `Staging runbook: \`${lifecycleValidation.runbook}\``,
      '',
    ].join('\n')
  );
}

if (failures.length > 0) {
  console.error('verify:commercial-lifecycle failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:commercial-lifecycle OK');
