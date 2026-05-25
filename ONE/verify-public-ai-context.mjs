#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const findings = [];
const scanned = [];
const scopes = [
  '.ai',
  '.release/release-notes.json',
  '.release/lifecycle-validation.json',
  '.release/public-release-blockers.md',
  'packages/core/src/mcp',
  'docs/AI_ONBOARDING.md',
  'docs/MCP_REFERENCE.md',
  'docs/REGISTRY_REFERENCE.md',
];
const textExtensions = new Set(['.json', '.ts', '.js', '.mjs', '.md']);

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
    const child = path.join(relativePath, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) {
      files.push(...walk(child));
    } else if (entry.isFile()) {
      files.push(child);
    }
  }
  return files;
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
    if (/packages\/claude-arm-pro|packages\/pro|\.commercial-dist|\.private-dist/.test(line)) {
      addFinding('blocker', 'private_path_in_public_ai_context', file, lineNumber);
    }
    if (/client_secret_|\.env\.local|\.vercel\/\.env|C:\\Users\\|\/Users\//.test(line)) {
      addFinding('blocker', 'local_secret_path_shape_in_public_ai_context', file, lineNumber);
    }
    if (/[A-Z0-9_]*(SECRET|TOKEN|PASSWORD|PRIVATE_KEY)[A-Z0-9_]*\s*=/.test(line)) {
      addFinding('blocker', 'secret_assignment_shape_in_public_ai_context', file, lineNumber);
    }
    if (/ownerEmails|LOTOS_OWNER_EMAILS.*@|createdByOwnerEmail.*@/.test(line)) {
      addFinding('blocker', 'owner_identity_in_public_ai_context', file, lineNumber);
    }
    if (/publicReleaseReady["']?\s*:\s*true|public release ready/i.test(line)) {
      addFinding('blocker', 'unsafe_public_ready_claim_in_ai_context', file, lineNumber);
    }
    if (/private workspace mode/i.test(line)) {
      addFinding('warning', 'private_workspace_note_in_public_ai_context', file, lineNumber);
    }
  });
}

const report = {
  schemaVersion: 1,
  generatedFrom: 'ONE/verify-public-ai-context.mjs',
  generatedAt: new Date().toISOString(),
  result: findings.some((finding) => finding.severity === 'blocker') ? 'blocked' : 'ready',
  publicAiContextReady: !findings.some((finding) => finding.severity === 'blocker'),
  redacted: true,
  scanned,
  findings,
};

fs.mkdirSync(path.join(root, '.release'), { recursive: true });
fs.writeFileSync(path.join(root, '.release/public-ai-context-report.json'), `${JSON.stringify(report, null, 2)}\n`);

for (const finding of findings) {
  const log = finding.severity === 'blocker' ? console.error : console.warn;
  log(`verify:public-ai-context ${finding.severity}: ${finding.id} (${finding.path}${finding.line ? `:${finding.line}` : ''})`);
}

if (report.result === 'blocked') {
  console.error('verify:public-ai-context failed; report written to .release/public-ai-context-report.json');
  process.exit(1);
}

console.log(`verify:public-ai-context OK (${findings.length} warnings, report written to .release/public-ai-context-report.json)`);
