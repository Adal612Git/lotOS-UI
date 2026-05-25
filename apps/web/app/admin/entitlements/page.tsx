import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../auth-options';
import { isOwnerEmail, normalizeEmail } from '../../../lib/owner';
import { buildRouteMetadata } from '../../../lib/seo';
import '../../lotos-landing.css';
import { EntitlementLookupForm, GrantAccessForm, RevokeAccessForm } from '../../grant-access-form';

export const runtime = 'nodejs';
export const metadata = buildRouteMetadata({
  title: 'LotOS UI Entitlement Admin',
  description: 'Owner-only control panel for test grants, paid entitlement recovery, and revocation.',
  path: '/admin/entitlements',
});

export default async function EntitlementAdminPage() {
  const session = await getServerSession(authOptions);
  const ownerEmail = normalizeEmail(session?.user?.email);

  if (!ownerEmail) {
    redirect('/login?callbackUrl=/admin/entitlements');
  }

  if (!isOwnerEmail(ownerEmail)) {
    redirect('/vault?state=owner-required');
  }

  return (
    <main className="landing pricing-page">
      <header className="top">
        <div className="brand">LotOS UI</div>
        <nav>
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/vault" className="nav-link nav-link--cta">Vault</Link>
          <Link href="/pricing" className="nav-link nav-link--pricing">Pricing</Link>
          <Link href="/api/auth/signout?callbackUrl=/" className="nav-link nav-link--muted">Sign Out</Link>
        </nav>
      </header>

      <section className="hero compact">
        <p className="kicker">Owner Control Panel</p>
        <h1>Entitlement control for test access, paid recovery, and revocation.</h1>
        <p className="lead">
          Signed in as <strong>{ownerEmail}</strong>. Manual changes are owner-only and write lifecycle
          metadata so test access, recovery, and revocation stay separate from normal paid purchases.
        </p>
        <div className="payment-meta" aria-label="Entitlement paths">
          <span className="payment-chip manual accent-violet">Test grant: temporary</span>
          <span className="payment-chip ready accent-emerald">Paid path: checkout webhook</span>
          <span className="payment-chip alt accent-cyan">Recovery requires reason</span>
          <span className="payment-chip manual accent-rose">Revoke: owner-only</span>
        </div>
      </section>

      <section className="grid two">
        <article className="card accent-violet">
          <p className="section-label">Path 1</p>
          <h2>Ricardo manual test access</h2>
          <p>
            Use this for QA, demos, pilots, or temporary validation. The API stores
            <code>manual_owner_test:*</code> as source metadata with a trial end date.
          </p>
          <ul>
            <li>No checkout is started and no payment claim is created.</li>
            <li>Default duration is 14 days; allowed durations are 7, 14, or 30 days.</li>
            <li>The user still needs Google sign-in with the granted email.</li>
          </ul>
        </article>

        <article className="card accent-emerald">
          <p className="section-label">Path 2</p>
          <h2>Normal paid unlock</h2>
          <p>
            Buyers should normally go through <code>/pricing</code>, <code>/checkout/[plan]</code>,
            Lemon checkout, <code>/api/webhooks/lemon</code>, and then <code>/vault</code>.
          </p>
          <ul>
            <li>Checkout receives the signed-in buyer email.</li>
            <li>Webhook maps Lemon variant IDs to LotOS plans.</li>
            <li>Paid recovery is only for confirmed payment exceptions.</li>
          </ul>
        </article>
      </section>

      <section className="card owner-panel">
        <p className="section-label">Buscar estado</p>
        <h2>Inspeccionar lifecycle por email</h2>
        <p>
          Usa esta busqueda antes de conceder recovery o revocar. El resultado es owner-only y puede mostrar
          notas internas; no lo copies a canales de soporte externos.
        </p>
        <EntitlementLookupForm />
      </section>

      <section className="card owner-panel">
        <p className="section-label">Manual grant</p>
        <h2>Dar de alta acceso sin confundirlo con venta normal</h2>
        <p>
          Selecciona &quot;Prueba sin pago&quot; para usuarios de prueba. Selecciona &quot;Pago confirmado&quot;
          solo cuando ya existe un pago real, revisaste evidencia y necesitas recuperar el unlock.
        </p>
        <GrantAccessForm />
      </section>

      <section className="card owner-panel">
        <p className="section-label">Revocar acceso</p>
        <h2>Registrar revocacion owner-only</h2>
        <p>
          Revocar marca el entitlement con <code>revokedAt</code>, <code>revokedBy</code> y
          <code>revokeReason</code>. El usuario puede seguir iniciando sesion con Google, pero pierde
          acceso premium si no queda otro entitlement activo.
        </p>
        <RevokeAccessForm />
      </section>
    </main>
  );
}
