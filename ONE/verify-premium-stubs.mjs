#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { lotosManifest } from '../packages/registry/dist/index.js';

const root = process.cwd();
const findings = [];
const textExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.yml', '.yaml']);
const publicSurfaces = [
  'package.json',
  'pnpm-lock.yaml',
  'apps',
  'docs',
  'packages/registry',
  'packages/core',
  'packages/sentinel',
  'packages/cli',
  'packages/claude-arm',
  'packages/web-components',
  '.ai',
];
const premiumPackageDirs = ['packages/claude-arm-pro', 'packages/pro'];
const payloadDirs = ['src', 'dist', 'tests', 'stories', 'assets', '.private-dist'];

function addFinding(severity, id, filePath = null) {
  findings.push({ severity, id, path: filePath });
}

function gitFiles(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  } catch {
    return [];
  }
}

function walkFiles(current = root) {
  const files = [];
  let entries = [];
  try {
    entries = fs.readdirSync(current, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (['.git', 'node_modules', '.next', 'coverage', '.turbo'].includes(entry.name)) {
      continue;
    }
    const absolutePath = path.join(current, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
    } else if (entry.isFile()) {
      files.push(path.relative(root, absolutePath).replaceAll('\\', '/'));
    }
  }
  return files;
}

function listKnownFiles() {
  return Array.from(new Set([
    ...gitFiles(['ls-files', '-z']),
    ...gitFiles(['ls-files', '--others', '--exclude-standard', '-z']),
    ...walkFiles(),
  ])).map((file) => file.replaceAll('\\', '/'));
}

function inPublicSurface(file) {
  return publicSurfaces.some((surface) => file === surface || file.startsWith(`${surface}/`));
}

if (!Array.isArray(lotosManifest.premiumStubBoundaries) || lotosManifest.premiumStubBoundaries.length === 0) {
  addFinding('blocker', 'registry_missing_premium_stub_boundaries', 'packages/registry/src/lotos.manifest.ts');
}

for (const boundary of lotosManifest.premiumStubBoundaries ?? []) {
  if (boundary.publicRepresentation !== 'metadata-only') {
    addFinding('blocker', 'premium_stub_not_metadata_only', boundary.id);
  }
  if (!String(boundary.message ?? '').includes('Premium components are distributed through private access after entitlement')) {
    addFinding('blocker', 'premium_stub_missing_entitlement_message', boundary.id);
  }
}

for (const packageDir of premiumPackageDirs) {
  if (!fs.existsSync(path.join(root, packageDir))) {
    continue;
  }
  for (const payloadDir of payloadDirs) {
    const candidate = path.join(root, packageDir, payloadDir);
    if (fs.existsSync(candidate)) {
      addFinding('blocker', 'real_premium_payload_present_not_stub', `${packageDir}/${payloadDir}`);
    }
  }
  const packageJsonPath = path.join(root, packageDir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.private !== true) {
      addFinding('blocker', 'premium_package_not_private', `${packageDir}/package.json`);
    }
    if (packageJson.exports || packageJson.files) {
      addFinding('blocker', 'premium_stub_has_publish_surface', `${packageDir}/package.json`);
    }
  }
}

for (const file of listKnownFiles()) {
  if (!inPublicSurface(file)) {
    continue;
  }
  const extension = path.extname(file).toLowerCase();
  if (!textExtensions.has(extension) && file !== 'pnpm-lock.yaml') {
    continue;
  }
  const absolutePath = path.join(root, file);
  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).size > 2_000_000) {
    continue;
  }
  const content = fs.readFileSync(absolutePath, 'utf8');
  if (/@lotosui\/claude-arm-pro|@lotosui\/pro-private|packages\/claude-arm-pro|packages\/pro|\.commercial-dist|\.private-dist/.test(content)) {
    addFinding('blocker', 'public_surface_references_premium_real_surface', file);
  }
}

const report = {
  schemaVersion: 1,
  generatedFrom: 'ONE/verify-premium-stubs.mjs',
  generatedAt: new Date().toISOString(),
  result: findings.some((finding) => finding.severity === 'blocker') ? 'blocked' : 'ready',
  premiumStubsReady: !findings.some((finding) => finding.severity === 'blocker'),
  redacted: true,
  findings,
};

fs.mkdirSync(path.join(root, '.release'), { recursive: true });
fs.writeFileSync(path.join(root, '.release/premium-stubs-report.json'), `${JSON.stringify(report, null, 2)}\n`);

for (const finding of findings) {
  const log = finding.severity === 'blocker' ? console.error : console.warn;
  log(`verify:premium-stubs ${finding.severity}: ${finding.id}${finding.path ? ` (${finding.path})` : ''}`);
}

if (report.result === 'blocked') {
  console.error('verify:premium-stubs failed; report written to .release/premium-stubs-report.json');
  process.exit(1);
}

console.log('verify:premium-stubs OK; report written to .release/premium-stubs-report.json');
