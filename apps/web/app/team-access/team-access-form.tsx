'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';

type TesterAccessFormProps = {
  active: boolean;
  configured: boolean;
  expiresAt: string | null;
  signedIn: boolean;
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

export function TesterAccessForm({ active, configured, expiresAt, signedIn }: TesterAccessFormProps) {
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
        persisted?: boolean;
        warning?: string;
      };

      if (!response.ok || !result.ok) {
        setStatus(
          `No se pudo activar QA: ${result.error ?? 'telefono no autorizado o formato invalido.'} Revisa el numero e intenta otra vez.`
        );
        return;
      }

      setPhone('');
      const formattedExpiration = formatDate(result.expiresAt ?? null);
      const successUrl = '/team-access?activated=1';

      if (result.persisted) {
        setStatus(
          `QA activo y guardado en BDD. Full Signature esta listo${
            formattedExpiration ? ` hasta ${formattedExpiration}` : ''
          }.`
        );
        window.location.assign(successUrl);
        return;
      }

      setStatus(
        `${result.warning ?? 'QA activo en este navegador.'} Full Signature esta listo${
          formattedExpiration ? ` hasta ${formattedExpiration}` : ''
        }.`
      );
      window.location.assign(successUrl);
    });
  };

  const handleClear = () => {
    setStatus(null);

    startTransition(async () => {
      await fetch('/api/tester-access', { method: 'DELETE' });
      setStatus('Acceso QA limpiado en este navegador.');
      window.location.assign('/team-access?cleared=1');
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
        <span>Telefono autorizado</span>
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="+52 ..., 52 ..., con espacios o guiones"
          autoComplete="tel"
          inputMode="tel"
          disabled={!configured || isPending}
          required
        />
      </label>

      <div className="hero-actions compact">
        <button type="submit" className="btn primary" disabled={!configured || isPending}>
          {isPending ? 'Activando...' : 'Activar QA completo'}
        </button>
        <a href="/vault" className="btn ghost">
          Abrir Vault
        </a>
        {active ? (
          <button type="button" className="btn ghost" onClick={handleClear} disabled={isPending}>
            Limpiar QA
          </button>
        ) : null}
      </div>

      <p className="grant-note">
        {signedIn
          ? 'Activa QA en este navegador y, si Google esta activo, intenta guardar el grant temporal para ese correo. No reemplaza checkout ni compras reales.'
          : 'Mete el telefono autorizado una sola vez. Este navegador recibe Full Signature QA temporal sin iniciar sesion con Google.'}
      </p>

      {status ? <p className="grant-status">{status}</p> : null}
    </form>
  );
}
