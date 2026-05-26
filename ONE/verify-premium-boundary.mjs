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

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function walk(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const entries = fs.readdirSync(directory, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolutePath) : [absolutePath];
  });
}

function requireMarkers(label, content, markers) {
  for (const marker of markers) {
    if (!content.includes(marker)) {
      fail(`${label} missing marker: ${marker}`);
    }
  }
}

const downloadRoutePath = 'apps/web/app/api/download/[asset]/route.ts';
if (!exists(downloadRoutePath)) {
  fail(`Missing protected download route: ${downloadRoutePath}`);
} else {
  const downloadRoute = read(downloadRoutePath);
  requireMarkers('download route', downloadRoute, [
    'resolveCurrentAccess',
    'accessDecision.allowed',
    'accessDecision.capabilities.downloads',
    'getProtectedAsset',
    'private, no-store',
    'X-Content-Type-Options',
  ]);
}

const commercialAssets = exists('apps/web/lib/commercial-assets.ts')
  ? read('apps/web/lib/commercial-assets.ts')
  : '';
requireMarkers('commercial assets helper', commercialAssets, [
  'private-assets',
  'getProtectedAsset',
  'sourceCandidates',
  'plan:',
]);

if (/public\/.*(premium|pro|launch|full|vault|private)/i.test(commercialAssets)) {
  fail('commercial assets helper appears to point protected assets at public paths');
}

const publicFiles = walk(path.join(root, 'apps', 'web', 'public'));
const suspiciousPublic = publicFiles
  .map((absolutePath) => path.relative(root, absolutePath).replaceAll(path.sep, '/'))
  .filter((relativePath) => /(premium|private|full-signature|launch-pack|pro-vault|vault).*?\.(zip|tgz|tar|json|html)$/i.test(relativePath));

for (const relativePath of suspiciousPublic) {
  fail(`Suspicious premium-like asset under public/: ${relativePath}`);
}

const vaultPages = [
  'apps/web/app/vault/solo/page.tsx',
  'apps/web/app/vault/pro/page.tsx',
  'apps/web/app/vault/launch/page.tsx',
];

for (const vaultPath of vaultPages) {
  if (!exists(vaultPath)) {
    fail(`Missing vault page: ${vaultPath}`);
    continue;
  }

  const content = read(vaultPath);
  if (content.includes('href={`/api/download/') || content.includes('href="/api/download/')) {
    continue;
  }

  fail(`${vaultPath} should route protected assets through /api/download`);
}

const authServer = exists('apps/web/lib/auth-server.ts') ? read('apps/web/lib/auth-server.ts') : '';
requireMarkers('auth server helper', authServer, ['resolveCurrentAccess', 'requiredPlan', 'redirect']);

if (failures.length > 0) {
  console.error('verify:premium-boundary failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:premium-boundary OK (downloads resolve centrally and no premium bundles were found in public/)');
