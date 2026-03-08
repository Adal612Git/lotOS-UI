import type { Metadata } from 'next';
import { CommercialLinkGrid, SectionCard } from '../commercial-blocks';
import { CommercialPageShell } from '../commercial-page-shell';
import { commercialRoutes, commercialSite } from '../../lib/commercial-site';

export const metadata: Metadata = {
  title: 'Terminos | LotOS UI',
  description: 'Terminos y condiciones de uso y compra para LotOS UI.',
};

export default function TermsPage() {
  return (
    <CommercialPageShell
      eyebrow="Terminos y condiciones"
      title="Condiciones claras para usar, comprar y conservar acceso a LotOS UI."
      lead={
        <>
          <p>
            LotOS UI combina software publico, acceso digital autenticado y assets privados de entrega
            controlada. Estos terminos describen que se compra, que se recibe hoy, que no se promete y
            como se mantiene el acceso.
          </p>
        </>
      }
      actions={
        <CommercialLinkGrid
          links={[
            { href: commercialRoutes.afterPurchase, label: 'Ver que pasa despues de comprar' },
            { href: commercialRoutes.cancellations, label: 'Ver cancelaciones' },
            { href: commercialRoutes.support, label: 'Contactar soporte' },
          ]}
        />
      }
    >
      <section className="grid two">
        <SectionCard eyebrow="Producto" title="Que es LotOS UI">
          <p>
            LotOS UI es una plataforma de UI con capa publica MIT, documentacion, demos, CLI y una capa
            premium de acceso privado. No todos los planes entregan el mismo tipo de valor: algunos dan
            acceso a vault y previews; otros habilitan assets privados y superficies premium.
          </p>
          <ul>
            <li>La capa MIT publica no se vende como exclusiva.</li>
            <li>La capa premium vende acceso, aceleracion y assets privados concretos.</li>
            <li>Si un plan requiere gestion guiada, eso debe mostrarse antes del cobro.</li>
          </ul>
        </SectionCard>
        <SectionCard eyebrow="Compra" title="Que compras y cuando se activa">
          <p>
            Cada plan indica si la activacion es inmediata o si requiere una ruta guiada. Cuando el checkout
            esta configurado con unlock automatico, el acceso depende del mismo correo usado en la compra.
          </p>
          <ul>
            <li>El acceso no se transfiere automaticamente a un correo distinto.</li>
            <li>La compra se considera completa cuando el proveedor de pago confirma la transaccion.</li>
            <li>Si el unlock falla, soporte revisa el pago y corrige el acceso.</li>
          </ul>
        </SectionCard>
      </section>

      <section className="grid two">
        <SectionCard eyebrow="Licencia" title="Uso permitido">
          <ul>
            <li>Puedes usar LotOS UI para evaluacion, implementacion interna y entregables propios segun tu plan.</li>
            <li>No puedes revender como exclusivo contenido MIT publico del proyecto.</li>
            <li>No puedes redistribuir assets privados fuera del alcance permitido por tu licencia o acuerdo comercial.</li>
            <li>No puedes presentar contenido premium como si fuera de libre acceso si forma parte de una compra cerrada.</li>
          </ul>
        </SectionCard>
        <SectionCard eyebrow="Restricciones" title="Uso no permitido">
          <ul>
            <li>Intentar evadir auth, gating, entitlement checks o descargas protegidas.</li>
            <li>Usar el servicio para phishing, fraude, scraping abusivo o actividades ilegales.</li>
            <li>Compartir accesos privados de forma no autorizada cuando el plan sea individual o restringido.</li>
          </ul>
          <p className="micro-note">
            El incumplimiento puede terminar en suspension de acceso o revocacion del entitlement.
          </p>
        </SectionCard>
      </section>

      <section className="grid two">
        <SectionCard eyebrow="Pagos" title="Cobros, renovaciones y cambios">
          <ul>
            <li>Los planes mensuales se renuevan segun la pasarela de pago configurada para tu suscripcion.</li>
            <li>Cancelar detiene cobros futuros segun la fecha de corte del proveedor de pago.</li>
            <li>Los cambios de precio no afectan cargos ya procesados y deben informarse antes de renovar.</li>
          </ul>
        </SectionCard>
        <SectionCard eyebrow="Soporte y cambios" title="Operacion y continuidad">
          <ul>
            <li>Podemos actualizar docs, assets y flujos para mejorar el producto o corregir errores.</li>
            <li>Si un cambio afecta acceso, soporte o renovaciones, se mostrara en la superficie comercial correspondiente.</li>
            <li>El soporte operativo se presta por los canales publicados en la pagina de soporte.</li>
          </ul>
          <p className="micro-note">
            Datos del proveedor actual: {commercialSite.providerLegalName}
          </p>
        </SectionCard>
      </section>
    </CommercialPageShell>
  );
}
