#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const checks = [
  { id: 'public-tree', command: ['run', 'release:public-tree:check'] },
  { id: 'no-secrets', command: ['run', 'verify:no-secrets'] },
  { id: 'no-premium-leak', command: ['run', 'verify:no-premium-leak'] },
  { id: 'premium-stubs', command: ['run', 'verify:premium-stubs'] },
  { id: 'public-docs', command: ['run', 'verify:public-docs'] },
  { id: 'public-ai-context', command: ['run', 'verify:public-ai-context'] },
  { id: 'npm-tarballs', command: ['run', 'verify:npm-tarballs'] },
  { id: 'package-exports', command: ['run', 'verify:package-exports'] },
  { id: 'packages', command: ['run', 'verify:packages'] },
  { id: 'drift', command: ['run', 'verify:drift'] },
  { id: 'generated-ai', command: ['run', 'verify:generated-ai'] },
  { id: 'registry-consumers', command: ['run', 'verify:registry-consumers'] },
];

const results = [];

for (const check of checks) {
  const started = Date.now();
  console.log(`verify:public-clean-room running ${check.id}`);
  const result = spawnSync(pnpmCommand, check.command, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: {
      ...process.env,
      LOTOS_PUBLIC_RELEASE: '1',
      LOTOS_REPO_VISIBILITY: 'public',
    },
  });
  results.push({
    id: check.id,
    command: `pnpm ${check.command.join(' ')}`,
    status: result.status === 0 ? 'passed' : 'failed',
    exitCode: result.status ?? 1,
    durationMs: Date.now() - started,
  });
}

const blockers = results
  .filter((result) => result.status !== 'passed')
  .map((result) => ({
    id: `${result.id}_failed`,
    severity: 'blocker',
    check: result.id,
  }));

const report = {
  schemaVersion: 1,
  generatedFrom: 'ONE/verify-public-clean-room.mjs',
  generatedAt: new Date().toISOString(),
  mode: 'public-clean-room',
  result: blockers.length > 0 ? 'blocked' : 'ready',
  publicReleaseReady: blockers.length === 0,
  wideSalesReady: false,
  redacted: true,
  blockers,
  checks: results,
  publicPackages: [
    '@lotosui/registry',
    '@lotosui/core',
    '@lotosui/sentinel',
    '@lotosui/cli',
    '@lotosui/claude-arm',
    '@lotosui/web-components',
  ],
  evidence: {
    publicTree: '.release/public-tree-report.json',
    npmTarballs: '.release/npm-tarball-report.json',
    publicAiContext: '.release/public-ai-context-report.json',
    publicDocs: '.release/public-docs-report.json',
    premiumStubs: '.release/premium-stubs-report.json',
  },
  readinessUpdate: {
    status: blockers.length > 0 ? 'public-clean-room-blocked' : 'public-clean-room-ready-wide-sales-blocked',
    score: blockers.length > 0 ? 74 : 82,
    evidencePath: '.release/public-clean-room-report.json',
  },
};

fs.mkdirSync(path.join(root, '.release'), { recursive: true });
fs.writeFileSync(path.join(root, '.release/public-clean-room-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (blockers.length > 0) {
  console.error('verify:public-clean-room failed');
  for (const blocker of blockers) {
    console.error(`- ${blocker.check}`);
  }
  console.error('report written to .release/public-clean-room-report.json');
  process.exit(1);
}

console.log('verify:public-clean-room OK; report written to .release/public-clean-room-report.json');
