import { getServerSession } from 'next-auth';
import './lotos-landing.css';
import { authOptions } from '../auth-options';
import { buildRouteMetadata } from '../lib/seo';
import { HomePageContent } from './home-sections';

export const metadata = buildRouteMetadata({
  title: 'LotOS UI',
  description:
    'Product surfaces para convertir pantallas generadas por IA en dashboards, CRUDs, reportes y kits listos para entregar.',
  path: '/',
});

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  const signedInEmail = session?.user?.email ?? null;

  return <HomePageContent signedInEmail={signedInEmail} />;
}
