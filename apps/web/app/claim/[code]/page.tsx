import { redirect } from 'next/navigation';

export default async function ClaimCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  redirect(`/claim?code=${encodeURIComponent(code)}`);
}
