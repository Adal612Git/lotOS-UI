'use client';

import type { FormEvent } from 'react';
import { useCallback, useEffect, useRef, useState, useTransition } from 'react';

type TesterAccessFormProps = {
  active: boolean;
  autoUnlock: boolean;
  configured: boolean;
  expiresAt: string | null;
  loginHref: string;
  signedIn: boolean;
};

const storedPhoneKey = 'lotos_team_access_phone';

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

export function TesterAccessForm({
  active,
  autoUnlock,
  configured,
  expiresAt,
  loginHref,
  signedIn,
}: TesterAccessFormProps) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<string | null>(
    active ? `Team QA access is active${formatDate(expiresAt) ? ` until ${formatDate(expiresAt)}` : ''}.` : null
  );
  const [isPending, startTransition] = useTransition();
  const autoUnlockAttempted = useRef(false);

  const activateAccess = useCallback((phoneToActivate: string) => {
    setStatus(null);

    startTransition(async () => {
      const response = await fetch('/api/tester-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: phoneToActivate }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        expiresAt?: string;
        persisted?: boolean;
        warning?: string;
      };

      if (!response.ok || !result.ok) {
        setStatus(result.error ?? 'Could not activate tester access.');
        return;
      }

      setPhone('');
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(storedPhoneKey);
      }
      const formattedExpiration = formatDate(result.expiresAt ?? null);

      if (result.persisted) {
        setStatus(
          `Team QA access activated and saved in the database. Full Signature unlock is ready${
            formattedExpiration ? ` until ${formattedExpiration}` : ''
          }.`
        );
        return;
      }

      setStatus(
        `${result.warning ?? 'Team QA access activated for this browser.'} Full Signature unlock is ready${
          formattedExpiration ? ` until ${formattedExpiration}` : ''
        }.`
      );
    });
  }, []);

  useEffect(() => {
    if (!signedIn || !autoUnlock || !configured || active || autoUnlockAttempted.current) {
      return;
    }

    autoUnlockAttempted.current = true;
    const storedPhone = window.sessionStorage.getItem(storedPhoneKey);

    if (!storedPhone) {
      setStatus('Google sign-in is ready. Enter the authorized phone to finish Team QA unlock.');
      return;
    }

    setPhone(storedPhone);
    setStatus('Google sign-in complete. Activating Team QA access...');
    activateAccess(storedPhone);
  }, [activateAccess, active, autoUnlock, configured, signedIn]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!signedIn) {
      window.sessionStorage.setItem(storedPhoneKey, phone);
      window.location.assign(loginHref);
      return;
    }

    activateAccess(phone);
  };

  const handleClear = () => {
    setStatus(null);

    startTransition(async () => {
      await fetch('/api/tester-access', { method: 'DELETE' });
      setStatus('Tester access cookie cleared for this browser.');
    });
  };

  return (
    <form className="grant-form" onSubmit={handleSubmit}>
      {!configured ? (
        <div className="pricing-state-banner warning">
          <strong>Tester unlock is not configured.</strong>
          <span>Set AUTH_SECRET and authorized tester phone hashes before using this page.</span>
        </div>
      ) : null}

      <label className="field">
        <span>Authorized tester phone</span>
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+52 ... or +57 ..."
          autoComplete="tel"
          inputMode="tel"
          disabled={!configured || isPending}
          required
        />
      </label>

      <div className="hero-actions compact">
        <button type="submit" className="btn primary" disabled={!configured || isPending}>
          {isPending ? 'Activating...' : signedIn ? 'Unlock Team QA' : 'Continue with Google'}
        </button>
        <a href="/vault" className="btn ghost">
          Open Vault
        </a>
        {active ? (
          <button type="button" className="btn ghost" onClick={handleClear} disabled={isPending}>
            Clear QA Cookie
          </button>
        ) : null}
      </div>

      <p className="grant-note">
        {signedIn
          ? 'This creates a temporary browser unlock and saves a 30-day QA entitlement for this Google account when the database is available. It does not create a paid entitlement or replace checkout, webhook, or buyer access logic.'
          : 'Enter the authorized phone first. Google sign-in runs next, then this page automatically saves the 30-day QA entitlement for that Google account.'}
      </p>

      {status ? <p className="grant-status">{status}</p> : null}
    </form>
  );
}
