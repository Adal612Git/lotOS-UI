#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const publicPackages = [
  'packages/registry',
  'packages/core',
  'packages/sentinel',
  'packages/cli',
  'packages/claude-arm',
  'packages/web-components',
];

function fail(message) {
  failures.push(message);
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function validateExportTarget(packageDir, exportName, target) {
  if (typeof target === 'string') {
    if (!exists(path.join(packageDir, target))) {
      fail(`${packageDir} export ${exportName} points to missing file: ${target}`);
    }
    return;
  }

  for (const field of ['import', 'types']) {
    if (!target[field]) {
      fail(`${packageDir} export ${exportName} is missing ${field}.`);
      continue;
    }
    if (!exists(path.join(packageDir, target[field]))) {
      fail(`${packageDir} export ${exportName}.${field} points to missing file: ${target[field]}`);
    }
  }
}

for (const packageDir of publicPackages) {
  const packagePath = `${packageDir}/package.json`;
  if (!exists(packagePath)) {
    fail(`Missing package.json: ${packagePath}`);
    continue;
  }
  const packageJson = readJson(packagePath);

  if (packageJson.private === true) {
    fail(`${packageJson.name} is marked private but is in the public package allowlist.`);
  }
  if (packageJson.publishConfig?.access !== 'public') {
    fail(`${packageJson.name} must set publishConfig.access=public.`);
  }
  if (!packageJson.exports || typeof packageJson.exports !== 'object') {
    fail(`${packageJson.name} must define package exports.`);
  } else {
    for (const [exportName, target] of Object.entries(packageJson.exports)) {
      validateExportTarget(packageDir, exportName, target);
    }
  }
  if (packageJson.bin) {
    for (const [binName, binPath] of Object.entries(packageJson.bin)) {
      if (!exists(path.join(packageDir, binPath))) {
        fail(`${packageJson.name} bin ${binName} points to missing file: ${binPath}`);
      } else {
        const firstLine = fs.readFileSync(path.join(root, packageDir, binPath), 'utf8').split(/\r?\n/)[0];
        if (!firstLine.startsWith('#!/usr/bin/env node')) {
          fail(`${packageJson.name} bin ${binName} is missing node shebang.`);
        }
      }
    }
  }
}

const corePackage = readJson('packages/core/package.json');
if (!corePackage.exports['./mcp']) {
  fail('@lotosui/core must export ./mcp because README and docs reference @lotosui/core/mcp.');
}

if (failures.length > 0) {
  console.error('verify:package-exports failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:package-exports OK (${publicPackages.length} public packages)`);
