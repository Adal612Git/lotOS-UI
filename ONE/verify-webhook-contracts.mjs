#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const fixtureDir = path.join(root, 'apps', 'web', 'test', 'fixtures', 'lemon');
const mapperPath = path.join(root, 'apps', 'web', 'lib', 'webhooks', 'lemon-event-mapper.ts');
const routePath = path.join(root, 'apps', 'web', 'app', 'api', 'webhooks', 'lemon', 'route.ts');

const requiredFixtures = [
  'purchase_success',
  'subscription_created',
  'subscription_updated_active',
  'payment_failed',
  'payment_recovered',
  'subscription_paused',
  'subscription_resumed',
  'subscription_cancelled',
  'subscription_expired',
  'duplicate_event',
  'invalid_signature_shape',
  'unknown_event',
  'unmappable_event',
  'missing_email',
  'missing_plan',
  'missing_subscription_id',
];

const variantPlans = {
  var_fixture_solo: 'solo',
  var_fixture_pro: 'pro',
  var_fixture_launch: 'launch_pack',
};

function fail(message) {
  failures.push(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getEventName(fixture) {
  return fixture.payload?.meta?.event_name ?? 'unknown';
}

function getVariantId(fixture) {
  return fixture.payload?.data?.attributes?.variant_id
    ?? fixture.payload?.data?.attributes?.first_order_item?.variant_id
    ?? null;
}

function getUserEmail(fixture) {
  return fixture.payload?.data?.attributes?.user_email
    ?? fixture.payload?.meta?.custom_data?.user_email
    ?? null;
}

function hasSubscriptionId(fixture) {
  return Boolean(fixture.payload?.data?.attributes?.subscription_id);
}

function expectedActionFromFixture(fixture, mapper) {
  const eventName = getEventName(fixture);
  if (!mapper.includes(`${eventName}:`)) {
    return 'ignore_unknown';
  }
  if (!fixture.expectedMapping?.providerEventId) {
    return 'reject_unmappable';
  }
  if (!getUserEmail(fixture) || !variantPlans[getVariantId(fixture)]) {
    return 'reject_unmappable';
  }
  if (eventName.startsWith('subscription_payment_') && !hasSubscriptionId(fixture)) {
    return 'reject_unmappable';
  }
  return fixture.expectedMapping.action;
}

if (!fs.existsSync(fixtureDir)) {
  fail('Missing Lemon fixture directory.');
}
if (!fs.existsSync(mapperPath)) {
  fail('Missing Lemon event mapper.');
}
if (!fs.existsSync(routePath)) {
  fail('Missing Lemon webhook route.');
}

const mapper = fs.existsSync(mapperPath) ? fs.readFileSync(mapperPath, 'utf8') : '';
const route = fs.existsSync(routePath) ? fs.readFileSync(routePath, 'utf8') : '';

for (const marker of [
  'subscription_payment_recovered',
  'subscription_unpaused',
  'resolveSubscriptionUpdatedConfig',
  'readEmailCandidate',
  'Missing provider subscription id for subscription payment webhook',
]) {
  if (!mapper.includes(marker)) {
    fail(`Lemon mapper is missing contract marker: ${marker}`);
  }
}

for (const marker of [
  'validateSignature',
  'mapLemonWebhookEvent',
  'hasProcessedProviderEvent',
  'webhook_received',
  'webhook_applied',
  'webhook_failed',
]) {
  if (!route.includes(marker)) {
    fail(`Lemon route is missing contract marker: ${marker}`);
  }
}

if (route.includes('email: entitlement.user_email') || route.includes('user_email: entitlement.user_email')) {
  fail('Lemon route must not echo buyer email in responses.');
}

const fixtures = new Map();
if (fs.existsSync(fixtureDir)) {
  for (const name of requiredFixtures) {
    const fixturePath = path.join(fixtureDir, `${name}.json`);
    if (!fs.existsSync(fixturePath)) {
      fail(`Missing Lemon fixture: ${name}.json`);
      continue;
    }
    const fixtureText = fs.readFileSync(fixturePath, 'utf8');
    const fixture = JSON.parse(fixtureText);
    fixtures.set(name, fixture);

    if (fixture.fixtureSchemaVersion !== 1) {
      fail(`${name}: fixtureSchemaVersion must be 1.`);
    }
    if (fixture.provider !== 'lemon_squeezy') {
      fail(`${name}: provider must be lemon_squeezy.`);
    }
    if (fixtureText.includes('gmail.com') || fixtureText.includes('@lotos') || fixtureText.includes('sk_')) {
      fail(`${name}: fixture may contain a real-looking email or secret marker.`);
    }
    const email = getUserEmail(fixture);
    if (email && !String(email).endsWith('@example.test')) {
      fail(`${name}: fixture emails must use example.test.`);
    }
    if (fixture.request?.headers?.['x-signature'] !== '__TEST_GENERATED__'
      && fixture.request?.headers?.['x-signature'] !== '__INVALID_TEST_SIGNATURE__') {
      fail(`${name}: fixture signature must be a test placeholder.`);
    }
    if (fixture.expectedRoute?.upsert && fixture.expectedRoute.status !== 200) {
      fail(`${name}: upsert fixtures must expect HTTP 200.`);
    }
    if (fixture.expectedRoute?.status === 401 && fixture.expectedRoute?.upsert !== false) {
      fail(`${name}: invalid signature fixtures must not upsert.`);
    }

    const expectedAction = expectedActionFromFixture(fixture, mapper);
    if (fixture.expectedMapping?.action !== expectedAction) {
      fail(`${name}: expected action ${fixture.expectedMapping?.action} does not match local contract ${expectedAction}.`);
    }

    const variantId = getVariantId(fixture);
    const expectedPlan = variantPlans[variantId] ?? null;
    if (fixture.expectedMapping?.action !== 'ignore_unknown' && fixture.expectedMapping?.plan !== expectedPlan) {
      fail(`${name}: expected plan ${fixture.expectedMapping?.plan} does not match fake variant ${variantId}.`);
    }
  }
}

const duplicate = fixtures.get('duplicate_event');
const purchase = fixtures.get('purchase_success');
if (duplicate && purchase && duplicate.expectedMapping.providerEventId !== purchase.expectedMapping.providerEventId) {
  fail('duplicate_event must reuse purchase_success providerEventId.');
}

const docs = fs.existsSync(path.join(fixtureDir, 'README.md'))
  ? fs.readFileSync(path.join(fixtureDir, 'README.md'), 'utf8')
  : '';
for (const marker of ['not copied from Lemon', 'example.test', 'Do not commit real webhook']) {
  if (!docs.includes(marker)) {
    fail(`Lemon fixture README missing marker: ${marker}`);
  }
}

if (failures.length > 0) {
  console.error('verify:webhook-contracts failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`verify:webhook-contracts OK (${requiredFixtures.length} sanitized fixtures)`);
