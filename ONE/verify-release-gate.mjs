#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='));
const mode = modeArg?.split('=')[1] ?? 'private';
const failures = [];

function run(label, command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    failures.push(label);
  }
}

if (mode !== 'private' && mode !== 'public') {
  console.error('verify-release-gate failed');
  console.error(`- Unknown mode: ${mode}`);
  process.exit(1);
}

console.log(`LotOS release gate mode: ${mode}`);

if (mode === 'public') {
  run('no-secrets public gate', 'node', ['ONE/verify-no-secrets.mjs']);
  run('no-premium-leak public gate', 'node', ['ONE/verify-no-premium-leak.mjs'], {
    LOTOS_PUBLIC_RELEASE: '1',
    LOTOS_REPO_VISIBILITY: 'public',
  });
  run('package publishing gate', 'node', ['ONE/verify-packages.mjs']);
} else {
  run('no-premium-leak private inventory', 'node', ['ONE/verify-no-premium-leak.mjs']);
  run('package publishing inventory', 'node', ['ONE/verify-packages.mjs']);
  console.log('Private workspace mode may contain premium paths, but publicReleaseSafe must stay visible in warnings/output.');
}

if (failures.length > 0) {
  console.error('verify-release-gate failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify-release-gate OK (${mode})`);
