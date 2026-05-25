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

const ci = read('.github/workflows/ci.yml');
const publish = read('.github/workflows/publish-npm.yml');
const publishScript = read('.github/scripts/publish-npm.mjs');

for (const marker of [
  'Verify no secrets',
  'Verify no premium leak',
  'Verify drift gates',
  'Verify route and smoke gates',
  'Verify entitlement boundary',
  'verify:webhook-lifecycle',
  'verify:webhook-contracts',
  'verify:entitlement-state-machine',
  'verify:supabase-migrations',
  'verify:entitlement-audit',
  'verify:admin-lifecycle',
  'verify:vault-lifecycle',
  'verify:rls-policy-plan',
  'verify:commercial-lifecycle',
  'Verify package exports',
  'Verify release candidate',
]) {
  if (!ci.includes(marker)) {
    fail(`CI workflow is missing step marker: ${marker}`);
  }
}

for (const marker of [
  'Verify public release gates',
  'verify:public-release',
  'verify:package-exports',
  'id-token: write',
  'PUBLISH_CLAUDE_ARM',
  'NPM_CONFIG_PROVENANCE',
]) {
  if (!publish.includes(marker)) {
    fail(`Publish workflow is missing marker: ${marker}`);
  }
}

if (!publishScript.includes('allowedPublicPackageNames')) {
  fail('publish-npm.mjs must use an explicit public package allowlist.');
}
if (!publishScript.includes('privatePackage') || !publishScript.includes('access !== \'public\'')) {
  fail('publish-npm.mjs must refuse private or non-public package targets.');
}

if (failures.length > 0) {
  console.error('verify:ci failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:ci OK (CI and publish gates present)');
