'use client';

import type { FormEvent } from 'react';
import { useState, useTransition } from 'react';

type GrantPlan = 'solo' | 'pro' | 'launch_pack';
type PaymentProvider = 'lemon_squeezy' | 'mercado_pago' | 'paypal' | 'manual';

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
  const [provider, setProvider] = useState<PaymentProvider>('lemon_squeezy');
  const [paymentReference, setPaymentReference] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
          provider,
          paymentReference,
        }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string; entitlement?: { user_email: string; plan: string } };

      if (!response.ok || !result.ok || !result.entitlement) {
        setStatus(result.error ?? 'No se pudo activar el acceso.');
        return;
      }

      setStatus(`Acceso ${planLabels[result.entitlement.plan as GrantPlan] ?? result.entitlement.plan} activado para ${result.entitlement.user_email}.`);
      setEmail('');
      setPaymentReference('');
      setPlan('solo');
      setProvider('lemon_squeezy');
    });
  };

  return (
    <form className="grant-form" onSubmit={handleSubmit}>
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
          <span>Pago recibido por</span>
          <select value={provider} onChange={(event) => setProvider(event.target.value as PaymentProvider)}>
            {providers.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>Referencia de pago (opcional)</span>
        <input
          type="text"
          value={paymentReference}
          onChange={(event) => setPaymentReference(event.target.value)}
          placeholder="folio, captura, nota"
        />
      </label>

      <div className="hero-actions">
        <button type="submit" className="btn primary" disabled={isPending}>
          {isPending ? 'Activando...' : 'Activar acceso'}
        </button>
      </div>

      <p className="grant-note">
        Usa esto solo despues de confirmar el pago. El registro queda guardado en Supabase como
        entitlement manual o como respaldo del webhook.
      </p>

      {status ? <p className="grant-status">{status}</p> : null}
    </form>
  );
}
