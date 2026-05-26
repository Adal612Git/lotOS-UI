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

function requireFile(relativePath) {
  if (!exists(relativePath)) {
    fail(`Missing launch readiness file: ${relativePath}`);
    return '';
  }

  return read(relativePath);
}

function requireMarkers(label, content, markers) {
  for (const marker of markers) {
    if (!content.includes(marker)) {
      fail(`${label} missing marker: ${marker}`);
    }
  }
}

const launchRoute = requireFile('apps/web/app/team-access/launch-readiness/page.tsx');
requireMarkers('launch readiness route', launchRoute, [
  'isOwnerEmail',
  'Supabase migration applied staging',
  'RPC transactional enabled',
  'QA PRO_TRIAL tested',
  'Premium boundary verified',
]);

const feedbackRoute = requireFile('apps/web/app/feedback/page.tsx');
requireMarkers('feedback route', feedbackRoute, [
  'Tester feedback',
  'Que entendiste que vende LotOS UI?',
  'no guarda PII',
]);

const requiredDocs = [
  'docs/marketing/lotos-ui-launch-kit-2026-05-25.md',
  'docs/marketing/lotos-ui-demo-script-2026-05-25.md',
  'docs/marketing/lotos-ui-feedback-form-questions.md',
  'docs/marketing/screenshots/README.md',
  'docs/operacion/lotos-ui-npm-publish-readiness-2026-05-25.md',
  'docs/operacion/lotos-ui-analytics-adapter-2026-05-25.md',
  'docs/operacion/lotos-ui-performance-pass-2026-05-25.md',
  'docs/operacion/lotos-ui-black-diamond-rc-2026-05-25.md',
];

for (const docPath of requiredDocs) {
  const doc = requireFile(docPath);
  if (doc && !doc.includes('LotOS UI')) {
    fail(`${docPath} should be scoped to LotOS UI`);
  }
}

const blackDiamond = exists('docs/operacion/lotos-ui-black-diamond-rc-2026-05-25.md')
  ? read('docs/operacion/lotos-ui-black-diamond-rc-2026-05-25.md')
  : '';
requireMarkers('black diamond report', blackDiamond, [
  'RPC transaccional',
  'premium boundary',
  'campana de 50 testers',
  'campana masiva',
  'riesgos residuales',
]);

if (failures.length > 0) {
  console.error('verify:launch-readiness failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:launch-readiness OK (owner checklist, feedback loop, docs, and launch report present)');
