#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const cwd = process.cwd();
const failures = [];
const warnings = [];
const skipDirs = new Set(['.git', 'node_modules', '.next', 'dist', 'coverage', '.turbo', '.commercial-dist', '.pnpm-store']);
const textExtensions = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs', '.json', '.md', '.mdx', '.txt', '.toml', '.yml', '.yaml', '.env',
  '.example', '.css', '.scss', '.html', '.xml', '.sh', '.ps1', '.sql',
]);

const allowedSensitivePathPatterns = [
  /(^|[/\\])\.env\.example$/i,
  /(^|[/\\])\.env\.sample$/i,
];

const sensitivePathPatterns = [
  { name: 'local env file', pattern: /(^|[/\\])\.env(\..*)?$/i },
  { name: 'Vercel local env file', pattern: /(^|[/\\])\.vercel[/\\]\.env\.[^/\\]+$/i },
  { name: 'Google OAuth client secret file', pattern: /(^|[/\\])client_secret[^/\\]*\.json$/i },
  { name: 'Claude local settings file', pattern: /(^|[/\\])\.claude[/\\]settings\.local\.json$/i },
  { name: 'private key file', pattern: /\.(pem|p8|p12|key)$/i },
];

const secretValuePatterns = [
  { name: 'OpenAI API key', pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: 'GitHub token', pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/ },
  { name: 'NPM token', pattern: /\bnpm_[A-Za-z0-9_-]{20,}\b/ },
  { name: 'NPM auth token assignment', pattern: /_authToken\s*=\s*(?!%s\b|\$\{)[^\s"']{8,}/i },
  { name: 'Google API key', pattern: /\bAIza[0-9A-Za-z_-]{20,}\b/ },
  { name: 'OAuth client secret field', pattern: /"client_secret"\s*:\s*"[^"]{8,}"/i },
  { name: 'Google OAuth secret assignment', pattern: /\bGOOGLE_CLIENT_SECRET\s*=\s*["']?[^"'\s#]{8,}/ },
  { name: 'Auth secret assignment', pattern: /\bAUTH_SECRET\s*=\s*["']?[^"'\s#]{12,}/ },
  { name: 'Lemon secret assignment', pattern: /\bLEMON_[A-Z0-9_]*SECRET\b\s*=\s*["']?[^"'\s#]{8,}/ },
  { name: 'Supabase service key assignment', pattern: /\bSUPABASE_(SERVICE_ROLE_KEY|SECRET_KEY)\s*=\s*["']?[^"'\s#]{12,}/ },
  { name: 'NPM token assignment', pattern: /\bNPM(_PUBLISH)?_TOKEN\s*=\s*["']?[^"'\s#]{12,}/ },
  { name: 'JWT-like token', pattern: /\beyJ[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{12,}\.[A-Za-z0-9_-]{8,}\b/ },
  { name: 'private key block', pattern: /-----BEGIN (RSA |EC |OPENSSH |PRIVATE )?PRIVATE KEY-----/ },
];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function gitRootFor(directory) {
  try {
    return path.resolve(execFileSync('git', ['-C', directory, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim());
  } catch {
    return null;
  }
}

function gitFiles(root, args) {
  try {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).split('\0').filter(Boolean);
  } catch {
    return [];
  }
}

function normalize(relativePath) {
  return relativePath.replaceAll('\\', '/');
}

function walkFiles(root, current = root) {
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
      files.push(...walkFiles(root, absolutePath));
      continue;
    }
    if (entry.isFile()) {
      files.push(normalize(path.relative(root, absolutePath)));
    }
  }

  return files;
}

function isAllowedSensitivePath(relativePath) {
  return allowedSensitivePathPatterns.some((pattern) => pattern.test(relativePath));
}

function sensitivePathMatch(relativePath) {
  if (isAllowedSensitivePath(relativePath)) {
    return null;
  }
  return sensitivePathPatterns.find((entry) => entry.pattern.test(relativePath)) ?? null;
}

function shouldScan(relativePath, absolutePath) {
  const parts = relativePath.split(/[\\/]/);
  if (parts.some((part) => skipDirs.has(part))) {
    return false;
  }
  const extension = path.extname(relativePath).toLowerCase();
  if (textExtensions.has(extension) || relativePath.includes('.env') || relativePath.endsWith('.npmrc')) {
    return true;
  }
  return fs.existsSync(absolutePath) && fs.statSync(absolutePath).size < 256_000;
}

function validateEnvExample(root, relativePath) {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) {
    return;
  }
  const lines = fs.readFileSync(absolutePath, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      return;
    }
    const value = trimmed.slice(trimmed.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '');
    if (value && !/^<[^>]+>$/.test(value) && value !== 'placeholder' && value !== 'example') {
      fail(`${normalize(relativePath)}:${index + 1}: env example must not contain a real-looking value`);
    }
  });
}

function isInsideAny(root, relativePath, excludedRoots) {
  const absolutePath = path.resolve(root, relativePath);
  return excludedRoots.some((excludedRoot) => {
    const relativeToExcluded = path.relative(excludedRoot, absolutePath);
    return relativeToExcluded === '' || (!relativeToExcluded.startsWith('..') && !path.isAbsolute(relativeToExcluded));
  });
}

function scanRoot(root, excludedRoots = []) {
  const tracked = gitFiles(root, ['ls-files', '-z']);
  const unignored = gitFiles(root, ['ls-files', '--others', '--exclude-standard', '-z']);
  const filesystem = walkFiles(root);
  const files = Array.from(new Set([...tracked, ...unignored, ...filesystem]))
    .filter((relativePath) => !isInsideAny(root, relativePath, excludedRoots));

  for (const relativePath of files) {
    const normalized = normalize(relativePath);
    const sensitive = sensitivePathMatch(normalized);
    if (sensitive) {
      fail(`${normalized}: sensitive path present (${sensitive.name})`);
    }

    if (isAllowedSensitivePath(normalized)) {
      validateEnvExample(root, relativePath);
    }

    const absolutePath = path.join(root, relativePath);
    if (!fs.existsSync(absolutePath) || !fs.statSync(absolutePath).isFile()) {
      continue;
    }
    if (!shouldScan(normalized, absolutePath)) {
      continue;
    }

    const stat = fs.statSync(absolutePath);
    if (!sensitive && stat.size > 1_000_000) {
      continue;
    }

    const lines = fs.readFileSync(absolutePath, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
      if (isAllowedSensitivePath(normalized)) {
        return;
      }
      for (const detector of secretValuePatterns) {
        if (detector.pattern.test(line)) {
          fail(`${normalized}:${index + 1}: ${detector.name} detected`);
        }
      }
    });
  }

  return files.length;
}

const roots = new Set();
const currentRoot = gitRootFor(cwd);
if (currentRoot) {
  roots.add(currentRoot);
}

const parentRoot = gitRootFor(path.resolve(cwd, '..'));
if (parentRoot && parentRoot !== currentRoot && cwd.startsWith(parentRoot)) {
  roots.add(parentRoot);
  warn(`Nested workspace is inside another Git root: ${parentRoot}`);
}

let scanned = 0;
for (const root of roots) {
  const excludedRoots = root === parentRoot && parentRoot !== currentRoot && currentRoot ? [currentRoot] : [];
  scanned += scanRoot(root, excludedRoots);
}

for (const warning of warnings) {
  console.warn(`verify:no-secrets warning: ${warning}`);
}

if (failures.length > 0) {
  console.error('verify:no-secrets failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:no-secrets OK (${scanned} repo files checked across ${roots.size} git root(s))`);
