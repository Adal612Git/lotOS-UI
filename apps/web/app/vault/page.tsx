import Link from 'next/link';
import { getViewerContext } from '../../lib/auth-server';
import '../lotos-landing.css';
import { commercialReadiness } from '../sales-config';
import { buildRouteMetadata } from '../../lib/seo';
import { mapSummaryForVault } from '../../lib/entitlement-access';

export const metadata = buildRouteMetadata({
  title: 'LotOS UI Vault',
  description: 'Protected LotOS UI delivery surface for entitlement-gated Solo, Pro, and Full Signature assets.',
  path: '/vault',
});

const vaultAccentCycle = ['accent-cyan', 'accent-emerald', 'accent-amber', 'accent-violet'] as const;

const freeVaultSignals = [
  { value: 'Open', label: 'Public docs' },
  { value: 'MIT', label: 'Core layer' },
  { value: 'CLI', label: 'Scaffolding' },
  { value: 'Live', label: 'Design refs' },
];

const freeVaultHighlights = [
  'Public docs and runtime guides',
  'Open MIT packages for real evaluation',
  'CLI access before payment',
  'A stronger trust layer before checkout',
];

const freeVaultProof = [
  'The free layer should already help a buyer understand the platform, test the fit, and trust the product direction.',
  'That makes the vault feel more legitimate because premium access now clearly sits on top of a useful public foundation.',
  'The paid ladder then feels like a real expansion of capability instead of the first moment the product becomes valuable.',
];

const planLabels: Record<string, string> = {
  solo: 'Solo',
  pro: 'Pro',
  launch_pack: 'Full Signature',
};

function formatVaultDate(value: string | null) {
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

export default async function VaultPage() {
  const viewer = await getViewerContext();
  const viewerPlans = new Set<string>(viewer.plans);
  const hasSolo = viewer.isOwner || viewerPlans.has('solo') || viewerPlans.has('pro') || viewerPlans.has('launch_pack');
  const hasPro = viewer.isOwner || viewerPlans.has('pro') || viewerPlans.has('launch_pack');
  const hasLaunch = viewer.isOwner || viewerPlans.has('launch_pack');
  const entitlementRecords = viewer.entitlements;
  const vaultExperienceCards = [
    {
      label: 'Access state',
      value: viewer.isOwner ? 'Owner' : viewer.isTester ? 'Team QA' : viewer.plans.length > 0 ? 'Entitled' : 'Public-only',
      body: viewer.isOwner
        ? 'Owner bypass is active, so every paid surface is reachable from this session.'
        : viewer.isTester
          ? 'Team QA unlock is active, so this browser can inspect every premium surface for validation.'
        : viewer.plans.length > 0
          ? 'The vault can route directly into the tiers the buyer already paid for.'
          : 'The account is signed in but does not currently hold a paid entitlement.',
      tone: viewer.isOwner || viewer.isTester || viewer.plans.length > 0 ? 'accent-emerald' : 'accent-amber',
    },
    {
      label: 'Entitlements',
      value: viewer.degraded ? 'Degraded' : 'Resolved',
      body: viewer.degraded
        ? 'Entitlement lookup failed safely. The user can still understand the ladder instead of hitting a dead-end.'
        : 'Entitlement state resolved normally and drives the vault tier logic.',
      tone: viewer.degraded ? 'accent-rose' : 'accent-cyan',
    },
    {
      label: 'Flow',
      value: hasLaunch ? 'Full' : hasPro ? 'Pro' : hasSolo ? 'Solo' : 'Upgrade',
      body: hasLaunch
        ? 'This session can open the flagship premium layer.'
        : hasPro
          ? 'This session can open the real protected Pro surface.'
          : hasSolo
            ? 'This session can access the proof-first Solo tier.'
            : 'The current session should be guided back to pricing or public docs.',
      tone: hasLaunch ? 'accent-violet' : hasPro ? 'accent-amber' : hasSolo ? 'accent-cyan' : 'accent-rose',
    },
  ];

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/docs" className="nav-link">Docs</Link>
          <Link href="/demo" className="nav-link">Demos</Link>
          <Link href="/pricing" className="nav-link nav-link--pricing">Pricing</Link>
          <Link href="/team-access" className="nav-link nav-link--components">Team QA</Link>
          {viewer.isOwner ? <Link href="/admin/entitlements" className="nav-link nav-link--cta">Admin</Link> : null}
          <Link href="/api/auth/signout?callbackUrl=/" className="nav-link nav-link--muted">Sign Out</Link>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Commercial Vault</p>
        <h1>Protected delivery with a three-tier premium ladder that should feel richer at every step.</h1>
        <p className="lead">
          Signed in as <strong>{viewer.email}</strong>. Free assets stay public; protected assets
          unlock here based on entitlement or owner status.
        </p>
        {viewer.warnings.length > 0 ? (
          <div className="pricing-state-banner warning">
            <strong>Vault recovered with fallback.</strong>
            <span>{viewer.warnings.join(' | ')}</span>
          </div>
        ) : null}
        {viewer.isTester ? (
          <div className="pricing-state-banner">
            <strong>Team QA access is active.</strong>
            <span>This browser has temporary Full Signature access for exhaustive validation. It is not a paid entitlement.</span>
          </div>
        ) : null}
        <div className="payment-meta" aria-label="Vault state">
          <span className="payment-chip free accent-cyan">Free foundation stays open</span>
          <span className="payment-chip alt accent-amber">Public first, premium after</span>
          <span className={`payment-chip ${commercialReadiness.automaticUnlockReady ? 'ready' : 'manual'} accent-violet`}>
            {commercialReadiness.automaticUnlockReady ? 'Purchases unlock automatically' : 'Protected routes use entitlements'}
          </span>
        </div>
        <div className="hero-actions">
          <a href="#free-foundation" className="btn ghost">
            Free Foundation
          </a>
          <Link href="/vault/solo" className="btn primary">
            Solo Surface
          </Link>
          <Link href="/vault/pro" className="btn ghost">
            Pro Surface
          </Link>
          <Link href="/vault/launch" className="btn ghost">
            Full Surface
          </Link>
        </div>
      </section>

      <section className="value-grid">
        {vaultExperienceCards.map((card) => (
          <article key={card.label} className={`value-card ${card.tone}`}>
            <p className="plan-tier">{card.label}</p>
            <h3>{card.value}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </section>

      <section id="free-foundation" className="card free-entry vault-free-panel">
        <div className="tier-head">
          <div className="tier-title-block">
            <p className="plan-tier">Free Foundation</p>
            <h3>Public value now carries real weight before any premium unlock.</h3>
            <p>
              The free layer should already feel like a credible product surface. The vault exists to
              show where protected value begins, not to be the first place the product feels useful.
            </p>
          </div>
          <span className="tier-badge accent-cyan">Open Layer</span>
        </div>
        <div className="free-rich-panel">
          <div className="free-rich-copy">
            <p className="tier-mini-label">Public trust surface</p>
            <h4>A stronger free experience makes the premium ladder easier to believe.</h4>
            <p>
              Buyers can inspect the public system first, validate the quality, and understand the
              difference between open utility and protected commercial delivery.
            </p>
          </div>
          <div className="free-signal-grid" aria-label="Free vault signals">
            {freeVaultSignals.map((signal, index) => (
              <div key={signal.label} className={`free-signal ${vaultAccentCycle[index % vaultAccentCycle.length]}`}>
                <strong>{signal.value}</strong>
                <span>{signal.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="free-entry-grid">
          <div className="free-main-stack">
            <div className="tier-pill-grid" aria-label="Free foundation highlights">
              {freeVaultHighlights.map((item, index) => (
                <span key={item} className={`tier-pill ${vaultAccentCycle[index % vaultAccentCycle.length]}`}>
                  {item}
                </span>
              ))}
            </div>
            <ul>
              <li>The free layer remains the best place to explore docs, installation, and runtime adoption paths.</li>
              <li>Open packages stay visible and useful without claiming private exclusivity.</li>
              <li>The vault protects premium delivery, but the public foundation still carries real technical value.</li>
            </ul>
            <div className="payment-actions" role="group" aria-label="Free foundation routes">
              <Link href="/docs/installation" className="btn ghost">
                Open Docs
              </Link>
              <Link href="/multi-framework" className="btn ghost">
                Runtime Matrix
              </Link>
              <Link href="/examples" className="btn ghost">
                Examples
              </Link>
            </div>
          </div>
          <aside className="free-side-card">
            <p className="tier-mini-label">Why this matters</p>
            <h4>The free foundation now supports the commercial story instead of weakening it.</h4>
            <ul className="free-proof-list">
              {freeVaultProof.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="vault-strip">
        <article className="vault-kpi">
          <strong>{hasSolo ? 'Yes' : 'No'}</strong>
          <span>Solo access</span>
          <p>Premium proof assets and the first private layer above the public trust surface.</p>
        </article>
        <article className="vault-kpi">
          <strong>{hasPro ? 'Yes' : 'No'}</strong>
          <span>Pro access</span>
          <p>The real premium bundle tier with protected assets, templates, and stronger monthly value.</p>
        </article>
        <article className="vault-kpi">
          <strong>{hasLaunch ? 'Yes' : 'No'}</strong>
          <span>Full access</span>
          <p>The flagship layer with full-only integrated surfaces for premium operator workflows.</p>
        </article>
      </section>

      <section className="grid two">
        <article className="card">
          <p className="section-label">Viewer state</p>
          <h2>Current access</h2>
          <ul>
            <li>Owner: {viewer.isOwner ? 'Yes' : 'No'}</li>
            <li>Team QA: {viewer.isTester ? 'Yes' : 'No'}</li>
            <li>
              Active plans: {viewer.isOwner ? 'owner bypass (all premium)' : viewer.isTester ? 'team QA unlock (all premium)' : viewer.plans.map((plan) => planLabels[plan] ?? plan).join(', ') || 'none'}
            </li>
            <li>Free docs, design references, CLI entry points, and public MIT packages remain open without this vault.</li>
          </ul>
        </article>
        <article className="card">
          <p className="section-label">Protected paths</p>
          <h2>What this vault controls</h2>
          <ul>
            <li>Commercial previews and evaluation-only sales assets.</li>
            <li>Protected `packages/pro` delivery assets and manifests.</li>
            <li>Desktop template Pro catalog surfaces and kit downloads.</li>
            <li>Tier routing that should match what the buyer actually paid for, not what the UI merely promises.</li>
          </ul>
        </article>
      </section>

      <section className="card owner-panel">
        <p className="section-label">Entitlement lifecycle</p>
        <h2>Access source and status</h2>
        {viewer.isOwner ? (
          <div className="pricing-state-banner">
            <strong>Owner bypass is active.</strong>
            <span>
              This session can inspect premium surfaces for administration, but buyer access still depends on
              entitlement rows. Use <Link href="/admin/entitlements">Entitlement Admin</Link> for manual grants,
              recovery, and revocation.
            </span>
          </div>
        ) : entitlementRecords.length === 0 ? (
          <div className="pricing-state-banner warning">
            <strong>No entitlement records found.</strong>
            <span>
              This account can keep using public assets. Premium vaults and downloads require a paid entitlement,
              a temporary manual test grant, or a paid recovery record.
            </span>
          </div>
        ) : (
          <div className="value-grid">
            {entitlementRecords.map((entry) => {
              const vaultEntry = mapSummaryForVault(entry);
              if (!vaultEntry) {
                return null;
              }
              const expiresAt = formatVaultDate(vaultEntry.expiresAt ?? vaultEntry.trialEndsAt);
              const grantedAt = formatVaultDate(entry.grantedAt);

              return (
                <article key={`${entry.plan}-${entry.source}-${entry.grantedAt}`} className="value-card">
                  <div className="tier-head compact">
                    <div className="tier-title-block">
                      <p className="plan-tier">{planLabels[vaultEntry.plan] ?? vaultEntry.plan}</p>
                      <h3>{vaultEntry.label}</h3>
                    </div>
                    <span className={`payment-chip ${vaultEntry.tone}`}>
                      {entry.active ? 'Activo' : 'No activo'}
                    </span>
                  </div>
                  <p>{vaultEntry.body}</p>
                  <ul>
                    <li>Granted: {grantedAt ?? 'not recorded'}</li>
                    <li>{entry.kind === 'manual_test' ? `Trial ends: ${expiresAt ?? 'not recorded'}` : `Access window: ${expiresAt ?? 'not configured'}`}</li>
                  </ul>
                  <div className="hero-actions compact">
                    <Link href={vaultEntry.ctaHref} className="btn ghost">{vaultEntry.ctaLabel}</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="value-grid">
        <article className="value-card">
          <h3>Solo Access</h3>
          <p>For premium proof, controlled previews, and a buyer-only entry point that feels private without giving away the strongest assets.</p>
        </article>
        <article className="value-card">
          <h3>Pro Studio</h3>
          <p>For buyers who want the real protected product surface: reusable kits, layouts, manifests, and stronger production leverage.</p>
        </article>
        <article className="value-card">
          <h3>Full Signature</h3>
          <p>For buyers who want full-only Sheets, Outlook, analytics, Figma, and executive command surfaces on top of the Pro bundle.</p>
        </article>
      </section>

      {viewer.isOwner ? (
        <section className="card owner-panel">
          <p className="section-label">Owner tools</p>
          <h2>Manual test access and paid recovery tools</h2>
          <p>
            Use the dedicated admin panel to grant test access without payment, or recover access
            after a confirmed payment exception. Normal buyers should still use checkout and webhook unlock.
          </p>
          <div className="hero-actions compact">
            <Link href="/admin/entitlements" className="btn primary">Open Entitlement Admin</Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
