import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../auth-options';
import { buildLemonCheckoutUrl } from '../../../lib/checkout';
import { normalizePlan } from '../../../lib/plans';
import { buildRouteMetadata } from '../../../lib/seo';

export const runtime = 'nodejs';
export const metadata = buildRouteMetadata({
  title: 'LotOS UI Checkout',
  description: 'Managed checkout handoff for authenticated LotOS UI paid access.',
  path: '/checkout/pro',
});

export default async function ManagedCheckoutPage({
  params,
}: {
  params: Promise<{ plan: string }>;
}) {
  const resolvedParams = await params;
  const plan = normalizePlan(resolvedParams.plan);

  if (!plan || plan === 'free') {
    redirect('/pricing?state=invalid-checkout-plan');
  }

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email?.trim().toLowerCase();

  if (!userEmail) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/checkout/${resolvedParams.plan}`)}`);
  }

  const checkoutUrl = buildLemonCheckoutUrl({
    plan,
    email: userEmail,
  });

  if (!checkoutUrl) {
    redirect('/pricing?state=checkout-not-configured');
  }

  redirect(checkoutUrl);
}
