#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lotosManifest } from '../dist/index.js';

const registryDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(registryDir, '..', '..', '..');
const aiDir = path.join(root, '.ai');
const checkMode = process.argv.includes('--check');

function stableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeOrCheck(relativePath, value) {
  const target = path.join(root, relativePath);
  const next = stableJson({
    generatedFrom: 'packages/registry/src/lotos.manifest.ts',
    generatedAt: 'static',
    ...value,
  });

  if (checkMode) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
    if (current !== next) {
      console.error(`Registry drift: ${relativePath} is not generated from packages/registry.`);
      process.exitCode = 1;
    }
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, next);
  console.log(`generated ${relativePath}`);
}

fs.mkdirSync(aiDir, { recursive: true });

writeOrCheck('.ai/lotos.project-map.json', {
  product: lotosManifest.product,
  routes: lotosManifest.routes,
  validationCommands: lotosManifest.validation,
  safetyBoundaries: lotosManifest.aiRules,
  mcpEndpoints: lotosManifest.mcpTools.map((tool) => tool.endpoint),
  releaseReadiness: lotosManifest.releaseReadiness,
});

writeOrCheck('.ai/lotos.components.json', {
  rule: 'Public copy should say 8 free React exports plus 19 pro components, 27 total component contracts.',
  totals: {
    free: lotosManifest.components.filter((entry) => entry.tier === 'free').length,
    pro: lotosManifest.components.filter((entry) => entry.tier === 'pro').length,
    all: lotosManifest.components.length,
  },
  components: lotosManifest.components,
});

writeOrCheck('.ai/lotos.templates.json', {
  totals: {
    all: lotosManifest.templates.length,
    implementedPreview: lotosManifest.templates.filter((entry) => entry.previewRoute).length,
  },
  templates: lotosManifest.templates,
});

writeOrCheck('.ai/lotos.runtimes.json', {
  maturityScale: {
    stable: 'tested, documented, and fit for production use',
    beta: 'usable with documented limits',
    alpha: 'usable in controlled contexts',
    prototype: 'demo-quality implementation',
    planned: 'roadmap only',
  },
  runtimes: lotosManifest.runtimes,
});

writeOrCheck('.ai/lotos.themes.json', {
  themes: lotosManifest.themes,
});

writeOrCheck('.ai/lotos.pricing.json', {
  plans: lotosManifest.plans,
});

writeOrCheck('.ai/lotos.entitlements.json', {
  loginRule: 'Any normalized Google email may sign in. Owner status is only for administrative bypass and manual grants.',
  entitlementRule: 'Premium buyer access is controlled by Supabase entitlement rows and Lemon webhook unlocks.',
  plans: lotosManifest.plans,
  routes: lotosManifest.routes.entitlementGated,
  entitlementFlows: lotosManifest.entitlementFlows,
  lifecycleValidation: lotosManifest.releaseReadiness.lifecycleValidation,
});

writeOrCheck('.ai/lotos.assets.json', {
  permissions: lotosManifest.assetPermissions,
  premiumStubBoundaries: lotosManifest.premiumStubBoundaries,
  publicCleanRoom: lotosManifest.releaseReadiness.publicCleanRoom,
});

writeOrCheck('.ai/lotos.env.json', {
  env: lotosManifest.env,
  rule: 'Agents may name required env vars but must never print values.',
});

writeOrCheck('.ai/lotos.prompts.json', {
  prompts: lotosManifest.templates.map((template) => ({
    id: template.id,
    prompt: template.aiPrompt,
  })),
});

writeOrCheck('.ai/lotos.release-readiness.json', {
  releaseReadiness: lotosManifest.releaseReadiness,
  lifecycleValidation: lotosManifest.releaseReadiness.lifecycleValidation,
});

writeOrCheck('.ai/lotos.public-context.json', {
  status: lotosManifest.releaseReadiness.status,
  publicReleaseReady: lotosManifest.releaseReadiness.publicCleanRoom.ready,
  wideSalesReady: lotosManifest.releaseReadiness.lifecycleValidation.wide_sales_ready,
  publicRoutes: lotosManifest.routes.public,
  publicPackages: lotosManifest.assetPermissions
    .find((entry) => entry.id === 'public-packages')
    ?.paths.map((entry) => entry.replace('packages/', '@lotosui/')) ?? [],
  assetRules: lotosManifest.assetPermissions.map((entry) => ({
    id: entry.id,
    tier: entry.tier,
    pathCount: entry.paths.length,
    rule: entry.id === 'public-packages'
      ? entry.rule
      : 'Private surface is represented as metadata only in public context.',
  })),
  premiumStubBoundaries: lotosManifest.premiumStubBoundaries.map((entry) => ({
    id: entry.id,
    publicRepresentation: entry.publicRepresentation,
    message: entry.message,
    allowedPublicFields: entry.allowedPublicFields,
    forbiddenPublicFields: entry.forbiddenPublicFields,
  })),
  blockers: [
    'Evacuate and rotate local secrets before any public branch or package release.',
    'Detach premium source and private commercial bundles from the public worktree.',
    'Replace premium source/code references with metadata-only stubs.',
    'Regenerate public dependency graph, lockfile, AI context, and package tarball reports.',
  ],
  evidencePath: lotosManifest.releaseReadiness.publicCleanRoom.evidencePath,
});

writeOrCheck('.ai/lotos.commercial.json', {
  loginRule: 'Any normalized Google email may sign in. Owner status is only for administrative bypass and manual grants.',
  entitlementRule: 'Premium buyer access is controlled by Supabase entitlement rows and Lemon webhook unlocks.',
  plans: lotosManifest.plans,
  entitlementFlows: lotosManifest.entitlementFlows,
  lifecycleValidation: lotosManifest.releaseReadiness.lifecycleValidation,
  publicCleanRoom: lotosManifest.releaseReadiness.publicCleanRoom,
  privateSurfaces: lotosManifest.assetPermissions
    .filter((entry) => entry.id !== 'public-packages')
    .flatMap((entry) => entry.paths),
  requiredEnvGroups: lotosManifest.env,
});

if (checkMode && process.exitCode) {
  process.exit(process.exitCode);
}
