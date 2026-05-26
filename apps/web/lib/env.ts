import { z } from 'zod';

const optionalString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.trim().length === 0 ? undefined : value;
}, z.string().trim().min(1).optional());

const envSchema = z.object({
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,
  AUTH_SECRET: optionalString,
  SUPABASE_URL: optionalString,
  SUPABASE_PUBLISHABLE_KEY: optionalString,
  SUPABASE_SECRET_KEY: optionalString,
  SUPABASE_ANON_KEY: optionalString,
  SUPABASE_SERVICE_ROLE_KEY: optionalString,
  LEMON_WEBHOOK_SECRET: optionalString,
  LEMON_STORE_SLUG: optionalString,
  LEMON_SOLO_VARIANT_ID: optionalString,
  LEMON_PRO_VARIANT_ID: optionalString,
  LEMON_LAUNCH_VARIANT_ID: optionalString,
  ENTITLEMENT_AUDIT_HASH_PEPPER: optionalString,
  LOTOS_OWNER_EMAILS: optionalString,
  LOTOS_TESTER_PHONE_HASHES: optionalString,
  LOTOS_CONTACT_SALES_URL: optionalString,
  LOTOS_BOOKING_URL: optionalString,
  LOTOS_SOLO_CHECKOUT_URL: optionalString,
  LOTOS_SOLO_PAYPAL_URL: optionalString,
  LOTOS_PRO_CHECKOUT_URL: optionalString,
  LOTOS_PRO_PAYPAL_URL: optionalString,
  LOTOS_LAUNCH_PACK_URL: optionalString,
  LOTOS_LAUNCH_PACK_PAYPAL_URL: optionalString,
  LOTOS_PREMIUM_PREVIEW_URL: optionalString,
  LOTOS_PRIVATE_ASSETS_ROOT: optionalString,
  LOTOS_PROVIDER_LEGAL_NAME: optionalString,
  LOTOS_PROVIDER_RFC: optionalString,
  LOTOS_PROVIDER_ADDRESS: optionalString,
  LOTOS_PROVIDER_EMAIL: optionalString,
  LOTOS_SUPPORT_EMAIL: optionalString,
  LOTOS_SUPPORT_HOURS: optionalString,
  LOTOS_SUBSCRIPTION_PORTAL_URL: optionalString,
});

const parsed = envSchema.parse({
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  AUTH_SECRET: process.env.AUTH_SECRET,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  LEMON_WEBHOOK_SECRET: process.env.LEMON_WEBHOOK_SECRET,
  LEMON_STORE_SLUG: process.env.LEMON_STORE_SLUG,
  LEMON_SOLO_VARIANT_ID: process.env.LEMON_SOLO_VARIANT_ID,
  LEMON_PRO_VARIANT_ID: process.env.LEMON_PRO_VARIANT_ID,
  LEMON_LAUNCH_VARIANT_ID: process.env.LEMON_LAUNCH_VARIANT_ID,
  ENTITLEMENT_AUDIT_HASH_PEPPER: process.env.ENTITLEMENT_AUDIT_HASH_PEPPER,
  LOTOS_OWNER_EMAILS: process.env.LOTOS_OWNER_EMAILS,
  LOTOS_TESTER_PHONE_HASHES: process.env.LOTOS_TESTER_PHONE_HASHES,
  LOTOS_CONTACT_SALES_URL: process.env.LOTOS_CONTACT_SALES_URL,
  LOTOS_BOOKING_URL: process.env.LOTOS_BOOKING_URL,
  LOTOS_SOLO_CHECKOUT_URL: process.env.LOTOS_SOLO_CHECKOUT_URL,
  LOTOS_SOLO_PAYPAL_URL: process.env.LOTOS_SOLO_PAYPAL_URL,
  LOTOS_PRO_CHECKOUT_URL: process.env.LOTOS_PRO_CHECKOUT_URL,
  LOTOS_PRO_PAYPAL_URL: process.env.LOTOS_PRO_PAYPAL_URL,
  LOTOS_LAUNCH_PACK_URL: process.env.LOTOS_LAUNCH_PACK_URL,
  LOTOS_LAUNCH_PACK_PAYPAL_URL: process.env.LOTOS_LAUNCH_PACK_PAYPAL_URL,
  LOTOS_PREMIUM_PREVIEW_URL: process.env.LOTOS_PREMIUM_PREVIEW_URL,
  LOTOS_PRIVATE_ASSETS_ROOT: process.env.LOTOS_PRIVATE_ASSETS_ROOT,
  LOTOS_PROVIDER_LEGAL_NAME: process.env.LOTOS_PROVIDER_LEGAL_NAME,
  LOTOS_PROVIDER_RFC: process.env.LOTOS_PROVIDER_RFC,
  LOTOS_PROVIDER_ADDRESS: process.env.LOTOS_PROVIDER_ADDRESS,
  LOTOS_PROVIDER_EMAIL: process.env.LOTOS_PROVIDER_EMAIL,
  LOTOS_SUPPORT_EMAIL: process.env.LOTOS_SUPPORT_EMAIL,
  LOTOS_SUPPORT_HOURS: process.env.LOTOS_SUPPORT_HOURS,
  LOTOS_SUBSCRIPTION_PORTAL_URL: process.env.LOTOS_SUBSCRIPTION_PORTAL_URL,
});

const ownerEmails = (parsed.LOTOS_OWNER_EMAILS ?? '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const testerPhoneHashes = (parsed.LOTOS_TESTER_PHONE_HASHES ?? '')
  .split(',')
  .map((hash) => hash.trim().toLowerCase())
  .filter((hash) => /^[a-f0-9]{64}$/.test(hash));

const supabasePublishableKey = parsed.SUPABASE_PUBLISHABLE_KEY ?? parsed.SUPABASE_ANON_KEY;
const supabaseServerKey = parsed.SUPABASE_SECRET_KEY ?? parsed.SUPABASE_SERVICE_ROLE_KEY;

export const env = {
  ...parsed,
  SUPABASE_PUBLISHABLE_KEY: supabasePublishableKey,
  SUPABASE_SECRET_KEY: supabaseServerKey,
  SUPABASE_ANON_KEY: supabasePublishableKey,
  SUPABASE_SERVICE_ROLE_KEY: supabaseServerKey,
  ownerEmails,
  testerPhoneHashes,
  authConfigured: Boolean(parsed.AUTH_SECRET),
  googleConfigured: Boolean(parsed.GOOGLE_CLIENT_ID && parsed.GOOGLE_CLIENT_SECRET),
  supabaseConfigured: Boolean(parsed.SUPABASE_URL && supabaseServerKey),
  lemonConfigured: Boolean(
    parsed.LEMON_WEBHOOK_SECRET &&
    parsed.LEMON_STORE_SLUG &&
    parsed.LEMON_SOLO_VARIANT_ID &&
    parsed.LEMON_PRO_VARIANT_ID &&
    parsed.LEMON_LAUNCH_VARIANT_ID
  ),
};
