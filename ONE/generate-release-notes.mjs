#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { lotosManifest } from '../packages/registry/dist/index.js';

const root = process.cwd();
const releaseDir = path.join(root, '.release');
fs.mkdirSync(releaseDir, { recursive: true });

const publicPackages = [
  '@lotosui/registry',
  '@lotosui/core',
  '@lotosui/sentinel',
  '@lotosui/cli',
  '@lotosui/claude-arm',
  '@lotosui/web-components',
];

const releaseNotes = {
  generatedFrom: 'packages/registry/src/lotos.manifest.ts',
  product: lotosManifest.product,
  releaseReadiness: lotosManifest.releaseReadiness,
  totals: {
    components: lotosManifest.components.length,
    freeComponents: lotosManifest.components.filter((entry) => entry.tier === 'free').length,
    proComponents: lotosManifest.components.filter((entry) => entry.tier === 'pro').length,
    templates: lotosManifest.templates.length,
    runtimes: lotosManifest.runtimes.length,
    themes: lotosManifest.themes.length,
  },
  publicPackages,
  blockers: lotosManifest.releaseReadiness.blockers,
};

const markdown = `# LotOS UI Release Notes

Generated from \`packages/registry/src/lotos.manifest.ts\`.

## Product

- Name: ${lotosManifest.product.name}
- Version: ${lotosManifest.product.versionName}
- Status: ${lotosManifest.releaseReadiness.status}
- Score: ${lotosManifest.releaseReadiness.score}

## Registry Totals

- Components: ${releaseNotes.totals.components} (${releaseNotes.totals.freeComponents} free, ${releaseNotes.totals.proComponents} pro)
- Templates: ${releaseNotes.totals.templates}
- Runtimes: ${releaseNotes.totals.runtimes}
- Themes: ${releaseNotes.totals.themes}

## Public Package Allowlist

${publicPackages.map((pkg) => `- \`${pkg}\``).join('\n')}

## Human Blockers

${lotosManifest.releaseReadiness.blockers.map((blocker) => `- ${blocker}`).join('\n')}
`;

fs.writeFileSync(path.join(releaseDir, 'release-notes.json'), `${JSON.stringify(releaseNotes, null, 2)}\n`);
fs.writeFileSync(path.join(releaseDir, 'release-notes.md'), markdown);
console.log('generated .release/release-notes.json');
console.log('generated .release/release-notes.md');
