'use client';

import Link from 'next/link';
import { FormEvent, useMemo, useState } from 'react';
import { trackProductEvent } from '../../lib/product-analytics';

type ClaimState =
  | 'idle'
  | 'loading'
  | 'success'
  | 'invalid_code'
  | 'invalid'
  | 'expired'
  | 'already_claimed'
  | 'max_claims_reached'
  | 'revoked'
  | 'login_required'
  | 'configuration_required';

const claimCopy: Record<ClaimState, { title: string; body: string }> = {
  idle: {
    title: 'Reclama un pase promocional',
    body: 'Los Creator Passes, Founder Passes y Pro Studio Trials se validan del lado del servidor.',
  },
  loading: {
    title: 'Validando pase',
    body: 'Estamos revisando el código y enlazándolo con tu cuenta.',
  },
  success: {
    title: 'Tu pase promocional está listo.',
    body: 'El acceso quedó guardado en tu cuenta. Puedes revisar tus beneficios y expiración cuando quieras.',
  },
  invalid: {
    title: 'No pudimos validar este código.',
    body: 'Revisa que esté escrito completo. Los códigos reales no se publican en la web.',
  },
  invalid_code: {
    title: 'No pudimos validar este código.',
    body: 'Revisa que esté escrito completo. Los códigos reales no se publican en la web.',
  },
  expired: {
    title: 'Este pase expiró.',
    body: 'Puedes seguir usando Foundation gratis y subir a Pro Studio cuando lo necesites.',
  },
  already_claimed: {
    title: 'Este código ya fue usado.',
    body: 'El pase ya está enlazado con tu cuenta. Revisa el estado de acceso para ver los beneficios activos.',
  },
  max_claims_reached: {
    title: 'Este pase ya llegó a su límite.',
    body: 'La campaña promocional alcanzó el número máximo de claims permitidos.',
  },
  revoked: {
    title: 'Este acceso fue desactivado.',
    body: 'El pase ya no desbloquea beneficios premium. Foundation sigue disponible gratis.',
  },
  login_required: {
    title: 'Entra con tu cuenta para guardar el acceso.',
    body: 'El claim necesita una sesión para que el pase quede asociado a tu cuenta.',
  },
  configuration_required: {
    title: 'El claim no está disponible en este momento.',
    body: 'La ruta está preparada, pero el storage promocional debe estar activo en el entorno.',
  },
};

interface ClaimResponse {
  ok: boolean;
  status: ClaimState;
  grant?: {
    label: string;
    expiresAt: string | null;
  } | null;
}

function formatExpiration(value: string | null | undefined) {
  if (!value) {
    return 'Este pase no tiene fecha de expiración configurada.';
  }

  return `Tu acceso promocional termina el ${new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))}.`;
}

export function ClaimClient({
  initialCode,
  signedIn,
}: {
  initialCode: string;
  signedIn: boolean;
}) {
  const [code, setCode] = useState(initialCode);
  const [state, setState] = useState<ClaimState>(signedIn ? 'idle' : 'login_required');
  const [grant, setGrant] = useState<ClaimResponse['grant']>(null);
  const loginHref = useMemo(() => {
    const callback = code ? `/claim?code=${encodeURIComponent(code)}` : '/claim';
    return `/login?callbackUrl=${encodeURIComponent(callback)}`;
  }, [code]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!signedIn) {
      setState('login_required');
      return;
    }

    setState('loading');
    trackProductEvent('claim_code_submitted', { hasCode: Boolean(code.trim()) });

    try {
      const response = await fetch('/api/promo/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const payload = (await response.json()) as ClaimResponse;
      const nextState = payload.status ?? 'invalid';

      setState(nextState);
      setGrant(payload.grant ?? null);
      trackProductEvent(payload.ok ? 'claim_code_success' : 'claim_code_failed', { status: nextState });
    } catch {
      setState('configuration_required');
      trackProductEvent('claim_code_failed', { status: 'configuration_required' });
    }
  }

  const currentCopy = claimCopy[state];

  return (
    <section className="claim-shell">
      <div className="claim-panel">
        <p className="eyebrow">Promotional access</p>
        <h1>Reclama tu Creator Pass</h1>
        <p>
          Usa un código promocional para activar Foundation, Pro Studio Trial, Pro Gift o Full Signature Gift sin
          abrir una puerta pública a los assets privados.
        </p>
        <form className="claim-form" onSubmit={handleSubmit}>
          <label htmlFor="promo-code">Código promocional</label>
          <div className="claim-form-row">
            <input
              id="promo-code"
              name="promo-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="TU-CODIGO"
              autoComplete="off"
              spellCheck={false}
            />
            <button className="btn primary" disabled={state === 'loading'} type="submit">
              {state === 'loading' ? 'Validando' : 'Reclamar'}
            </button>
          </div>
        </form>
        {!signedIn ? (
          <Link className="btn ghost claim-login" href={loginHref}>
            Entrar para guardar acceso
          </Link>
        ) : null}
      </div>

      <aside className={`claim-result claim-result-${state}`} aria-live="polite">
        <p className="eyebrow">Estado</p>
        <h2>{currentCopy.title}</h2>
        <p>{currentCopy.body}</p>
        {grant ? (
          <div className="claim-grant">
            <strong>{grant.label}</strong>
            <span>{formatExpiration(grant.expiresAt)}</span>
          </div>
        ) : null}
        <div className="claim-result-actions">
          <Link className="btn primary" href="/account/access">Ver mi acceso</Link>
          <Link className="btn ghost" href="/free">Ver Foundation gratis</Link>
        </div>
      </aside>
    </section>
  );
}
