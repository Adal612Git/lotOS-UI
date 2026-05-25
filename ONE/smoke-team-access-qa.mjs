#!/usr/bin/env node

const baseUrl = (process.env.LOTOS_QA_SMOKE_BASE_URL ?? 'https://lotos-ui.vercel.app').replace(/\/$/, '');
const phone = process.env.LOTOS_QA_SMOKE_PHONE;
const failures = [];

function fail(message) {
  failures.push(message);
}

async function request(path, options = {}) {
  return fetch(`${baseUrl}${path}`, {
    redirect: 'manual',
    ...options,
    headers: {
      ...(options.headers ?? {}),
    },
  });
}

if (!phone) {
  console.log('smoke:team-access-qa skipped. Set LOTOS_QA_SMOKE_PHONE to run the production phone flow.');
  process.exit(0);
}

const activation = await request('/api/tester-access', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ phone }),
});
const activationBody = await activation.json().catch(() => ({}));
const setCookie = activation.headers.get('set-cookie') ?? '';
const cookie = setCookie.split(';')[0];

if (activation.status !== 200 || activationBody.ok !== true) {
  fail(`activation expected 200/ok, got ${activation.status}`);
}
if (activationBody.plan !== 'launch_pack') {
  fail(`activation expected launch_pack, got ${activationBody.plan}`);
}
if (!cookie.startsWith('lotos_tester_access=')) {
  fail('activation did not return lotos_tester_access cookie');
}

const protectedPaths = [
  '/api/tester-access',
  '/vault',
  '/vault/solo',
  '/vault/pro',
  '/vault/launch',
  '/playground',
  '/templates',
  '/demo/components',
  '/api/download/sales-preview',
];

for (const path of protectedPaths) {
  const response = await request(path, {
    headers: {
      Cookie: cookie,
    },
  });

  if (path === '/api/tester-access') {
    const body = await response.json().catch(() => ({}));
    if (body.qaCookieDetected !== true || body.tier !== 'launch_pack') {
      fail(`${path} expected qaCookieDetected true and launch_pack`);
    }
  }

  if (response.status !== 200) {
    fail(`${path} expected 200, got ${response.status}`);
  }
}

if (failures.length > 0) {
  console.error('smoke:team-access-qa failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`smoke:team-access-qa OK (${baseUrl})`);
