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

function stripSqlComments(sql) {
  return sql
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');
}

const docsPath = 'docs/SUPABASE_RLS_POLICY_PLAN.md';
if (!exists(docsPath)) {
  fail(`Missing ${docsPath}`);
} else {
  const docs = read(docsPath);
  const docsLower = docs.toLowerCase();
  for (const marker of [
    'service role',
    'buyers must not select from public.entitlements directly',
    'sanitized view or RPC',
    'metadata',
    'internal_note',
    'provider_event_id_last',
    'Owner-only APIs',
    'wide sales blocked',
  ]) {
    if (!docsLower.includes(marker.toLowerCase())) {
      fail(`RLS policy plan missing marker: ${marker}`);
    }
  }
}

const migrationDir = path.join(root, 'apps', 'web', 'supabase', 'migrations');
if (fs.existsSync(migrationDir)) {
  for (const file of fs.readdirSync(migrationDir).filter((entry) => entry.endsWith('.sql'))) {
    const sql = stripSqlComments(fs.readFileSync(path.join(migrationDir, file), 'utf8')).toLowerCase();
    for (const forbidden of [
      /drop\s+table\s+public\.entitlements/,
      /truncate\s+public\.entitlements/,
      /delete\s+from\s+public\.entitlements/,
      /disable\s+row\s+level\s+security/,
      /using\s*\(\s*true\s*\)/,
      /grant\s+all\s+on\s+public\.entitlements\s+to\s+(anon|authenticated)/,
      /grant\s+select\s+on\s+public\.entitlements\s+to\s+anon/,
    ]) {
      if (forbidden.test(sql)) {
        fail(`${file}: forbidden RLS/security SQL pattern ${forbidden}.`);
      }
    }
  }
}

for (const route of [
  'apps/web/app/api/entitlements/grant/route.ts',
  'apps/web/app/api/entitlements/revoke/route.ts',
  'apps/web/app/api/entitlements/lookup/route.ts',
]) {
  if (!exists(route)) {
    fail(`Missing owner-only route: ${route}`);
    continue;
  }
  const content = read(route);
  if (!content.includes('getServerSession') || !content.includes('isOwnerEmail')) {
    fail(`${route}: owner-only API must require session and isOwnerEmail.`);
  }
}

const downloadRoute = read('apps/web/app/api/download/[asset]/route.ts');
for (const marker of ['getServerSession', 'canAccessPremium', 'private, no-store']) {
  if (!downloadRoute.includes(marker)) {
    fail(`download route missing marker: ${marker}`);
  }
}

if (failures.length > 0) {
  console.error('verify:rls-policy-plan failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:rls-policy-plan OK');
