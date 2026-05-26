import Link from 'next/link';
import type { AccessLevel, AccessSource } from '../lib/access-policy';
import type { ResolvedAccess } from '../lib/access-resolver';

const accessLabels: Record<AccessLevel, string> = {
  public: 'Public Preview',
  free: 'Foundation',
  pro: 'Pro Studio',
  full: 'Full Signature',
  owner: 'Owner',
  qa: 'QA',
};

const sourceLabels: Partial<Record<AccessSource, string>> = {
  anonymous: 'Public preview',
  free_default: 'Foundation gratis',
  paid: 'Paid access',
  promo_grant: 'Promotional access',
  qa_phone: 'QA access',
  owner_bypass: 'Owner bypass',
  purchase: 'Paid access',
  session: 'Foundation gratis',
  public: 'Public preview',
};

function formatDate(value: string | null) {
  if (!value) {
    return 'No expira';
  }

  return new Intl.DateTimeFormat('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function AccessBadge({
  level,
  promotional,
  expiresAt,
}: {
  level: AccessLevel;
  source?: AccessSource;
  promotional?: boolean;
  expiresAt?: string | null;
}) {
  const label = promotional
    ? expiresAt
      ? `${accessLabels[level]} Trial`
      : `${accessLabels[level]} Gift`
    : accessLabels[level];

  return (
    <span className={`access-badge access-badge-${level}`}>
      {label}
    </span>
  );
}

export function AccessSummaryCard({
  access,
  title = 'Tu acceso actual',
  ctaHref = '/claim',
  ctaLabel = 'Tengo un código',
}: {
  access: ResolvedAccess;
  title?: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  const visibleCapabilities = access.capabilityList.slice(0, 6);

  return (
    <article className="access-summary-card">
      <div className="access-summary-card__header">
        <div>
          <p className="eyebrow">{title}</p>
          <h3>{access.label}</h3>
        </div>
        <AccessBadge
          level={access.accessLevel}
          source={access.source}
          promotional={access.isPromotional}
          expiresAt={access.expiresAt}
        />
      </div>
      <dl className="access-summary-meta">
        <div>
          <dt>Fuente</dt>
          <dd>{sourceLabels[access.source] ?? access.source}</dd>
        </div>
        <div>
          <dt>Expira</dt>
          <dd>{formatDate(access.expiresAt)}</dd>
        </div>
      </dl>
      <div className="access-capability-list" aria-label="Capacidades principales">
        {visibleCapabilities.map((capability) => (
          <span key={capability}>{capability}</span>
        ))}
      </div>
      <div className="access-summary-actions">
        {access.upgradeRecommended ? <Link className="btn primary" href="/pricing">Subir de nivel</Link> : null}
        <Link className="btn ghost" href={ctaHref}>{ctaLabel}</Link>
      </div>
    </article>
  );
}
