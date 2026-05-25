#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const root = process.cwd();
const failures = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) {
    fail(message);
  }
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function loadTsModule(relativePath, imports = {}) {
  const source = read(relativePath);
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  const module = { exports: {} };
  const sandbox = {
    exports: module.exports,
    module,
    require(id) {
      if (imports[id]) {
        return imports[id];
      }
      throw new Error(`Unexpected require from ${relativePath}: ${id}`);
    },
  };

  vm.runInNewContext(compiled, sandbox, { filename: relativePath });
  return module.exports;
}

const testerPolicy = loadTsModule('apps/web/lib/tester-access-policy.ts');
const phoneCases = [
  ['+52 (1) 331-234-5678', '5213312345678'],
  ['52 33 1234 5678', '523312345678'],
  ['0033 1234 5678', '3312345678'],
  ['331-234-5678', '3312345678'],
  ['123456789', null],
];

for (const [input, expected] of phoneCases) {
  assert(
    testerPolicy.normalizeTesterPhone(input) === expected,
    `normalizeTesterPhone(${input}) expected ${expected}`
  );
}

const localCandidates = testerPolicy.getTesterPhoneCandidates('3312345678');
assert(localCandidates.includes('523312345678'), '10-digit MX candidate must include 52 prefix');
assert(localCandidates.includes('5213312345678'), '10-digit MX candidate must include 521 prefix');
assert(localCandidates.includes('573312345678'), '10-digit CO candidate must include 57 prefix');
assert(
  testerPolicy.getTesterPhoneCandidates('5213312345678').includes('523312345678'),
  '521 MX candidate must include equivalent 52 variant'
);

const planRank = {
  free: 0,
  solo: 1,
  pro: 2,
  launch_pack: 3,
};
const accessPolicy = loadTsModule('apps/web/lib/access-policy.ts', {
  './plans': {
    planSatisfies(granted, required) {
      return planRank[granted] >= planRank[required];
    },
  },
});
const qaDecision = accessPolicy.buildAccessDecision({
  plan: 'launch_pack',
  source: 'qa_phone',
  expiresAt: '2026-06-08T00:00:00.000Z',
});

assert(qaDecision.tier === 'launch_pack', 'QA decision must resolve launch_pack');
assert(qaDecision.source === 'qa_phone', 'QA decision must report qa_phone source');
assert(qaDecision.capabilities.vaultFull === true, 'QA launch_pack must unlock Full vault');
assert(qaDecision.capabilities.downloads === true, 'QA launch_pack must unlock downloads');
assert(qaDecision.capabilities.playground === true, 'QA launch_pack must expose playground');
assert(qaDecision.capabilities.templates === true, 'QA launch_pack must expose templates');
assert(qaDecision.capabilities.componentCatalog === true, 'QA launch_pack must expose component catalog');
assert(accessPolicy.accessSatisfies(qaDecision, 'launch_pack') === true, 'QA launch_pack must satisfy launch');
assert(accessPolicy.getRequiredPlanForPath('/vault/launch') === 'launch_pack', 'launch route plan mismatch');
assert(accessPolicy.getRequiredPlanForPath('/vault/pro') === 'pro', 'pro route plan mismatch');
assert(accessPolicy.getRequiredPlanForPath('/vault/solo') === 'solo', 'solo route plan mismatch');

const publicDecision = accessPolicy.buildAccessDecision({ plan: 'free', source: 'public' });
assert(publicDecision.capabilities.downloads === false, 'public access must not unlock downloads');
assert(publicDecision.capabilities.templates === true, 'public access should keep templates open');

const testerRoute = read('apps/web/app/api/tester-access/route.ts');
assert(!testerRoute.includes('Google sign-in is required'), 'tester route must not require Google');
assert(testerRoute.includes('qaCookieDetected'), 'tester status endpoint must report QA cookie detection');

const teamPage = read('apps/web/app/team-access/page.tsx');
assert(teamPage.includes('Mapa de accesos QA'), 'team access page must include QA route map');
assert(teamPage.includes('/demo/components'), 'team access page must link component catalog');
assert(teamPage.includes('/api/download/sales-preview'), 'team access page must link protected test download');

const proxy = read('apps/web/proxy.ts');
assert(proxy.includes('redirectToTeamAccess'), 'premium middleware should redirect anonymous users to team access');
assert(proxy.includes('isTesterPhoneHashAuthorized'), 'premium middleware must validate QA phone cookie hash');

if (failures.length > 0) {
  console.error('verify:team-access-qa failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:team-access-qa OK');
