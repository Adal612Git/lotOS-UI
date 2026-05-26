import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth-options';
import { buildRouteMetadata } from '../../lib/seo';
import { normalizeEmail } from '../../lib/owner';
import { ClaimClient } from './claim-client';

export const metadata: Metadata = buildRouteMetadata({
  title: 'Claim promotional access | LotOS UI',
  description:
    'Claim a Creator Pass, Founder Pass, Pro Studio Trial, or Full Signature Gift for LotOS UI with server-side access validation.',
  path: '/claim',
});

export default async function ClaimPage({
  searchParams,
}: {
  searchParams?: Promise<{ code?: string }>;
}) {
  const params = searchParams ? await searchParams : undefined;
  const session = await getServerSession(authOptions);
  const signedIn = Boolean(normalizeEmail(session?.user?.email));
  const initialCode = typeof params?.code === 'string' ? params.code : '';

  return (
    <main className="landing claim-page">
      <header className="top">
        <Link href="/" className="brand">LotOS UI</Link>
        <nav aria-label="Principal">
          <Link href="/free">Free</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/demo/student-control">Demo</Link>
          <Link href="/login">Login</Link>
        </nav>
      </header>
      <ClaimClient initialCode={initialCode} signedIn={signedIn} />
    </main>
  );
}
