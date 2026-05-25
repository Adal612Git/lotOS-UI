#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { lotosManifest } from '../packages/registry/dist/index.js';

const root = process.cwd();
const publicMode =
  process.env.LOTOS_PUBLIC_RELEASE === '1' ||
  process.env.LOTOS_PUBLIC_RELEASE === 'true' ||
  process.env.LOTOS_REPO_VISIBILITY === 'public';
const failures = [];
const warnings = [];
const textExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.yml', '.yaml']);
const premiumReferencePattern = /(@lotosui\/claude-arm-pro|packages\/claude-arm-pro|packages\/pro|@lotosui\/pro-private)/;
const premiumDependencyPattern = /"(@lotosui\/claude-arm-pro|@lotosui\/pro-private)"\s*:/;

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function gitFiles(args) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  } catch {
    return [];
  }
}

const skipDirs = new Set(['.git', 'node_modules', '.next', 'dist', 'coverage', '.turbo', '.pnpm-store']);

function walkFiles(current = root) {
  const files = [];
  let entries = [];
  try {
    entries = fs.readdirSync(current, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    if (skipDirs.has(entry.name)) {
      continue;
    }
    const absolutePath = path.join(current, entry.name);
    if (entry.isSymbolicLink()) {
      continue;
    }
    if (entry.isDirectory()) {
      files.push(...walkFiles(absolutePath));
      continue;
    }
    if (entry.isFile()) {
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

function report(mode, message) {
  if (mode === 'fail') {
    fail(message);
  } else {
    warn(message);
  }
}

const publicPaths = lotosManifest.assetPermissions
  .filter((entry) => entry.id === 'public-packages')
  .flatMap((entry) => entry.paths);
const premiumPaths = lotosManifest.assetPermissions
  .filter((entry) => entry.id !== 'public-packages')
  .flatMap((entry) => entry.paths);
const files = listKnownFiles();
const premiumPresent = [];

for (const premiumPath of premiumPaths) {
  const exists = fs.existsSync(path.join(root, premiumPath));
  const listed = files.some((file) => file === premiumPath || file.startsWith(`${premiumPath}/`));
  if (exists || listed) {
    premiumPresent.push(premiumPath);
    report(publicMode ? 'fail' : 'warn', `Premium/private path present in workspace: ${premiumPath}`);
  }
}

for (const generatedPrivatePath of ['.commercial-dist', 'packages/pro/.private-dist']) {
  const listed = files.some((file) => file === generatedPrivatePath || file.startsWith(`${generatedPrivatePath}/`));
  if (listed || fs.existsSync(path.join(root, generatedPrivatePath))) {
    premiumPresent.push(generatedPrivatePath);
    report(publicMode ? 'fail' : 'warn', `Generated private distribution path present: ${generatedPrivatePath}`);
  }
}

for (const file of files) {
  const extension = path.extname(file).toLowerCase();
  const inPublicPackage = publicPaths.some((prefix) => file === prefix || file.startsWith(`${prefix}/`));
  const inPublicApp = file.startsWith('apps/') || file === 'pnpm-lock.yaml' || file === 'package.json';
  if (!inPublicPackage && !inPublicApp) {
    continue;
  }
  if (!textExtensions.has(extension) && file !== 'pnpm-lock.yaml' && !file.endsWith('package.json')) {
    continue;
  }

  const absolutePath = path.join(root, file);
  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).size > 2_000_000) {
    continue;
  }

  const content = fs.readFileSync(absolutePath, 'utf8');
  const hasImportLeak =
    /\bimport\b[\s\S]*?\bfrom\s+["'][^"']*(@lotosui\/claude-arm-pro|packages\/claude-arm-pro|packages\/pro)[^"']*["']/.test(content) ||
    /^\s*import\s+["'][^"']*(@lotosui\/claude-arm-pro|packages\/claude-arm-pro|packages\/pro)[^"']*["']/m.test(content) ||
    /\bexport\b[\s\S]*?\bfrom\s+["'][^"']*(@lotosui\/claude-arm-pro|packages\/claude-arm-pro|packages\/pro)[^"']*["']/.test(content) ||
    /require\(["'](@lotosui\/claude-arm-pro|.*packages\/claude-arm-pro|.*packages\/pro)["']\)/.test(content) ||
    premiumDependencyPattern.test(content) ||
    (publicMode && file === 'pnpm-lock.yaml' && premiumReferencePattern.test(content));

  if (!hasImportLeak) {
    continue;
  }

  if (inPublicPackage || publicMode) {
    fail(`Public release surface references premium code/dependency: ${file}`);
  } else {
    warn(`Private workspace premium reference: ${file} (blocks public-release mode)`);
  }
}

const claudeArmProPackage = path.join(root, 'packages/claude-arm-pro/package.json');
if (fs.existsSync(claudeArmProPackage)) {
  const packageJson = JSON.parse(fs.readFileSync(claudeArmProPackage, 'utf8'));
  if (packageJson.private !== true) {
    report(publicMode ? 'fail' : 'warn', 'packages/claude-arm-pro/package.json must be private before public release.');
  }
}

for (const warning of warnings) {
  console.warn(`verify:no-premium-leak warning: ${warning}`);
}

if (failures.length > 0) {
  console.error('verify:no-premium-leak failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

if (publicMode) {
  console.log('verify:no-premium-leak OK (public-release mode)');
} else {
  const publicReleaseSafe = premiumPresent.length === 0 && warnings.length === 0;
  console.log(`verify:no-premium-leak OK (private workspace mode, publicReleaseSafe=${publicReleaseSafe})`);
}
