'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { trackProductEvent } from '../../../lib/product-analytics';
import { LotOSSelect } from '../../product-surface/lotos-select';

type GrantType = 'FREE_FOUNDATION' | 'PRO_TRIAL' | 'PRO_GIFT' | 'FULL_GIFT' | 'QA_ACCESS';
type GrantStatus = 'all' | 'active' | 'scheduled' | 'expired' | 'revoked' | 'exhausted';

interface GrantRow {
  id: string;
  label: string;
  campaignName: string | null;
  grantType: GrantType;
  plan: string;
  maxClaims: number | null;
  claimCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

interface GrantEventRow {
  id: string;
  grantId: string | null;
  eventType: string;
  createdAt: string;
}

const grantTypeOptions = [
  { value: 'PRO_TRIAL', label: 'Pro Studio Trial', description: 'Temporal y con expiracion obligatoria.' },
  { value: 'PRO_GIFT', label: 'Pro Gift', description: 'Pase promocional revocable.' },
  { value: 'FULL_GIFT', label: 'Full Signature Gift', description: 'Delicado, normalmente uno a uno.' },
  { value: 'FREE_FOUNDATION', label: 'Foundation', description: 'No desbloquea assets premium.' },
  { value: 'QA_ACCESS', label: 'QA Access', description: 'Para pruebas controladas.' },
];

const grantTypeFilterOptions = [
  { value: 'all', label: 'Todos' },
  ...grantTypeOptions.map((option) => ({ value: option.value, label: option.label })),
];

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Activos' },
  { value: 'scheduled', label: 'Programados' },
  { value: 'expired', label: 'Expirados' },
  { value: 'revoked', label: 'Revocados' },
  { value: 'exhausted', label: 'Sin cupos' },
];

const planOptions = [
  { value: 'pro', label: 'Pro Studio' },
  { value: 'launch_pack', label: 'Full Signature' },
  { value: 'free', label: 'Foundation' },
];

const presets: Array<{
  label: string;
  campaignName: string;
  grantType: GrantType;
  planKey: string;
  maxClaims: number;
  durationDays: number | null;
  notes: string;
}> = [
  {
    label: 'Creator Pass 14',
    campaignName: 'creator-pass',
    grantType: 'PRO_TRIAL',
    planKey: 'pro',
    maxClaims: 1,
    durationDays: 14,
    notes: 'Para creadores, testers y aliados de bajo volumen.',
  },
  {
    label: 'Founder Pass 30',
    campaignName: 'founder-pass',
    grantType: 'PRO_TRIAL',
    planKey: 'pro',
    maxClaims: 1,
    durationDays: 30,
    notes: 'Para aliados estrategicos que van a dar feedback profundo.',
  },
  {
    label: 'Studio Ally',
    campaignName: 'studio-ally',
    grantType: 'PRO_GIFT',
    planKey: 'pro',
    maxClaims: 1,
    durationDays: 180,
    notes: 'Pase revocable para aliados de estudio.',
  },
  {
    label: 'Full Signature Gift',
    campaignName: 'manual-full-gift',
    grantType: 'FULL_GIFT',
    planKey: 'launch_pack',
    maxClaims: 1,
    durationDays: null,
    notes: 'Manual only. Usar uno a uno y revocar si se comparte por error.',
  },
];

function toDatetimeLocal(days: number | null) {
  if (!days) {
    return '';
  }

  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function formatDate(value: string | null) {
  if (!value) {
    return 'No expira';
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getGrantStatus(grant: GrantRow): Exclude<GrantStatus, 'all'> {
  const now = Date.now();
  const startsAt = grant.startsAt ? Date.parse(grant.startsAt) : null;
  const expiresAt = grant.expiresAt ? Date.parse(grant.expiresAt) : null;

  if (grant.revokedAt) {
    return 'revoked';
  }
  if (startsAt && startsAt > now) {
    return 'scheduled';
  }
  if (expiresAt && expiresAt <= now) {
    return 'expired';
  }
  if (grant.maxClaims !== null && grant.claimCount >= grant.maxClaims) {
    return 'exhausted';
  }
  return 'active';
}

function getRiskBadges(grant: GrantRow) {
  const badges: string[] = [];

  if (grant.grantType === 'FULL_GIFT') {
    badges.push('Full Gift');
  }
  if (!grant.expiresAt && grant.plan !== 'free') {
    badges.push('Sin expiracion');
  }
  if (grant.maxClaims !== null && grant.maxClaims >= 25) {
    badges.push('High maxClaims');
  }
  if (grant.maxClaims === null) {
    badges.push('Claims abiertos');
  }
  if ((grant.campaignName ?? '').toLowerCase().includes('public')) {
    badges.push('Public campaign');
  }

  return badges;
}

export function FreeGrantsClient() {
  const [grants, setGrants] = useState<GrantRow[]>([]);
  const [events, setEvents] = useState<GrantEventRow[]>([]);
  const [grantType, setGrantType] = useState<GrantType>('PRO_TRIAL');
  const [planKey, setPlanKey] = useState('pro');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<GrantStatus>('all');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [oneTimeClaimLink, setOneTimeClaimLink] = useState<string | null>(null);

  async function loadGrants() {
    const response = await fetch('/api/promo/grants', { cache: 'no-store' });
    const payload = (await response.json()) as {
      ok: boolean;
      grants?: GrantRow[];
      events?: GrantEventRow[];
      error?: string;
    };

    if (payload.ok) {
      setGrants(payload.grants ?? []);
      setEvents(payload.events ?? []);
    } else {
      setStatus(payload.error ?? 'No se pudieron cargar grants.');
    }
  }

  useEffect(() => {
    void loadGrants();
  }, []);

  const filteredGrants = useMemo(() => {
    return grants.filter((grant) => {
      const typeMatches = typeFilter === 'all' || grant.grantType === typeFilter;
      const statusMatches = statusFilter === 'all' || getGrantStatus(grant) === statusFilter;
      return typeMatches && statusMatches;
    });
  }, [grants, statusFilter, typeFilter]);

  const eventsByGrant = useMemo(() => {
    return events.reduce<Record<string, GrantEventRow[]>>((accumulator, event) => {
      if (!event.grantId) {
        return accumulator;
      }

      const grantEvents = accumulator[event.grantId] ?? [];
      grantEvents.push(event);
      accumulator[event.grantId] = grantEvents;
      return accumulator;
    }, {});
  }, [events]);

  function applyPreset(index: number) {
    const preset = presets[index];

    if (!preset) {
      return;
    }

    setGrantType(preset.grantType);
    setPlanKey(preset.planKey);

    const form = document.querySelector<HTMLFormElement>('[data-free-grants-form]');
    if (!form) {
      return;
    }

    const setField = (name: string, value: string) => {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
        field.value = value;
      }
    };

    setField('label', preset.label);
    setField('campaignName', preset.campaignName);
    setField('maxClaims', String(preset.maxClaims));
    setField('expiresAt', toDatetimeLocal(preset.durationDays));
    setField('notes', preset.notes);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const code = String(form.get('code') ?? '').trim();
    const expiresAtValue = String(form.get('expiresAt') ?? '');
    const maxClaimsValue = form.get('maxClaims') ? Number(form.get('maxClaims')) : null;
    const expiresAtDate = expiresAtValue ? new Date(expiresAtValue) : null;

    setOneTimeClaimLink(null);

    if (grantType === 'PRO_TRIAL' && !expiresAtValue) {
      setStatus('PRO_TRIAL requiere expiracion antes de crear.');
      return;
    }
    if (grantType === 'FULL_GIFT') {
      const confirmed = window.confirm('Full Signature Gift desbloquea el nivel mas delicado. Confirma que es manual, uno a uno y revocable.');
      if (!confirmed) {
        setStatus('Full Gift cancelado antes de crear.');
        return;
      }
    }
    if (maxClaimsValue !== null && maxClaimsValue < 1) {
      setStatus('maxClaims debe ser 1 o mayor.');
      return;
    }

    setLoading(true);
    setStatus('Creando pase promocional.');

    try {
      const response = await fetch('/api/promo/grants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          label: String(form.get('label') ?? ''),
          campaignName: String(form.get('campaignName') ?? ''),
          grantType,
          planKey,
          maxClaims: maxClaimsValue,
          expiresAt: expiresAtDate && !Number.isNaN(expiresAtDate.getTime()) ? expiresAtDate.toISOString() : null,
          notes: String(form.get('notes') ?? ''),
        }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };

      if (!payload.ok) {
        setStatus(payload.error ?? 'No se pudo crear el pase.');
      } else {
        setStatus('Pase creado. Guarda el link ahora; por seguridad no se vuelve a mostrar.');
        setOneTimeClaimLink(`${window.location.origin}/claim/${encodeURIComponent(code)}`);
        trackProductEvent('grant_created', { grantType, planKey, maxClaims: maxClaimsValue });
        formElement.reset();
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
    trackProductEvent('grant_revoked', { ok: payload.ok });
    await loadGrants();
  }

  async function copyOneTimeClaimLink() {
    if (!oneTimeClaimLink) {
      return;
    }

    await navigator.clipboard.writeText(oneTimeClaimLink);
    setStatus('Link copiado. No se guardara de nuevo en esta pantalla.');
  }

  return (
    <section className="free-grants-shell">
      <form className="free-grants-form" data-free-grants-form onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">Nuevo pase</p>
          <h2>Crear grant promocional</h2>
          <p>El codigo se hashea del lado del servidor. No uses codigos reales en landings publicas.</p>
        </div>

        <div className="free-grants-presets" aria-label="Presets promocionales">
          {presets.map((preset, index) => (
            <button key={preset.label} className="btn ghost" type="button" onClick={() => applyPreset(index)}>
              {preset.label}
            </button>
          ))}
        </div>

        <label>
          Codigo
          <input name="code" minLength={4} maxLength={96} required autoComplete="off" />
        </label>
        <label>
          Label
          <input name="label" required placeholder="Creator Pass 14" />
        </label>
        <label>
          Campana
          <input name="campaignName" placeholder="community-launch" />
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
          <textarea name="notes" rows={3} placeholder="Contexto interno breve sin PII ni codigos." />
        </label>

        {grantType === 'PRO_TRIAL' ? (
          <p className="free-grants-warning">PRO_TRIAL requiere expiracion. Foundation sigue disponible cuando el trial termina.</p>
        ) : null}
        {grantType === 'FULL_GIFT' ? (
          <p className="free-grants-warning strong">Full Signature Gift es manual only, maxClaims 1 recomendado y revocable.</p>
        ) : null}
        <p className="free-grants-warning">Campanas masivas requieren la RPC transaccional aplicada en Supabase antes de compartir codigos.</p>

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? 'Creando' : 'Crear pase'}
        </button>
        {oneTimeClaimLink ? (
          <div className="free-grants-one-time">
            <strong>Guarda este codigo/link ahora.</strong>
            <span>Por seguridad no volvera a mostrarse despues de esta sesion.</span>
            <button className="btn ghost" type="button" onClick={copyOneTimeClaimLink}>
              Copiar link /claim
            </button>
          </div>
        ) : null}
        {status ? <p className="free-grants-status" aria-live="polite">{status}</p> : null}
      </form>

      <div className="free-grants-list">
        <div className="free-grants-list-head">
          <div>
            <p className="eyebrow">Grants activos y revocados</p>
            <h2>Pases promocionales</h2>
          </div>
          <div className="free-grants-select-grid compact">
            <LotOSSelect label="Tipo" value={typeFilter} options={grantTypeFilterOptions} onChange={setTypeFilter} />
            <LotOSSelect label="Estado" value={statusFilter} options={statusOptions} onChange={(value) => setStatusFilter(value as GrantStatus)} />
          </div>
        </div>
        {filteredGrants.length === 0 ? <p>No hay grants para este filtro o el storage aun no esta activo.</p> : null}
        {filteredGrants.map((grant) => {
          const statusValue = getGrantStatus(grant);
          const remaining = grant.maxClaims === null ? 'Abierto' : Math.max(grant.maxClaims - grant.claimCount, 0);
          const riskBadges = getRiskBadges(grant);
          const grantEvents = eventsByGrant[grant.id] ?? [];

          return (
            <article key={grant.id}>
              <div className="free-grants-card-head">
                <div>
                  <span>{grant.grantType}</span>
                  <h3>{grant.label}</h3>
                  <p>{grant.campaignName ?? 'Sin campana'} · {grant.plan}</p>
                </div>
                <strong className={`free-grants-state free-grants-state-${statusValue}`}>{statusValue}</strong>
              </div>
              {riskBadges.length > 0 ? (
                <div className="free-grants-risk-list">
                  {riskBadges.map((badge) => (
                    <span key={badge}>{badge}</span>
                  ))}
                </div>
              ) : null}
              <dl>
                <div>
                  <dt>Claims</dt>
                  <dd>{grant.claimCount}{grant.maxClaims ? ` / ${grant.maxClaims}` : ''}</dd>
                </div>
                <div>
                  <dt>Remaining</dt>
                  <dd>{remaining}</dd>
                </div>
                <div>
                  <dt>Empieza</dt>
                  <dd>{formatDate(grant.startsAt)}</dd>
                </div>
                <div>
                  <dt>Expira</dt>
                  <dd>{formatDate(grant.expiresAt)}</dd>
                </div>
                <div>
                  <dt>Revocado</dt>
                  <dd>{grant.revokedAt ? formatDate(grant.revokedAt) : 'No'}</dd>
                </div>
                <div>
                  <dt>Eventos</dt>
                  <dd>{grantEvents.length}</dd>
                </div>
              </dl>
              {grantEvents.length > 0 ? (
                <p className="free-grants-events">
                  Ultimo evento: {grantEvents[0]?.eventType} · {formatDate(grantEvents[0]?.createdAt ?? null)}
                </p>
              ) : null}
              {!grant.revokedAt ? (
                <button className="btn ghost" type="button" onClick={() => revokeGrant(grant.id)}>
                  Revocar
                </button>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
