#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const reportArgIndex = process.argv.indexOf('--report');
const reportPath = reportArgIndex >= 0 && process.argv[reportArgIndex + 1]
  ? process.argv[reportArgIndex + 1]
  : '.release/public-tree-report.json';

const publicKeep = [
  'apps/docs',
  'packages/registry',
  'packages/core',
  'packages/sentinel',
  'packages/cli',
  'packages/web-components',
  'packages/claude-arm',
  'examples',
  'docs',
  '.ai',
  '.github',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'package.json',
  'pnpm-lock.yaml',
  'pnpm-workspace.yaml',
];

const publicRemove = [
  'packages/pro',
  'packages/claude-arm-pro',
  'packages/pro/.private-dist',
  '.commercial-dist',
  '.private-dist',
  '.vercel',
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.production.local',
  '.claude/settings.local.json',
  'ONE/.claude/settings.local.json',
];

const publicStub = [
  {
    id: 'premium-components',
    source: 'packages/claude-arm-pro',
    publicReplacement: 'metadata-only registry entries',
    message: 'Premium components are distributed through private access after entitlement.',
  },
  {
    id: 'premium-assets',
    source: '.commercial-dist',
    publicReplacement: 'entitlement-gated download docs and placeholders',
    message: 'Commercial bundles stay in private storage or a private release channel.',
  },
];

const skipDirs = new Set(['.git', 'node_modules', '.next', 'coverage', '.turbo', '.pnpm-store', 'out', 'build']);
const textExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.yml', '.yaml', '.toml']);
const findings = [];

function toPosix(filePath) {
  return filePath.replaceAll('\\', '/');
}

function addFinding(severity, id, message, filePath = null) {
  findings.push({ severity, id, message, path: filePath });
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
      files.push(toPosix(path.relative(root, absolutePath)));
    }
  }

  return files;
}

function listKnownFiles() {
  return Array.from(new Set([
    ...gitFiles(['ls-files', '-z']),
    ...gitFiles(['ls-files', '--others', '--exclude-standard', '-z']),
    ...walkFiles(),
  ])).map(toPosix);
}

function fileExistsOrListed(files, relativePath) {
  const absolutePath = path.join(root, relativePath);
  return fs.existsSync(absolutePath) || files.some((file) => file === relativePath || file.startsWith(`${relativePath}/`));
}

function isPublicSurface(file) {
  return (
    file === 'package.json' ||
    file === 'pnpm-lock.yaml' ||
    file === 'pnpm-workspace.yaml' ||
    file.startsWith('apps/') ||
    file.startsWith('packages/registry/') ||
    file.startsWith('packages/core/') ||
    file.startsWith('packages/sentinel/') ||
    file.startsWith('packages/cli/') ||
    file.startsWith('packages/claude-arm/') ||
    file.startsWith('packages/web-components/') ||
    file.startsWith('docs/') ||
    file.startsWith('.ai/') ||
    file.startsWith('.github/') ||
    file === 'README.md'
  );
}

const files = listKnownFiles();

for (const removePath of publicRemove) {
  if (fileExistsOrListed(files, removePath)) {
    addFinding('blocker', 'forbidden_public_path', 'Path must not exist in a public clean-room tree.', removePath);
  }
}

for (const file of files) {
  if (/^client_secret_.*\.json$/i.test(path.basename(file))) {
    addFinding('blocker', 'oauth_client_secret_file', 'OAuth client secret file must be evacuated before public export.', file);
  }
  if (file.endsWith('.tgz')) {
    addFinding('blocker', 'local_tarball_artifact', 'Local tarball artifacts must not be present in a public export.', file);
  }
  if (!isPublicSurface(file)) {
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
    addFinding('blocker', 'premium_reference_in_public_surface', 'Public surface references premium/private code, assets, or packages.', file);
  }
  if (/workspace:\*/.test(content) && file.endsWith('package.json')) {
    addFinding('warning', 'workspace_dependency_requires_public_rewrite', 'Public package metadata still uses workspace:* and needs publish-time review.', file);
  }
}

const workspacePath = path.join(root, 'pnpm-workspace.yaml');
if (fs.existsSync(workspacePath)) {
  const workspace = fs.readFileSync(workspacePath, 'utf8');
  if (/packages\/\*/.test(workspace)) {
    addFinding('blocker', 'workspace_includes_premium_glob', 'Public workspace must not include every packages/* entry while premium packages exist.', 'pnpm-workspace.yaml');
  }
}

const report = {
  schemaVersion: 1,
  generatedFrom: 'ONE/check-public-tree.mjs',
  generatedAt: new Date().toISOString(),
  mode: 'public-clean-room-simulation',
  result: findings.some((finding) => finding.severity === 'blocker') ? 'blocked' : 'ready',
  publicReleaseReady: !findings.some((finding) => finding.severity === 'blocker'),
  redacted: true,
  keep: publicKeep,
  remove: publicRemove,
  stub: publicStub,
  findings,
};

fs.mkdirSync(path.dirname(path.join(root, reportPath)), { recursive: true });
fs.writeFileSync(path.join(root, reportPath), `${JSON.stringify(report, null, 2)}\n`);

for (const finding of findings) {
  const prefix = finding.severity === 'blocker' ? 'error' : 'warning';
  console[finding.severity === 'blocker' ? 'error' : 'warn'](
    `public-tree ${prefix}: ${finding.id}${finding.path ? ` (${finding.path})` : ''}`,
  );
}

if (report.result === 'blocked') {
  console.error(`release:public-tree:check failed; report written to ${reportPath}`);
  process.exit(1);
}

console.log(`release:public-tree:check OK; report written to ${reportPath}`);
