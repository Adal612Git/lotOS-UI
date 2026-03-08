import type { Metadata } from 'next';
import { CommercialLinkGrid, SectionCard } from '../commercial-blocks';
import { CommercialPageShell } from '../commercial-page-shell';
import { commercialRoutes, subscriptionRules } from '../../lib/commercial-site';

export const metadata: Metadata = {
  title: 'Cancelaciones | LotOS UI',
  description: 'Como cancelar y que pasa con tu acceso en LotOS UI.',
};

export default function CancellationsPage() {
  return (
    <CommercialPageShell
      eyebrow="Cancelaciones"
      title="Cancelar debe ser claro: sin cobros sorpresa, sin copy ambiguo."
      lead={
        <p>
          Los planes mensuales de LotOS UI mantienen acceso mientras la suscripcion siga activa. Esta pagina
          explica como cancelar, cuando deja de renovarse y que cambia en tu acceso despues de la baja.
        </p>
      }
      actions={
        <CommercialLinkGrid
          links={[
            { href: commercialRoutes.manageSubscription, label: 'Administrar suscripcion' },
            { href: commercialRoutes.support, label: 'Necesito ayuda con la baja' },
          ]}
        />
      }
    >
      <section className="grid two">
        <SectionCard eyebrow="Reglas" title="Como funciona la baja">
          <ul>
            {subscriptionRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </SectionCard>
        <SectionCard eyebrow="Acceso" title="Que pasa con el vault">
          <ul>
            <li>Tu acceso premium se conserva solo hasta el final del periodo ya pagado, salvo que la pasarela indique otra cosa.</li>
            <li>Al terminar el periodo activo, el vault vuelve a comportarse como una cuenta sin entitlement.</li>
            <li>La capa publica, docs y superficie gratuita siguen disponibles segun el producto abierto.</li>
          </ul>
        </SectionCard>
      </section>

      <section className="grid two">
        <SectionCard eyebrow="Portal" title="Si existe portal de suscripcion">
          <p>
            Usa la pagina de administracion de suscripcion para ver renovacion, metodo de pago y cancelacion. Si
            el portal aun no esta configurado, soporte te indicara la ruta operativa correcta.
          </p>
        </SectionCard>
        <SectionCard eyebrow="Excepciones" title="Si hay error de cobro o email incorrecto">
          <ul>
            <li>Reporta el correo exacto usado al pagar.</li>
            <li>Indica si el problema es cancelacion, reembolso o solo correccion de acceso.</li>
            <li>No cierres la aclaracion solo con una captura; necesitamos el identificador de compra cuando exista.</li>
          </ul>
        </SectionCard>
      </section>
    </CommercialPageShell>
  );
}
