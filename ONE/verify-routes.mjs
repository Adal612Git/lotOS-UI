#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { lotosManifest } from '../packages/registry/dist/index.js';

const root = process.cwd();
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

function walkFiles(directory, predicate, files = []) {
  if (!fs.existsSync(directory)) {
    return files;
  }
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      walkFiles(absolutePath, predicate, files);
    } else if (predicate(absolutePath)) {
      files.push(absolutePath);
    }
  }
  return files;
}

function normalizeRoute(segment) {
  if (segment === 'page.tsx') {
    return '';
  }
  return segment
    .replace(/[/\\]page\.tsx$/, '')
    .replace(/[/\\]route\.ts$/, '')
    .replaceAll('\\', '/');
}

function collectAppRoutes(appRoot) {
  const routes = new Set();
  const files = walkFiles(appRoot, (file) => file.endsWith('page.tsx') || file.endsWith('route.ts'));
  for (const file of files) {
    const relative = path.relative(appRoot, file);
    const route = `/${normalizeRoute(relative)}`.replace(/\/$/, '') || '/';
    routes.add(route);
  }
  return routes;
}

function collectPublicRoutes(publicRoot) {
  const routes = new Set();
  const files = walkFiles(publicRoot, (file) => fs.statSync(file).isFile());
  for (const file of files) {
    routes.add(`/${path.relative(publicRoot, file).replaceAll('\\', '/')}`);
  }
  return routes;
}

const webRoutes = collectAppRoutes(path.join(root, 'apps/web/app'));
for (const route of collectPublicRoutes(path.join(root, 'apps/web/public'))) {
  webRoutes.add(route);
}
const docsRoutes = collectAppRoutes(path.join(root, 'apps/docs/app'));

function routeExists(route) {
  if (route === '/docs') {
    return docsRoutes.has('/docs/[[...slug]]') || webRoutes.has('/docs');
  }
  return webRoutes.has(route) || docsRoutes.has(route);
}

const manifestRoutes = Object.values(lotosManifest.routes).flat();
for (const route of manifestRoutes) {
  if (!routeExists(route)) {
    fail(`Manifest route is not backed by a web/docs route or public asset: ${route}`);
  }
}

for (const template of lotosManifest.templates) {
  if (template.previewRoute && !routeExists(template.previewRoute)) {
    fail(`Template ${template.id} previewRoute is not backed by a route: ${template.previewRoute}`);
  }
}

for (const route of webRoutes) {
  if (route.startsWith('/api/') || route === '/favicon.ico') {
    continue;
  }
  if (!manifestRoutes.includes(route) && !route.startsWith('/demo/')) {
    warn(`Web route is not classified in registry routes: ${route}`);
  }
}

for (const warning of warnings) {
  console.warn(`verify:routes warning: ${warning}`);
}

if (failures.length > 0) {
  console.error('verify:routes failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:routes OK (${webRoutes.size} web routes/assets, ${docsRoutes.size} docs routes)`);
