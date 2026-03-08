import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envLocalPath = join(repoRoot, "apps", "web", ".env.local");

function parseDotEnv(content) {
  const values = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1").trim();
    values[key] = value;
  }
  return values;
}

const envFromFile = existsSync(envLocalPath)
  ? parseDotEnv(readFileSync(envLocalPath, "utf8"))
  : {};

const getValue = (key) => {
  const fromProcess = process.env[key]?.trim();
  if (fromProcess) {
    return fromProcess;
  }
  const fromFile = envFromFile[key]?.trim();
  return fromFile || "";
};

const hasValue = (key) => getValue(key).length > 0;
const isLemonCheckoutUrl = (value) => {
  const normalized = value?.trim();

  if (!normalized) {
    return false;
  }

  try {
    const url = new URL(normalized);
    return /(^|\.)lemonsqueezy\.com$/i.test(url.hostname);
  } catch {
    return false;
  }
};
const failures = [];
const warnings = [];

const coreRuntimeKeys = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "AUTH_SECRET",
  "SUPABASE_URL",
];

const hasSupabaseServerKey = hasValue("SUPABASE_SERVICE_ROLE_KEY") || hasValue("SUPABASE_SECRET_KEY");

const soloDirectCheckout = hasValue("LOTOS_SOLO_CHECKOUT_URL");
const proDirectCheckout = hasValue("LOTOS_PRO_CHECKOUT_URL");
const launchDirectCheckout = hasValue("LOTOS_LAUNCH_PACK_URL");
const anyDirectCheckout = soloDirectCheckout || proDirectCheckout || launchDirectCheckout;
const anyFallbackPayment =
  hasValue("LOTOS_SOLO_PAYPAL_URL") ||
  hasValue("LOTOS_PRO_PAYPAL_URL") ||
  hasValue("LOTOS_LAUNCH_PACK_PAYPAL_URL");

if (!anyDirectCheckout && !anyFallbackPayment) {
  failures.push("No paid checkout or fallback payment links are configured.");
}

for (const key of coreRuntimeKeys) {
  if (!hasValue(key)) {
    failures.push(`Missing required web runtime key: ${key}`);
  }
}

if (!hasSupabaseServerKey) {
  failures.push("Missing Supabase server key: SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY.");
}

if (anyDirectCheckout && !hasValue("LEMON_WEBHOOK_SECRET")) {
  failures.push("LEMON_WEBHOOK_SECRET is required when direct checkout is enabled.");
}

if (soloDirectCheckout && !hasValue("LEMON_SOLO_VARIANT_ID")) {
  failures.push("LEMON_SOLO_VARIANT_ID is required when LOTOS_SOLO_CHECKOUT_URL is enabled.");
}

if (soloDirectCheckout && !isLemonCheckoutUrl(getValue("LOTOS_SOLO_CHECKOUT_URL"))) {
  failures.push("LOTOS_SOLO_CHECKOUT_URL must use a Lemon Squeezy checkout URL for automatic unlock.");
}

if (proDirectCheckout && !hasValue("LEMON_PRO_VARIANT_ID")) {
  failures.push("LEMON_PRO_VARIANT_ID is required when LOTOS_PRO_CHECKOUT_URL is enabled.");
}

if (proDirectCheckout && !isLemonCheckoutUrl(getValue("LOTOS_PRO_CHECKOUT_URL"))) {
  failures.push("LOTOS_PRO_CHECKOUT_URL must use a Lemon Squeezy checkout URL for automatic unlock.");
}

if (launchDirectCheckout && !hasValue("LEMON_LAUNCH_VARIANT_ID")) {
  failures.push("LEMON_LAUNCH_VARIANT_ID is required when LOTOS_LAUNCH_PACK_URL is enabled.");
}

if (launchDirectCheckout && !isLemonCheckoutUrl(getValue("LOTOS_LAUNCH_PACK_URL"))) {
  failures.push("LOTOS_LAUNCH_PACK_URL must use a Lemon Squeezy checkout URL for automatic unlock.");
}

if (launchDirectCheckout) {
  const requiredFullPaths = [
    "packages/pro/launch-exclusive/manifest.json",
    "packages/pro/launch-exclusive/google-sheets-command-kit.json",
    "packages/pro/launch-exclusive/microsoft-365-excel-web-kit.json",
    "packages/pro/launch-exclusive/outlook-approval-console.json",
    "packages/pro/launch-exclusive/executive-boardroom-surface.json",
    "packages/pro/launch-exclusive/power-bi-executive-visual-pack.json",
    "packages/pro/launch-exclusive/figma-token-sync-plugin.json",
  ];

  for (const relativePath of requiredFullPaths) {
    if (!existsSync(join(repoRoot, relativePath))) {
      failures.push(`Missing Full Signature payload source: ${relativePath}`);
    }
  }
}

if (!hasValue("LOTOS_OWNER_EMAILS")) {
  warnings.push("LOTOS_OWNER_EMAILS is empty. Manual owner grant flow will be unavailable.");
}

if (!existsSync(envLocalPath)) {
  warnings.push("apps/web/.env.local was not found. Using process environment only.");
}

if (failures.length > 0) {
  console.error("Go-live checkout verification failed.");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  if (warnings.length > 0) {
    console.error("Warnings:");
    for (const warning of warnings) {
      console.error(`- ${warning}`);
    }
  }
  process.exit(1);
}

console.log("Go-live checkout verification passed.");
if (warnings.length > 0) {
  for (const warning of warnings) {
    console.log(`Warning: ${warning}`);
  }
}
