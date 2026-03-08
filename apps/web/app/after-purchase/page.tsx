import type { Metadata } from 'next';
import Link from 'next/link';
import { Badge } from '../lotos-surface';
import { CommercialLinkGrid, SectionCard } from '../commercial-blocks';
import { CommercialPageShell } from '../commercial-page-shell';
import { customerAccessRules, commercialRoutes } from '../../lib/commercial-site';
import { salesPlans } from '../sales-config';

export const metadata: Metadata = {
  title: 'Despues de comprar | LotOS UI',
  description: 'Que pasa despues de comprar LotOS UI, como accedes y que incluye cada plan.',
};

const accessModes: Record<string, { immediacy: string; note: string; notIncluded: string[] }> = {
  solo: {
    immediacy: 'Acceso digital al vault y previews privados cuando el checkout esta configurado con unlock automatico.',
    note: 'Usa el mismo correo de checkout para iniciar sesion y abrir el vault.',
    notIncluded: [
      'No incluye implementacion personalizada.',
      'No convierte la capa MIT publica en exclusiva.',
    ],
  },
  pro: {
    immediacy: 'Acceso premium al vault y a assets privados del bundle Pro segun el entitlement activo.',
    note: 'Si el unlock falla, soporte corrige el acceso con el correo exacto usado en la compra.',
    notIncluded: [
      'No incluye servicios a medida no descritos en el plan.',
      'No garantiza soporte de runtimes alpha fuera del alcance documentado.',
    ],
  },
  'launch-pack': {
    immediacy: 'La entrega depende de si Full Signature tiene checkout directo activo o cierre guiado. Debe indicarse antes del cobro.',
    note: 'Si el plan se ofrece por cierre guiado, soporte te indica la ruta exacta de activacion y entrega.',
    notIncluded: [
      'No debe cobrarse como entrega automatica si el paquete aun requiere trabajo manual posterior.',
      'No sustituye una consultoria completa salvo que eso se contrate aparte.',
    ],
  },
};

type AccessModeKey = 'solo' | 'pro' | 'launch-pack';

const typedAccessModes: Record<AccessModeKey, { immediacy: string; note: string; notIncluded: string[] }> =
  accessModes as Record<AccessModeKey, { immediacy: string; note: string; notIncluded: string[] }>;

export default function AfterPurchasePage() {
  const paidPlans = salesPlans.filter((plan) => plan.kind === 'paid');

  return (
    <CommercialPageShell
      eyebrow="Despues de comprar"
      title="Compra, acceso y entrega: el cliente debe entenderlo sin adivinar."
      lead={
        <p>
          Esta es la ruta post-compra de LotOS UI. Explica que email usar, como entrar al vault, que sucede si
          no se desbloquea, como administrar la suscripcion y que incluye cada plan desde el primer dia.
        </p>
      }
      actions={
        <CommercialLinkGrid
          links={[
            { href: commercialRoutes.manageSubscription, label: 'Administrar suscripcion' },
            { href: commercialRoutes.support, label: 'Necesito ayuda con mi acceso' },
          ]}
        />
      }
    >
      <section className="grid two">
        <SectionCard eyebrow="Flujo" title="Que debes hacer despues de pagar">
          <ol className="clarity-list">
            {customerAccessRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ol>
        </SectionCard>
        <SectionCard eyebrow="Si algo falla" title="Que hacer si no se desbloquea">
          <ul>
            <li>Confirma el correo usado en checkout.</li>
            <li>Inicia sesion con ese mismo correo.</li>
            <li>Si el vault no refleja el plan, contacta soporte con evidencia del pago.</li>
            <li>El equipo puede corregir el entitlement cuando haya una falla real del webhook o del correo.</li>
          </ul>
        </SectionCard>
      </section>

      <section className="card landing-section">
        <div className="section-headline">
          <p className="section-label">Planes</p>
          <h2>Que incluye cada plan y que no debes asumir.</h2>
        </div>
        <div className="tier-grid commercial-tier-grid">
          {paidPlans.map((plan) => {
            const details = typedAccessModes[plan.id as AccessModeKey] ?? typedAccessModes.solo;
            return (
              <article key={plan.id} className={`tier-card ${plan.id}`}>
                <div className="tier-head">
                  <div className="tier-title-block">
                    <p className="plan-tier">{plan.name}</p>
                    <h3>{plan.priceLabel}</h3>
                    <p>{plan.summary}</p>
                  </div>
                  <Badge variant={plan.id === 'launch-pack' ? 'outline' : plan.id === 'pro' ? 'warning' : 'info'}>
                    {plan.id === 'launch-pack' ? 'Premium alto' : plan.id === 'pro' ? 'Uso serio' : 'Entrada premium'}
                  </Badge>
                </div>
                <p className="tier-promise">{details.immediacy}</p>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <p className="plan-note">{details.note}</p>
                <div className="info-callout">
                  <strong>No incluye automaticamente:</strong>
                  <ul>
                    {details.notIncluded.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid two">
        <SectionCard eyebrow="Vault" title="Como entrar al vault">
          <p>
            Entra con el mismo correo de pago. Si tu plan esta activo, el vault debe mostrar la superficie
            correspondiente y habilitar descargas segun el entitlement.
          </p>
          <div className="hero-actions compact">
            <Link href="/login" className="btn ghost">
              Iniciar sesion
            </Link>
            <Link href="/vault" className="btn primary">
              Abrir vault
            </Link>
          </div>
        </SectionCard>
        <SectionCard eyebrow="Suscripcion" title="Como seguir administrando tu compra">
          <ul>
            <li>Usa la pagina de administracion para revisar renovacion, metodo de pago y cancelacion.</li>
            <li>Si todavia no hay portal visible, soporte te da la ruta operativa correcta.</li>
            <li>Guarda siempre el correo con el que compraste; es la llave del unlock.</li>
          </ul>
        </SectionCard>
      </section>
    </CommercialPageShell>
  );
}
