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

const vault = requireMarkers('vault-page', 'apps/web/app/vault/page.tsx', [
  'mapSummaryForVault',
  'Entitlement lifecycle',
  'Owner bypass is active',
  'No entitlement records found',
]);

const lifecycle = requireMarkers('lifecycle-copy', 'apps/web/lib/entitlement-lifecycle.ts', [
  'Prueba temporal activa',
  'Acceso recuperado manualmente',
  'Acceso expirado',
  'Suscripcion cancelada',
  'Acceso requiere atencion',
  'Acceso premium no disponible',
  'Acceso premium activo',
]);

const download = requireMarkers('download-route', 'apps/web/app/api/download/[asset]/route.ts', [
  'resolveCurrentAccess',
  'accessDecision.allowed',
  'Cache-Control',
  'private, no-store',
]);

if (download.includes('hasEntitlement(')) {
  fail('download-route: protected downloads must use the central access engine.');
}

const buyerFacingLeakMarkers = [
  'Provider:',
  'Source:',
  'provider_subscription_id',
  'providerEventIdLast',
  'internalNote',
  'revokeReason',
];

for (const marker of buyerFacingLeakMarkers) {
  if (vault.includes(marker)) {
    fail(`vault-page: buyer-facing vault may expose internal marker ${marker}.`);
  }
}

requireMarkers('buyer-docs', 'docs/BUYER_JOURNEY.md', [
  'Google',
  'Manual test access is separate',
  'Paid recovery is also separate',
  'Buyer-facing copy must not imply that Google login alone unlocks premium assets.',
]);

if (!lifecycle.includes('paused') || !lifecycle.includes('past_due') || !lifecycle.includes('revoked')) {
  fail('lifecycle-copy: blocking statuses must remain covered.');
}

if (failures.length > 0) {
  console.error('verify:vault-lifecycle failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:vault-lifecycle OK');
