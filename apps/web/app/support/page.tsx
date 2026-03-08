import type { Metadata } from 'next';
import { CommercialLinkGrid, InfoTable, SectionCard } from '../commercial-blocks';
import { CommercialPageShell } from '../commercial-page-shell';
import { commercialRoutes, commercialSite } from '../../lib/commercial-site';

export const metadata: Metadata = {
  title: 'Soporte | LotOS UI',
  description: 'Canales de soporte y aclaraciones para LotOS UI.',
};

export default function SupportPage() {
  return (
    <CommercialPageShell
      eyebrow="Soporte"
      title="Soporte operativo para acceso, cobros, vault y aclaraciones comerciales."
      lead={
        <p>
          Si compraste un plan, tu soporte debe empezar por resolver acceso, pagos y entregables. Usa esta ruta
          para desbloqueos fallidos, correccion de correo, cancelacion, reembolso o dudas del plan contratado.
        </p>
      }
      actions={
        <CommercialLinkGrid
          links={[
            { href: commercialRoutes.afterPurchase, label: 'Ver flujo post-compra' },
            { href: commercialRoutes.manageSubscription, label: 'Administrar suscripcion' },
          ]}
        />
      }
    >
      <section className="grid two">
        <SectionCard eyebrow="Canales" title="Como contactarnos">
          <InfoTable
            rows={[
              { label: 'Correo de soporte', value: commercialSite.supportEmail },
              { label: 'Correo del proveedor', value: commercialSite.providerEmail },
              { label: 'Horario de soporte', value: commercialSite.supportHours },
            ]}
          />
        </SectionCard>
        <SectionCard eyebrow="Que incluir" title="Para resolver mas rapido">
          <ul>
            <li>Correo usado en compra.</li>
            <li>Plan comprado o ruta que estabas intentando abrir.</li>
            <li>Captura o identificador del pago si el problema es de unlock.</li>
            <li>Descripcion clara del error: acceso, descarga, renovacion, cancelacion o facturacion.</li>
          </ul>
        </SectionCard>
      </section>

      <section className="grid two">
        <SectionCard eyebrow="Cobertura" title="Que soporte si cubre">
          <ul>
            <li>Errores de login o vault.</li>
            <li>Entitlements no reflejados.</li>
            <li>Dudas sobre renovacion o cancelacion.</li>
            <li>Aclaraciones sobre lo incluido en cada plan.</li>
          </ul>
        </SectionCard>
        <SectionCard eyebrow="Limites" title="Que no cubre automaticamente">
          <ul>
            <li>Servicios de implementacion personalizada que no formen parte del plan comprado.</li>
            <li>Desarrollo a medida no publicado como entregable del plan.</li>
            <li>Soporte sobre stacks o runtimes marcados como alpha fuera del alcance documentado.</li>
          </ul>
        </SectionCard>
      </section>
    </CommercialPageShell>
  );
}
