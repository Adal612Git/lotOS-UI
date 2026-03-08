import type { Metadata } from 'next';
import { CommercialLinkGrid, InfoTable, SectionCard } from '../commercial-blocks';
import { CommercialPageShell } from '../commercial-page-shell';
import { commercialRoutes, commercialSite } from '../../lib/commercial-site';

export const metadata: Metadata = {
  title: 'Administrar suscripcion | LotOS UI',
  description: 'Portal, renovacion y cancelacion de suscripcion para LotOS UI.',
};

export default function ManageSubscriptionPage() {
  const portalValue = commercialSite.subscriptionPortalUrl ? (
    <a href={commercialSite.subscriptionPortalUrl} target="_blank" rel="noreferrer">
      Abrir portal de suscripcion
    </a>
  ) : (
    'Pendiente de configurar: portal de suscripcion.'
  );

  return (
    <CommercialPageShell
      eyebrow="Administrar suscripcion"
      title="Renovacion, cancelacion y aclaraciones del plan en un solo lugar."
      lead={
        <p>
          Esta pagina te dice donde revisar el estado de tu suscripcion, como detener renovaciones futuras y que
          hacer si el correo de compra no coincide con el correo de acceso al vault.
        </p>
      }
      actions={
        <CommercialLinkGrid
          links={[
            {
              href: commercialSite.subscriptionPortalUrl ?? commercialRoutes.support,
              label: commercialSite.subscriptionPortalConfigured ? 'Abrir portal' : 'Pedir ayuda a soporte',
              external: commercialSite.subscriptionPortalConfigured,
            },
            { href: commercialRoutes.cancellations, label: 'Ver politica de cancelacion' },
          ]}
        />
      }
    >
      <section className="grid two">
        <SectionCard eyebrow="Portal" title="Donde administrar tu plan">
          <InfoTable
            rows={[
              { label: 'Portal de suscripcion', value: portalValue },
              { label: 'Correo de soporte', value: commercialSite.supportEmail },
              { label: 'Horario de soporte', value: commercialSite.supportHours },
            ]}
          />
        </SectionCard>
        <SectionCard eyebrow="Correo correcto" title="Si pagaste con otro email">
          <ul>
            <li>Indica el correo exacto usado en checkout.</li>
            <li>Indica el correo con el que intentaste entrar al vault.</li>
            <li>Soporte revisa el pago y corrige el entitlement cuando proceda.</li>
          </ul>
        </SectionCard>
      </section>

      <section className="grid two">
        <SectionCard eyebrow="Cancelacion" title="Como detener cobros futuros">
          <ol className="clarity-list">
            <li>Entra al portal si esta disponible.</li>
            <li>Revisa plan activo, fecha de renovacion y metodo de pago.</li>
            <li>Ejecuta la baja antes del siguiente corte para evitar el proximo cargo.</li>
          </ol>
        </SectionCard>
        <SectionCard eyebrow="Aclaraciones" title="Cuando debes escribirnos">
          <ul>
            <li>Si el portal no esta disponible o no refleja tu plan.</li>
            <li>Si hubo cargo, pero el vault no desbloqueo.</li>
            <li>Si tu caso es reembolso, cambio de correo o error de renovacion.</li>
          </ul>
        </SectionCard>
      </section>
    </CommercialPageShell>
  );
}
