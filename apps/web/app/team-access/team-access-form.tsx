'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';

type TesterAccessFormProps = {
  active: boolean;
  configured: boolean;
  expiresAt: string | null;
};

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

export function TesterAccessForm({ active, configured, expiresAt }: TesterAccessFormProps) {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<string | null>(
    active ? `Team QA access is active${formatDate(expiresAt) ? ` until ${formatDate(expiresAt)}` : ''}.` : null
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    startTransition(async () => {
      const response = await fetch('/api/tester-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        expiresAt?: string;
      };

      if (!response.ok || !result.ok) {
        setStatus(result.error ?? 'Could not activate tester access.');
        return;
      }

      setPhone('');
      setStatus(
        `Team QA access activated. Full Signature unlock is ready${
          formatDate(result.expiresAt ?? null) ? ` until ${formatDate(result.expiresAt ?? null)}` : ''
        }.`
      );
    });
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
          {isPending ? 'Activating...' : 'Unlock Team QA'}
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
        This creates a temporary browser unlock for QA only. It does not create a paid entitlement row and does
        not replace checkout, webhook, or buyer access logic.
      </p>

      {status ? <p className="grant-status">{status}</p> : null}
    </form>
  );
}
