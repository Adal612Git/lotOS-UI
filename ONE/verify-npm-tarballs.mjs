#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const packages = [
  { name: '@lotosui/registry', dir: 'packages/registry' },
  { name: '@lotosui/core', dir: 'packages/core' },
  { name: '@lotosui/sentinel', dir: 'packages/sentinel' },
  { name: '@lotosui/cli', dir: 'packages/cli' },
  { name: '@lotosui/claude-arm', dir: 'packages/claude-arm' },
  { name: '@lotosui/web-components', dir: 'packages/web-components' },
];
const forbiddenPathPattern = /(^|\/)(\.env|client_secret_|\.commercial-dist|\.private-dist)|claude-arm-pro|packages\/pro|@lotosui\/pro-private/;
const findings = [];
const tarballs = [];

function addFinding(severity, id, packageName, detail = null) {
  findings.push({ severity, id, packageName, detail });
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function dependencyEntries(packageJson) {
  return [
    ...Object.entries(packageJson.dependencies ?? {}),
    ...Object.entries(packageJson.peerDependencies ?? {}),
    ...Object.entries(packageJson.optionalDependencies ?? {}),
    ...Object.entries(packageJson.devDependencies ?? {}),
  ];
}

for (const candidate of packages) {
  const packageDir = path.join(root, candidate.dir);
  const packageJsonPath = path.join(packageDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    addFinding('blocker', 'missing_package_json', candidate.name);
    continue;
  }
  const packageJson = readJson(`${candidate.dir}/package.json`);
  if (packageJson.name !== candidate.name) {
    addFinding('blocker', 'unexpected_package_name', candidate.name, packageJson.name);
  }
  for (const [dep, version] of dependencyEntries(packageJson)) {
    if (version === 'workspace:*') {
      addFinding('blocker', 'workspace_dependency_in_publish_metadata', candidate.name, dep);
    }
    if (/claude-arm-pro|pro-private/.test(dep)) {
      addFinding('blocker', 'premium_dependency_in_public_package', candidate.name, dep);
    }
  }
  if (!Array.isArray(packageJson.files) || packageJson.files.length === 0) {
    addFinding('blocker', 'missing_files_allowlist', candidate.name);
  }
  const serialized = JSON.stringify(packageJson);
  if (/claude-arm-pro|packages\/pro|\.commercial-dist|\.private-dist/.test(serialized)) {
    addFinding('blocker', 'premium_reference_in_package_metadata', candidate.name);
  }

  const pack = spawnSync(npmCommand, ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: packageDir,
    encoding: 'utf8',
    shell: process.platform === 'win32',
  });
  if (pack.status !== 0) {
    addFinding('blocker', 'pack_dry_run_failed', candidate.name);
    tarballs.push({ packageName: candidate.name, status: 'failed' });
    continue;
  }

  let parsed = [];
  try {
    parsed = JSON.parse(pack.stdout);
  } catch {
    addFinding('blocker', 'pack_json_parse_failed', candidate.name);
    tarballs.push({ packageName: candidate.name, status: 'failed' });
    continue;
  }

  const entry = parsed[0] ?? {};
  const files = entry.files?.map((file) => file.path) ?? [];
  for (const file of files) {
    if (forbiddenPathPattern.test(file)) {
      addFinding('blocker', 'forbidden_file_in_dry_run_tarball', candidate.name, file);
    }
  }
  tarballs.push({
    packageName: candidate.name,
    status: 'dry-run',
    filename: entry.filename ?? null,
    size: entry.size ?? null,
    unpackedSize: entry.unpackedSize ?? null,
    entryCount: files.length,
  });
}

const report = {
  schemaVersion: 1,
  generatedFrom: 'ONE/verify-npm-tarballs.mjs',
  generatedAt: new Date().toISOString(),
  result: findings.some((finding) => finding.severity === 'blocker') ? 'blocked' : 'ready',
  npmTarballsReady: !findings.some((finding) => finding.severity === 'blocker'),
  redacted: true,
  tarballs,
  findings,
};

fs.mkdirSync(path.join(root, '.release'), { recursive: true });
fs.writeFileSync(path.join(root, '.release/npm-tarball-report.json'), `${JSON.stringify(report, null, 2)}\n`);

for (const finding of findings) {
  const log = finding.severity === 'blocker' ? console.error : console.warn;
  log(`verify:npm-tarballs ${finding.severity}: ${finding.id} (${finding.packageName}${finding.detail ? `: ${finding.detail}` : ''})`);
}

if (report.result === 'blocked') {
  console.error('verify:npm-tarballs failed; report written to .release/npm-tarball-report.json');
  process.exit(1);
}

console.log(`verify:npm-tarballs OK (${tarballs.length} packages, report written to .release/npm-tarball-report.json)`);
