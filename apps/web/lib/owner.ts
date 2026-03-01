import { env } from './env';

export function normalizeEmail(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}

export function isOwnerEmail(value: string | null | undefined): boolean {
  const normalized = normalizeEmail(value);

  if (!normalized) {
    return false;
  }

  return env.ownerEmails.includes(normalized);
}
