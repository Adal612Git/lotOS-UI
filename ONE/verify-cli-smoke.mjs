#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const cli = path.join(root, 'packages/cli/dist/index.js');
const failures = [];

const checks = [
  { args: ['--version'], includes: '0.0.1' },
  { args: ['list'], includes: 'button' },
  { args: ['runtimes'], includes: 'react' },
  { args: ['runtime-matrix'], includes: 'next' },
  { args: ['templates'], includes: 'ai-agent-console' },
  { args: ['templates', '--id', 'ai-agent-console'], includes: '"id": "ai-agent-console"' },
  { args: ['themes'], includes: 'operator-grid' },
  { args: ['ai-tools'], includes: '/project-map' },
  { args: ['patterns'], includes: 'saas-control-center' },
  { args: ['desktop-templates'], includes: 'control-center-desktop' },
  { args: ['stacks'], includes: 'php-laravel-starter' },
];

for (const check of checks) {
  const result = spawnSync(process.execPath, [cli, ...check.args], {
    cwd: root,
    encoding: 'utf8',
    shell: false,
  });

  const command = `lotos-ui ${check.args.join(' ')}`;
  if (result.status !== 0) {
    failures.push(`${command} exited with ${result.status}`);
    continue;
  }

  const output = `${result.stdout}\n${result.stderr}`;
  if (!output.includes(check.includes)) {
    failures.push(`${command} did not include expected marker: ${check.includes}`);
  }
}

if (failures.length > 0) {
  console.error('verify:cli-smoke failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:cli-smoke OK (${checks.length} CLI commands checked)`);
