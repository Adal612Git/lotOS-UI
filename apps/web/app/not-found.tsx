import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section style={{ maxWidth: 520 }}>
        <p style={{ margin: 0, color: 'var(--lotos-warning)', fontWeight: 800 }}>Route not found</p>
        <h1 style={{ margin: '8px 0 0' }}>This LotOS UI surface is not registered here.</h1>
        <p style={{ color: 'var(--lotos-fg-secondary)' }}>
          Use the registry-backed entry points instead of guessing unpublished routes.
        </p>
        <Link href="/ai">Open AI console</Link>
      </section>
    </main>
  );
}
