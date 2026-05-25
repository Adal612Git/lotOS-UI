#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const warnings = [];
const publicMode =
  process.env.LOTOS_PUBLIC_RELEASE === '1' ||
  process.env.LOTOS_PUBLIC_RELEASE === 'true' ||
  process.env.LOTOS_REPO_VISIBILITY === 'public';
const publicPackageDirs = [
  'packages/registry',
  'packages/core',
  'packages/sentinel',
  'packages/cli',
  'packages/claude-arm',
  'packages/web-components',
];
const allowedPublicPackageNames = new Set([
  '@lotosui/registry',
  '@lotosui/core',
  '@lotosui/sentinel',
  '@lotosui/cli',
  '@lotosui/claude-arm',
  '@lotosui/web-components',
]);

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

for (const packageDir of publicPackageDirs) {
  const packageJson = readJson(`${packageDir}/package.json`);
  if (!allowedPublicPackageNames.has(packageJson.name)) {
    fail(`Unexpected public package name: ${packageDir} -> ${packageJson.name}`);
  }
  if (!packageJson.version) {
    fail(`${packageJson.name} is missing version.`);
  }
  if (!packageJson.license) {
    fail(`${packageJson.name} is missing license.`);
  }
  if (!Array.isArray(packageJson.files) || packageJson.files.length === 0) {
    fail(`${packageJson.name} must define a non-empty files allowlist.`);
  }
  const serialized = JSON.stringify(packageJson);
  if (/claude-arm-pro|pro-private|packages\/pro/.test(serialized)) {
    fail(`${packageJson.name} package.json references premium packages.`);
  }
  if (!fs.existsSync(path.join(root, packageDir, 'README.md'))) {
    warn(`${packageJson.name} does not include a package README yet.`);
  }
}

const claudeArm = readJson('packages/claude-arm/package.json');
if (!Array.isArray(claudeArm.files) || claudeArm.files.includes('dist') || claudeArm.files.some((entry) => /accordion|avatar|table|tabs|modal/.test(entry))) {
  fail('@lotosui/claude-arm must keep a narrow files allowlist for the 8 free exports.');
}

const claudeArmProPath = path.join(root, 'packages/claude-arm-pro/package.json');
if (fs.existsSync(claudeArmProPath)) {
  const claudeArmPro = readJson('packages/claude-arm-pro/package.json');
  if (claudeArmPro.private !== true) {
    fail('@lotosui/claude-arm-pro must be private in this workspace.');
  }
} else if (!publicMode) {
  warn('@lotosui/claude-arm-pro is absent; this is expected only in public clean-room exports.');
}

const publishScript = fs.readFileSync(path.join(root, '.github/scripts/publish-npm.mjs'), 'utf8');
for (const packageName of allowedPublicPackageNames) {
  if (!publishScript.includes(packageName)) {
    fail(`publish-npm.mjs allowlist is missing ${packageName}.`);
  }
}
if (publishScript.includes('@lotosui/claude-arm-pro') || publishScript.includes('@lotosui/pro-private')) {
  fail('publish-npm.mjs must never include premium packages.');
}

const publishWorkflow = fs.readFileSync(path.join(root, '.github/workflows/publish-npm.yml'), 'utf8');
for (const marker of ['verify:public-release', 'verify:package-exports', 'id-token: write', 'PUBLISH_CLAUDE_ARM']) {
  if (!publishWorkflow.includes(marker)) {
    fail(`publish workflow is missing marker: ${marker}`);
  }
}

for (const warning of warnings) {
  console.warn(`verify:packages warning: ${warning}`);
}

if (failures.length > 0) {
  console.error('verify:packages failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:packages OK (${publicPackageDirs.length} public packages, premium publish blocked)`);
