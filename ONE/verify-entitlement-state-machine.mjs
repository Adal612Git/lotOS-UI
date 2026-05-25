#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const root = process.cwd();
const failures = [];
const sourcePath = path.join(root, 'apps', 'web', 'lib', 'entitlement-state-machine.ts');
const casesPath = path.join(root, 'apps', 'web', 'test', 'fixtures', 'entitlements', 'state-machine-cases.json');

function fail(message) {
  failures.push(message);
}

if (!fs.existsSync(sourcePath)) {
  fail('Missing apps/web/lib/entitlement-state-machine.ts');
}
if (!fs.existsSync(casesPath)) {
  fail('Missing state machine fixture cases.');
}

let decideEntitlementTransition = null;

if (fs.existsSync(sourcePath)) {
  const source = fs.readFileSync(sourcePath, 'utf8');
  for (const marker of [
    'revoked_requires_explicit_owner_reactivation',
    'paid_recovery_requires_reason_and_evidence',
    'invalid_entitlement_transition',
    'owner_paid_recovery',
    'webhook_payment_failed',
  ]) {
    if (!source.includes(marker)) {
      fail(`State machine source is missing marker: ${marker}`);
    }
  }

  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(output, {
    module,
    exports: module.exports,
    require: () => {
      throw new Error('State machine verifier does not allow runtime imports.');
    },
  });
  decideEntitlementTransition = module.exports.decideEntitlementTransition;
}

if (typeof decideEntitlementTransition !== 'function') {
  fail('State machine must export decideEntitlementTransition.');
}

if (typeof decideEntitlementTransition === 'function' && fs.existsSync(casesPath)) {
  const payload = JSON.parse(fs.readFileSync(casesPath, 'utf8'));
  if (payload.schemaVersion !== 1 || !Array.isArray(payload.cases)) {
    fail('State machine cases must use schemaVersion 1 and a cases array.');
  } else {
    for (const testCase of payload.cases) {
      const result = decideEntitlementTransition(
        testCase.from,
        testCase.to,
        testCase.cause,
        testCase.options ?? {}
      );

      if (result.ok !== testCase.ok) {
        fail(`${testCase.from}->${testCase.to}:${testCase.cause} expected ok=${testCase.ok} got ${result.ok}.`);
      }
      if (result.kind !== testCase.kind) {
        fail(`${testCase.from}->${testCase.to}:${testCase.cause} expected kind=${testCase.kind} got ${result.kind}.`);
      }
      if (testCase.code && result.code !== testCase.code) {
        fail(`${testCase.from}->${testCase.to}:${testCase.cause} expected code=${testCase.code} got ${result.code}.`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error('verify:entitlement-state-machine failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('verify:entitlement-state-machine OK');
