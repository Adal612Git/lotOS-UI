'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';

type GrantPlan = 'solo' | 'pro' | 'launch_pack';
type PaymentProvider = 'lemon_squeezy' | 'mercado_pago' | 'paypal' | 'manual';
type GrantMode = 'test' | 'paid_recovery';
type RevokePlan = GrantPlan | 'all';

const plans: Array<{ value: GrantPlan; label: string }> = [
  { value: 'solo', label: 'Solo' },
  { value: 'pro', label: 'Pro' },
  { value: 'launch_pack', label: 'Full Signature' },
];

const providers: Array<{ value: PaymentProvider; label: string }> = [
  { value: 'lemon_squeezy', label: 'Lemon Squeezy' },
  { value: 'mercado_pago', label: 'Mercado Pago' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'manual', label: 'Manual / efectivo' },
];

const planLabels: Record<GrantPlan, string> = {
  solo: 'Solo',
  pro: 'Pro',
  launch_pack: 'Full Signature',
};

export function GrantAccessForm() {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<GrantPlan>('solo');
  const [grantMode, setGrantMode] = useState<GrantMode>('test');
  const [provider, setProvider] = useState<PaymentProvider>('manual');
  const [paymentReference, setPaymentReference] = useState('');
  const [recoveryReason, setRecoveryReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [evidenceReviewed, setEvidenceReviewed] = useState(false);
  const [trialDays, setTrialDays] = useState(14);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const updateGrantMode = (nextMode: GrantMode) => {
    setGrantMode(nextMode);
    setProvider(nextMode === 'test' ? 'manual' : 'lemon_squeezy');
    setStatus(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    startTransition(async () => {
      const response = await fetch('/api/entitlements/grant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: email,
          plan,
          grantMode,
          provider,
          paymentReference,
          recoveryReason,
          internalNote,
          evidenceReviewed,
          trialDays,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        entitlement?: { user_email: string; plan: string };
      };

      if (!response.ok || !result.ok || !result.entitlement) {
        setStatus(result.error ?? 'No se pudo activar el acceso.');
        return;
      }

      setStatus(`Acceso ${planLabels[result.entitlement.plan as GrantPlan] ?? result.entitlement.plan} activado para ${result.entitlement.user_email}.`);
      setEmail('');
      setPaymentReference('');
      setRecoveryReason('');
      setInternalNote('');
      setEvidenceReviewed(false);
      setPlan('solo');
      setGrantMode('test');
      setProvider('manual');
      setTrialDays(14);
    });
  };

  return (
    <form className="grant-form" onSubmit={handleSubmit}>
      <fieldset className="grant-mode-fieldset">
        <legend>Tipo de alta</legend>
        <div className="grant-mode-grid" role="radiogroup" aria-label="Tipo de alta manual">
          <label className={`grant-mode-option ${grantMode === 'test' ? 'active' : ''}`}>
            <input
              type="radio"
              name="grantMode"
              value="test"
              checked={grantMode === 'test'}
              onChange={() => updateGrantMode('test')}
            />
            <span>Prueba sin pago</span>
            <small>Temporal por 7, 14 o 30 dias para QA, demos controladas o pilotos autorizados.</small>
          </label>
          <label className={`grant-mode-option ${grantMode === 'paid_recovery' ? 'active' : ''}`}>
            <input
              type="radio"
              name="grantMode"
              value="paid_recovery"
              checked={grantMode === 'paid_recovery'}
              onChange={() => updateGrantMode('paid_recovery')}
            />
            <span>Pago confirmado</span>
            <small>Solo despues de revisar evidencia de pago real cuando webhook o email fallaron.</small>
          </label>
        </div>
      </fieldset>

      <label className="field">
        <span>Correo del comprador</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="cliente@correo.com"
          required
        />
      </label>

      <div className="field-grid">
        <label className="field">
          <span>Plan</span>
          <select value={plan} onChange={(event) => setPlan(event.target.value as GrantPlan)}>
            {plans.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span>{grantMode === 'test' ? 'Origen de la prueba' : 'Pago recibido por'}</span>
          <select value={provider} onChange={(event) => setProvider(event.target.value as PaymentProvider)}>
            {providers.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {grantMode === 'test' ? (
        <label className="field">
          <span>Duracion de prueba</span>
          <select value={trialDays} onChange={(event) => setTrialDays(Number(event.target.value))}>
            <option value={7}>7 dias</option>
            <option value={14}>14 dias</option>
            <option value={30}>30 dias</option>
          </select>
        </label>
      ) : (
        <>
          <label className="field">
            <span>Motivo de recuperacion</span>
            <textarea
              value={recoveryReason}
              onChange={(event) => setRecoveryReason(event.target.value)}
              placeholder="Pago confirmado, webhook fallido, correo corregido, folio revisado"
              required
            />
          </label>
          <label className="inline-check">
            <input
              type="checkbox"
              checked={evidenceReviewed}
              onChange={(event) => setEvidenceReviewed(event.target.checked)}
              required
            />
            <span>Revise evidencia de pago real. Paid recovery no reemplaza el webhook normal.</span>
          </label>
        </>
      )}

      <label className="field">
        <span>{grantMode === 'test' ? 'Nota de prueba (opcional)' : 'Referencia de pago (opcional)'}</span>
        <input
          type="text"
          value={paymentReference}
          onChange={(event) => setPaymentReference(event.target.value)}
          placeholder={grantMode === 'test' ? 'QA, demo, piloto, nombre de campana' : 'folio, captura, nota'}
        />
      </label>

      <label className="field">
        <span>Nota interna (opcional)</span>
        <textarea
          value={internalNote}
          onChange={(event) => setInternalNote(event.target.value)}
          placeholder="Contexto interno para auditoria; no usar como prueba legal final"
        />
      </label>

      <div className="hero-actions">
        <button type="submit" className="btn primary" disabled={isPending}>
          {isPending ? 'Activando...' : 'Activar acceso'}
        </button>
      </div>

      <p className="grant-note">
        Usa prueba sin pago solo para QA, demos o pilotos internos. El camino normal de venta sigue siendo
        checkout, webhook y entitlement; no uses altas manuales para evitar el pago real de compradores.
      </p>

      {status ? <p className="grant-status">{status}</p> : null}
    </form>
  );
}

export function RevokeAccessForm() {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<RevokePlan>('all');
  const [reason, setReason] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    startTransition(async () => {
      const response = await fetch('/api/entitlements/revoke', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: email,
          plan,
          reason,
          internalNote,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        revokedCount?: number;
        plans?: string[];
      };

      if (!response.ok || !result.ok) {
        setStatus(result.error ?? 'No se pudo revocar el acceso.');
        return;
      }

      setStatus(`Revocacion registrada para ${result.revokedCount ?? 0} entitlement(s).`);
      setEmail('');
      setPlan('all');
      setReason('');
      setInternalNote('');
    });
  };

  return (
    <form className="grant-form revoke-form" onSubmit={handleSubmit}>
      <div className="pricing-state-banner warning">
        <strong>Revocar acceso corta el acceso premium.</strong>
        <span>El usuario podra iniciar sesion con Google, pero los vaults y descargas pagadas dejaran de abrir si no queda otro entitlement activo.</span>
      </div>

      <label className="field">
        <span>Correo del usuario</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="cliente@correo.com"
          required
        />
      </label>

      <label className="field">
        <span>Plan a revocar</span>
        <select value={plan} onChange={(event) => setPlan(event.target.value as RevokePlan)}>
          <option value="all">Todos los planes pagados</option>
          {plans.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span>Motivo de revocacion</span>
        <textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Cancelacion, abuso, reembolso, prueba terminada o error operativo"
          required
          minLength={8}
        />
      </label>

      <label className="field">
        <span>Nota interna (opcional)</span>
        <textarea
          value={internalNote}
          onChange={(event) => setInternalNote(event.target.value)}
          placeholder="Contexto interno para auditoria"
        />
      </label>

      <div className="hero-actions">
        <button type="submit" className="btn primary" disabled={isPending}>
          {isPending ? 'Revocando...' : 'Revocar acceso'}
        </button>
      </div>

      {status ? <p className="grant-status">{status}</p> : null}
    </form>
  );
}

type LookupEntitlement = {
  id: number;
  plan: string;
  status: string;
  active: boolean;
  kind: string;
  source: string;
  provider: string | null;
  grantedAt: string;
  expiresAt: string | null;
  trialEndsAt: string | null;
  revokedAt: string | null;
  revokeReason: string | null;
  internalNote: string | null;
  providerSubscriptionId: string | null;
  providerOrderId: string | null;
};

export function EntitlementLookupForm() {
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<LookupEntitlement[] | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setResults(null);

    startTransition(async () => {
      const response = await fetch('/api/entitlements/lookup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: email,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        entitlements?: LookupEntitlement[];
      };

      if (!response.ok || !result.ok) {
        setStatus(result.error ?? 'No se pudo buscar el entitlement.');
        return;
      }

      setResults(result.entitlements ?? []);
      setStatus((result.entitlements ?? []).length === 0 ? 'No hay entitlement para este email.' : null);
    });
  };

  return (
    <form className="grant-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Buscar por email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="cliente@correo.com"
          required
        />
      </label>

      <div className="hero-actions">
        <button type="submit" className="btn primary" disabled={isPending}>
          {isPending ? 'Buscando...' : 'Buscar estado'}
        </button>
      </div>

      {status ? <p className="grant-status">{status}</p> : null}

      {results && results.length > 0 ? (
        <div className="entitlement-result-grid">
          {results.map((entry) => (
            <article key={entry.id} className="entitlement-result">
              <div>
                <strong>{planLabels[entry.plan as GrantPlan] ?? entry.plan}</strong>
                <span>{entry.status} / {entry.kind}</span>
              </div>
              <ul>
                <li>Activo: {entry.active ? 'si' : 'no'}</li>
                <li>Provider: {entry.provider ?? 'not recorded'}</li>
                <li>Trial ends: {entry.trialEndsAt ?? 'not recorded'}</li>
                <li>Expires: {entry.expiresAt ?? 'not configured'}</li>
                <li>Revoked: {entry.revokedAt ?? 'no'}</li>
                <li>Subscription id: {entry.providerSubscriptionId ? 'present' : 'not recorded'}</li>
              </ul>
              {entry.status === 'revoked' ? (
                <p className="grant-note">No reactivar con grant normal. Usa un proceso explicito.</p>
              ) : null}
              {entry.kind === 'paid_recovery' ? (
                <p className="grant-note">Paid recovery requiere evidencia revisada fuera del sistema.</p>
              ) : null}
              {entry.internalNote || entry.revokeReason ? (
                <details>
                  <summary>Ver notas owner-only</summary>
                  <p>{entry.revokeReason ? `Revocation: ${entry.revokeReason}` : 'Sin motivo de revocacion.'}</p>
                  <p>{entry.internalNote ? `Internal note: ${entry.internalNote}` : 'Sin nota interna.'}</p>
                </details>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
    </form>
  );
}
