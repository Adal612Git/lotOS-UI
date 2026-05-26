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

const visualRoutes = [
  ['/', 'apps/web/app/page.tsx', []],
  ['/free', 'apps/web/app/free/page.tsx', []],
  ['/claim', 'apps/web/app/claim/page.tsx', []],
  ['/pricing', 'apps/web/app/pricing/page.tsx', []],
  ['/demo/student-control', 'apps/web/app/demo/student-control/page.tsx', ['apps/web/app/demo/student-control/student-control-client.tsx']],
  ['/demo/components', 'apps/web/app/demo/components/page.tsx', ['apps/web/app/demo/components/components-catalog-client.tsx']],
  ['/demo/operator', 'apps/web/app/demo/operator/page.tsx', ['apps/web/app/demo/operator/operator-demo-client.tsx']],
  ['/account/access', 'apps/web/app/account/access/page.tsx', []],
  ['/feedback', 'apps/web/app/feedback/page.tsx', []],
];

for (const [route, relativePath, companionPaths] of visualRoutes) {
  if (!exists(relativePath)) {
    fail(`${route} missing route file: ${relativePath}`);
    continue;
  }

  const content = [read(relativePath), ...companionPaths.filter(exists).map(read)].join('\n');
  if (!content.includes('metadata') && !content.includes('buildRouteMetadata')) {
    fail(`${route} is missing route metadata marker`);
  }
  if (!content.includes('<Link') && !content.includes('href=') && route !== '/') {
    fail(`${route} should expose at least one navigational CTA`);
  }
}

const css = exists('apps/web/app/lotos-landing.css') ? read('apps/web/app/lotos-landing.css') : '';
for (const marker of ['@media (max-width: 940px)', 'hero-actions', 'claim-shell', 'free-hero', 'account-access-hero']) {
  if (!css.includes(marker)) {
    fail(`lotos-landing.css missing visual smoke marker: ${marker}`);
  }
}

const checklistPath = 'docs/operacion/lotos-ui-visual-qa-checklist-2026-05-25.md';
if (!exists(checklistPath)) {
  fail(`Missing manual visual QA checklist: ${checklistPath}`);
} else {
  const checklist = read(checklistPath);
  for (const marker of ['mobile', 'tablet', 'desktop', 'no horizontal scroll', 'no error boundaries']) {
    if (!checklist.toLowerCase().includes(marker)) {
      fail(`visual QA checklist missing marker: ${marker}`);
    }
  }
}

if (failures.length > 0) {
  console.error('verify:visual-smoke failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:visual-smoke OK (${visualRoutes.length} route files and manual checklist checked)`);
