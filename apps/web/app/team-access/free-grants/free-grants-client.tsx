'use client';

import { FormEvent, useEffect, useState } from 'react';
import { LotOSSelect } from '../../product-surface/lotos-select';

type GrantType = 'FREE_FOUNDATION' | 'PRO_TRIAL' | 'PRO_GIFT' | 'FULL_GIFT' | 'QA_ACCESS';

interface GrantRow {
  id: string;
  label: string;
  campaignName: string | null;
  grantType: GrantType;
  plan: string;
  maxClaims: number | null;
  claimCount: number;
  expiresAt: string | null;
  revokedAt: string | null;
}

const grantTypeOptions = [
  { value: 'PRO_TRIAL', label: 'Pro Studio Trial', description: 'Temporal y con expiracion obligatoria.' },
  { value: 'PRO_GIFT', label: 'Pro Gift', description: 'Pase promocional revocable.' },
  { value: 'FULL_GIFT', label: 'Full Signature Gift', description: 'Delicado, normalmente uno a uno.' },
  { value: 'FREE_FOUNDATION', label: 'Foundation', description: 'No desbloquea assets premium.' },
  { value: 'QA_ACCESS', label: 'QA Access', description: 'Para pruebas controladas.' },
];

const planOptions = [
  { value: 'pro', label: 'Pro Studio' },
  { value: 'launch_pack', label: 'Full Signature' },
  { value: 'free', label: 'Foundation' },
];

export function FreeGrantsClient() {
  const [grants, setGrants] = useState<GrantRow[]>([]);
  const [grantType, setGrantType] = useState<GrantType>('PRO_TRIAL');
  const [planKey, setPlanKey] = useState('pro');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  async function loadGrants() {
    const response = await fetch('/api/promo/grants', { cache: 'no-store' });
    const payload = (await response.json()) as { ok: boolean; grants?: GrantRow[]; error?: string };

    if (payload.ok) {
      setGrants(payload.grants ?? []);
    } else {
      setStatus(payload.error ?? 'No se pudieron cargar grants.');
    }
  }

  useEffect(() => {
    void loadGrants();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const expiresAtValue = String(form.get('expiresAt') ?? '');
    const expiresAtDate = expiresAtValue ? new Date(expiresAtValue) : null;
    setLoading(true);
    setStatus('Creando pase promocional.');

    try {
      const response = await fetch('/api/promo/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: String(form.get('code') ?? ''),
          label: String(form.get('label') ?? ''),
          campaignName: String(form.get('campaignName') ?? ''),
          grantType,
          planKey,
          maxClaims: form.get('maxClaims') ? Number(form.get('maxClaims')) : null,
          expiresAt: expiresAtDate && !Number.isNaN(expiresAtDate.getTime()) ? expiresAtDate.toISOString() : null,
          notes: String(form.get('notes') ?? ''),
        }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };

      if (!payload.ok) {
        setStatus(payload.error ?? 'No se pudo crear el pase.');
      } else {
        setStatus('Pase creado. El codigo no se vuelve a mostrar en esta pantalla.');
        event.currentTarget.reset();
        await loadGrants();
      }
    } finally {
      setLoading(false);
    }
  }

  async function revokeGrant(id: string) {
    setStatus('Revocando pase.');
    const response = await fetch('/api/promo/grants', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'revoke' }),
    });
    const payload = (await response.json()) as { ok: boolean; error?: string };

    setStatus(payload.ok ? 'Pase revocado.' : payload.error ?? 'No se pudo revocar el pase.');
    await loadGrants();
  }

  return (
    <section className="free-grants-shell">
      <form className="free-grants-form" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Nuevo pase</p>
          <h2>Crear grant promocional</h2>
          <p>El codigo se hashea del lado del servidor. No uses codigos reales en landings publicas.</p>
        </div>
        <label>
          Codigo
          <input name="code" minLength={4} maxLength={96} required autoComplete="off" />
        </label>
        <label>
          Label
          <input name="label" required placeholder="Creator Pass Mayo" />
        </label>
        <label>
          Campana
          <input name="campaignName" placeholder="Community launch" />
        </label>
        <div className="free-grants-select-grid">
          <LotOSSelect label="Tipo" value={grantType} options={grantTypeOptions} onChange={(value) => setGrantType(value as GrantType)} />
          <LotOSSelect label="Plan" value={planKey} options={planOptions} onChange={(value) => setPlanKey(value)} />
        </div>
        <label>
          Max claims
          <input name="maxClaims" type="number" min={1} placeholder="1" />
        </label>
        <label>
          Expira
          <input name="expiresAt" type="datetime-local" required={grantType === 'PRO_TRIAL'} />
        </label>
        <label>
          Notas
          <textarea name="notes" rows={3} placeholder="Contexto interno breve." />
        </label>
        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Creando' : 'Crear pase'}
        </button>
        {status ? <p className="free-grants-status" aria-live="polite">{status}</p> : null}
      </form>

      <div className="free-grants-list">
        <p className="eyebrow">Grants activos y revocados</p>
        <h2>Pases promocionales</h2>
        {grants.length === 0 ? <p>No hay grants registrados o el storage aun no esta activo.</p> : null}
        {grants.map((grant) => (
          <article key={grant.id}>
            <div>
              <span>{grant.grantType}</span>
              <h3>{grant.label}</h3>
              <p>{grant.campaignName ?? 'Sin campana'} · {grant.plan}</p>
            </div>
            <dl>
              <div>
                <dt>Claims</dt>
                <dd>{grant.claimCount}{grant.maxClaims ? ` / ${grant.maxClaims}` : ''}</dd>
              </div>
              <div>
                <dt>Expira</dt>
                <dd>{grant.expiresAt ? new Date(grant.expiresAt).toLocaleDateString('es-MX') : 'No expira'}</dd>
              </div>
              <div>
                <dt>Estado</dt>
                <dd>{grant.revokedAt ? 'Revocado' : 'Activo'}</dd>
              </div>
            </dl>
            {!grant.revokedAt ? (
              <button className="btn ghost" type="button" onClick={() => revokeGrant(grant.id)}>
                Revocar
              </button>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
