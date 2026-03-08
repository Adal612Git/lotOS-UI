import type { Metadata } from 'next';
import { CommercialLinkGrid, InfoTable, SectionCard } from '../commercial-blocks';
import { CommercialPageShell } from '../commercial-page-shell';
import { commercialRoutes, commercialSite } from '../../lib/commercial-site';

export const metadata: Metadata = {
  title: 'Privacidad | LotOS UI',
  description: 'Aviso de privacidad operativo de LotOS UI.',
};

export default function PrivacyPage() {
  return (
    <CommercialPageShell
      eyebrow="Aviso de privacidad"
      title="Tratamos datos de acceso, compra y soporte solo para operar LotOS UI."
      lead={
        <p>
          Este aviso resume que datos tratamos, con que finalidad y por que proveedores externos puede
          pasar cierta informacion cuando usas login, checkout, soporte o acceso premium.
        </p>
      }
      actions={
        <CommercialLinkGrid
          links={[
            { href: commercialRoutes.provider, label: 'Ver datos del proveedor' },
            { href: commercialRoutes.support, label: 'Solicitar aclaracion' },
          ]}
        />
      }
    >
      <section className="grid two">
        <SectionCard eyebrow="Datos" title="Que informacion se trata">
          <ul>
            <li>Correo de acceso cuando inicias sesion.</li>
            <li>Correo usado en checkout para asignar el entitlement correcto.</li>
            <li>Datos operativos de soporte cuando nos escribes para aclaraciones.</li>
            <li>Informacion tecnica minima para seguridad, gating y diagnostico.</li>
          </ul>
        </SectionCard>
        <SectionCard eyebrow="Finalidad" title="Para que se usa">
          <ul>
            <li>Autenticar tu acceso y proteger el vault.</li>
            <li>Relacionar tu compra con el plan correcto.</li>
            <li>Atender soporte, reembolsos, cancelaciones o correcciones de correo.</li>
            <li>Mejorar seguridad, disponibilidad y consistencia del producto.</li>
          </ul>
        </SectionCard>
      </section>

      <section className="grid two">
        <SectionCard eyebrow="Procesadores" title="Proveedores externos involucrados">
          <ul>
            <li>Google Auth para autenticacion, cuando el login con Google esta habilitado.</li>
            <li>Supabase para resolver y almacenar entitlements.</li>
            <li>Lemon Squeezy o la pasarela de pago configurada para procesar cobros y renovaciones.</li>
            <li>Vercel u otros servicios de hosting para la operacion de la app.</li>
          </ul>
        </SectionCard>
        <SectionCard eyebrow="Derechos" title="Como pedir aclaraciones">
          <p>
            Si necesitas rectificar correo de acceso, aclarar un cobro o pedir detalles del tratamiento, usa
            los canales operativos publicados abajo.
          </p>
          <InfoTable
            rows={[
              { label: 'Correo de soporte', value: commercialSite.supportEmail },
              { label: 'Correo del proveedor', value: commercialSite.providerEmail },
              { label: 'Horario de soporte', value: commercialSite.supportHours },
            ]}
          />
        </SectionCard>
      </section>
    </CommercialPageShell>
  );
}
