#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const failures = [];
const checks = [
  ['verify:no-secrets', ['run', 'verify:no-secrets']],
  ['verify:no-premium-leak', ['run', 'verify:no-premium-leak']],
  ['verify:private-workspace', ['run', 'verify:private-workspace']],
  ['verify:generated-ai', ['run', 'verify:generated-ai']],
  ['verify:registry-consumers', ['run', 'verify:registry-consumers']],
  ['verify:routes', ['run', 'verify:routes']],
  ['verify:web-smoke', ['run', 'verify:web-smoke']],
  ['verify:entitlement-boundary', ['run', 'verify:entitlement-boundary']],
  ['verify:webhook-lifecycle', ['run', 'verify:webhook-lifecycle']],
  ['verify:webhook-contracts', ['run', 'verify:webhook-contracts']],
  ['verify:entitlement-state-machine', ['run', 'verify:entitlement-state-machine']],
  ['verify:supabase-migrations', ['run', 'verify:supabase-migrations']],
  ['verify:entitlement-audit', ['run', 'verify:entitlement-audit']],
  ['verify:admin-lifecycle', ['run', 'verify:admin-lifecycle']],
  ['verify:vault-lifecycle', ['run', 'verify:vault-lifecycle']],
  ['verify:rls-policy-plan', ['run', 'verify:rls-policy-plan']],
  ['verify:commercial-lifecycle', ['run', 'verify:commercial-lifecycle']],
  ['verify:mcp-smoke', ['run', 'verify:mcp-smoke']],
  ['verify:cli-smoke', ['run', 'verify:cli-smoke']],
  ['verify:package-exports', ['run', 'verify:package-exports']],
  ['verify:packages', ['run', 'verify:packages']],
  ['verify:ci', ['run', 'verify:ci']],
];

for (const [label, args] of checks) {
  const result = spawnSync('pnpm', args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: process.env,
  });
  if (result.status !== 0) {
    failures.push(label);
  }
}

const releaseDir = path.join(root, '.release');
fs.mkdirSync(releaseDir, { recursive: true });
fs.writeFileSync(
  path.join(releaseDir, 'release-checklist.json'),
  `${JSON.stringify({
    generatedFrom: 'ONE/verify-release-candidate.mjs',
    mode: 'private-workspace',
    publicReleaseExpected: false,
    checks: checks.map(([label]) => ({
      id: label,
      status: failures.includes(label) ? 'failed' : 'passed',
    })),
    result: failures.length > 0 ? 'blocked' : 'passed',
    humanBlockers: [
      'Rotate local secrets before public release.',
      'Move premium source/assets to private repo or private registry before public release.',
      'Set final legal/support values in deployment.',
      'Approve final pricing before selling.',
      'Test revocation and subscription lifecycle automation against production-like Supabase data.',
    ],
  }, null, 2)}\n`,
);

if (failures.length > 0) {
  console.error('verify:release-candidate failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  console.error('- Checklist written to .release/release-checklist.json');
  process.exit(1);
}

console.log('verify:release-candidate OK');
console.log('Checklist written to .release/release-checklist.json');
