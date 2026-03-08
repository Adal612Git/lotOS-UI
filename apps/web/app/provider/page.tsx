import type { Metadata } from 'next';
import { CommercialLinkGrid, InfoTable, SectionCard } from '../commercial-blocks';
import { CommercialPageShell } from '../commercial-page-shell';
import { commercialRoutes, commercialSite } from '../../lib/commercial-site';

export const metadata: Metadata = {
  title: 'Proveedor | LotOS UI',
  description: 'Datos del proveedor y contacto comercial de LotOS UI.',
};

export default function ProviderPage() {
  return (
    <CommercialPageShell
      eyebrow="Proveedor"
      title="Identidad operativa y datos de contacto del proveedor del servicio."
      lead={
        <p>
          Esta pagina concentra la informacion minima de identificacion del proveedor para fines de soporte,
          facturacion, privacidad y aclaraciones comerciales.
        </p>
      }
      actions={
        <CommercialLinkGrid
          links={[
            { href: commercialRoutes.privacy, label: 'Ver privacidad' },
            { href: commercialRoutes.support, label: 'Ver soporte' },
          ]}
        />
      }
    >
      <section className="grid two">
        <SectionCard eyebrow="Identidad" title="Datos visibles del proveedor">
          <InfoTable
            rows={[
              { label: 'Marca comercial', value: commercialSite.brandName },
              { label: 'Razon social', value: commercialSite.providerLegalName },
              { label: 'RFC', value: commercialSite.providerRfc },
              { label: 'Domicilio fiscal', value: commercialSite.providerAddress },
            ]}
          />
        </SectionCard>
        <SectionCard eyebrow="Contacto" title="Canales operativos">
          <InfoTable
            rows={[
              { label: 'Correo del proveedor', value: commercialSite.providerEmail },
              { label: 'Correo de soporte', value: commercialSite.supportEmail },
              { label: 'Horario de soporte', value: commercialSite.supportHours },
            ]}
          />
        </SectionCard>
      </section>

      <section className="grid two">
        <SectionCard eyebrow="Facturacion" title="Sobre CFDI y datos fiscales">
          <p>
            Si necesitas facturacion o comprobantes adicionales, el proceso debe confirmarse por los canales de
            soporte publicados aqui. Si algun dato sigue pendiente, el placeholder se muestra de forma explicita
            para evitar promesas falsas.
          </p>
        </SectionCard>
        <SectionCard eyebrow="Transparencia" title="Que no hacemos">
          <ul>
            <li>No presentamos la capa MIT publica como si fuera contenido premium exclusivo.</li>
            <li>No prometemos acceso automatico cuando el checkout real no esta configurado para ello.</li>
            <li>No escondemos datos operativos basicos detras de un formulario opaco.</li>
          </ul>
        </SectionCard>
      </section>
    </CommercialPageShell>
  );
}
