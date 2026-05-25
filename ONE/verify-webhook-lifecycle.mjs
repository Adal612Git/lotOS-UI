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

const mapperPath = 'apps/web/lib/webhooks/lemon-event-mapper.ts';
const routePath = 'apps/web/app/api/webhooks/lemon/route.ts';
const docsPath = 'docs/WEBHOOK_LIFECYCLE.md';

for (const relativePath of [mapperPath, routePath, docsPath]) {
  if (!exists(relativePath)) {
    fail(`Missing webhook lifecycle file: ${relativePath}`);
  }
}

if (exists(mapperPath)) {
  const mapper = read(mapperPath);
  for (const marker of [
    'subscription_payment_failed',
    'subscription_payment_recovered',
    'subscription_paused',
    'subscription_resumed',
    'subscription_unpaused',
    'subscription_cancelled',
    'subscription_expired',
    'reject_unmappable',
    'providerEventId',
    'readEmailCandidate',
    'listSupportedLemonWebhookEvents',
  ]) {
    if (!mapper.includes(marker)) {
      fail(`Lemon event mapper is missing marker: ${marker}`);
    }
  }
}

if (exists(routePath)) {
  const route = read(routePath);
  for (const marker of [
    'validateSignature',
    'mapLemonWebhookEvent',
    'hasProcessedProviderEvent',
    'recordEntitlementAuditEvent',
    'webhook_received',
    'webhook_applied',
    'webhook_failed',
    'duplicate',
    'status: mapping.status',
  ]) {
    if (!route.includes(marker)) {
      fail(`Lemon webhook route is missing marker: ${marker}`);
    }
  }

  if (route.includes('email: entitlement.user_email')) {
    fail('Lemon webhook response must not echo buyer email.');
  }
}

if (exists(docsPath)) {
  const docs = read(docsPath);
  for (const marker of [
    'idempotency',
    'subscription_payment_failed',
    'subscription_payment_recovered',
    'subscription_cancelled',
    'paid recovery',
    'verify:webhook-contracts',
    'Do not run remote migrations',
  ]) {
    if (!docs.includes(marker)) {
      fail(`Webhook lifecycle docs are missing marker: ${marker}`);
    }
  }
}

if (failures.length > 0) {
  console.error('verify:webhook-lifecycle failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:webhook-lifecycle OK');
