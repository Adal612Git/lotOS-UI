import type { Metadata } from 'next';
import { CommercialLinkGrid, SectionCard } from '../commercial-blocks';
import { CommercialPageShell } from '../commercial-page-shell';
import { commercialRoutes } from '../../lib/commercial-site';

export const metadata: Metadata = {
  title: 'Reembolsos | LotOS UI',
  description: 'Politica de reembolsos y aclaraciones para LotOS UI.',
};

export default function RefundsPage() {
  return (
    <CommercialPageShell
      eyebrow="Reembolsos"
      title="Politica operativa para compras digitales, acceso premium y aclaraciones."
      lead={
        <p>
          LotOS UI vende acceso digital y assets privados. Por eso la evaluacion de reembolsos no se basa
          solo en si hubo pago, sino en si hubo activacion, descarga, uso del vault o una falla real de entrega.
        </p>
      }
      actions={
        <CommercialLinkGrid
          links={[
            { href: commercialRoutes.afterPurchase, label: 'Ver flujo post-compra' },
            { href: commercialRoutes.support, label: 'Pedir revision de cargo' },
          ]}
        />
      }
    >
      <section className="grid two">
        <SectionCard eyebrow="Aplica" title="Cuando puede proceder un reembolso">
          <ul>
            <li>Si se cobro un plan y no hubo forma razonable de acceder al producto comprado.</li>
            <li>Si el entitlement no se pudo corregir en un plazo operativo razonable.</li>
            <li>Si se cobro un plan equivocado por error atribuible a nuestra configuracion comercial.</li>
          </ul>
        </SectionCard>
        <SectionCard eyebrow="No aplica automaticamente" title="Cuando no es inmediato">
          <ul>
            <li>Si el acceso ya fue activado, descargado o usado de forma sustancial.</li>
            <li>Si el comprador uso un correo distinto y no reporto el problema a tiempo.</li>
            <li>Si la aclaracion realmente corresponde a cancelacion futura y no a reembolso del cargo actual.</li>
          </ul>
        </SectionCard>
      </section>

      <section className="grid two">
        <SectionCard eyebrow="Procedimiento" title="Como solicitarlo">
          <ol className="clarity-list">
            <li>Indica el correo usado en compra y el plan cobrado.</li>
            <li>Describe si el problema fue acceso, cobro duplicado, correo incorrecto o plan equivocado.</li>
            <li>Adjunta evidencia de la compra o identificador del proveedor de pago.</li>
          </ol>
        </SectionCard>
        <SectionCard eyebrow="Resolucion" title="Como se evalua">
          <ul>
            <li>Primero intentamos corregir el acceso o el entitlement.</li>
            <li>Si no es posible entregar lo comprado de forma razonable, evaluamos el reembolso.</li>
            <li>El tiempo final tambien depende de la pasarela de pago que haya procesado el cargo.</li>
          </ul>
        </SectionCard>
      </section>
    </CommercialPageShell>
  );
}
