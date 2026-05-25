#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const findings = [];
const scanned = [];
const scopes = [
  'README.md',
  'apps/docs/README.md',
  'apps/docs/content',
  'apps/docs/app',
  'apps/web/app',
  'packages/registry/README.md',
  'packages/core/README.md',
  'packages/sentinel/README.md',
  'packages/cli/README.md',
  'packages/claude-arm/README.md',
  'packages/web-components/README.md',
];
const skipDirs = new Set(['node_modules', '.next', 'dist', 'coverage', '.turbo']);
const textExtensions = new Set(['.md', '.mdx', '.tsx', '.ts', '.json']);
const reservedEmailDomains = new Set(['example.com', 'example.org', 'example.net', 'example.test', 'localhost']);

function addFinding(severity, id, file, line = null) {
  findings.push({ severity, id, path: file, line });
}

function walk(relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return [];
  }
  const stat = fs.statSync(absolutePath);
  if (stat.isFile()) {
    return [relativePath.replaceAll('\\', '/')];
  }
  if (!stat.isDirectory()) {
    return [];
  }
  const files = [];
  for (const entry of fs.readdirSync(absolutePath, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) {
      continue;
    }
    const child = path.join(relativePath, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      files.push(...walk(child));
    } else if (entry.isFile()) {
      files.push(child);
    }
  }
  return files;
}

function emailDomain(email) {
  const at = email.lastIndexOf('@');
  return at >= 0 ? email.slice(at + 1).toLowerCase() : '';
}

const files = Array.from(new Set(scopes.flatMap(walk))).filter((file) => textExtensions.has(path.extname(file).toLowerCase()));

for (const file of files) {
  const absolutePath = path.join(root, file);
  if (!fs.existsSync(absolutePath) || fs.statSync(absolutePath).size > 2_000_000) {
    continue;
  }
  scanned.push(file);
  const lines = fs.readFileSync(absolutePath, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    if (/C:\\Users\\|\/Users\/|client_secret_|\.vercel\/\.env|\.env\.local/.test(line)) {
      addFinding('blocker', 'local_or_secret_path_in_public_docs', file, lineNumber);
    }
    if (/npm\s+(install|i)\s+@lotosui\/claude-arm-pro|from\s+['"]@lotosui\/claude-arm-pro/.test(line)) {
      addFinding('blocker', 'premium_package_instruction_in_public_docs', file, lineNumber);
    }
    if (/packages\/claude-arm-pro|packages\/pro\/\.private-dist|\.commercial-dist/.test(line)) {
      addFinding('warning', 'private_path_reference_requires_clean_room_context', file, lineNumber);
    }
    if (/(secret|token|password|webhook)[A-Z0-9_ -]*=/.test(line)) {
      addFinding('blocker', 'secret_assignment_shape_in_public_docs', file, lineNumber);
    }
    const emails = line.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
    for (const email of emails) {
      if (!reservedEmailDomains.has(emailDomain(email)) && !email.toLowerCase().endsWith('@lotos.dev')) {
        addFinding('warning', 'non_reserved_email_in_public_docs', file, lineNumber);
      }
    }
    if (/public release ready|wide sales ready/i.test(line) && !/blocked|not|no/i.test(line)) {
      addFinding('blocker', 'unsafe_ready_claim_in_public_docs', file, lineNumber);
    }
  });
}

const report = {
  schemaVersion: 1,
  generatedFrom: 'ONE/verify-public-docs.mjs',
  generatedAt: new Date().toISOString(),
  result: findings.some((finding) => finding.severity === 'blocker') ? 'blocked' : 'ready',
  publicDocsReady: !findings.some((finding) => finding.severity === 'blocker'),
  redacted: true,
  scanned,
  findings,
};

fs.mkdirSync(path.join(root, '.release'), { recursive: true });
fs.writeFileSync(path.join(root, '.release/public-docs-report.json'), `${JSON.stringify(report, null, 2)}\n`);

for (const finding of findings) {
  const log = finding.severity === 'blocker' ? console.error : console.warn;
  log(`verify:public-docs ${finding.severity}: ${finding.id} (${finding.path}${finding.line ? `:${finding.line}` : ''})`);
}

if (report.result === 'blocked') {
  console.error('verify:public-docs failed; report written to .release/public-docs-report.json');
  process.exit(1);
}

console.log(`verify:public-docs OK (${findings.length} warnings, report written to .release/public-docs-report.json)`);
