export default function Loading() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div role="status" aria-live="polite" style={{ maxWidth: 420, textAlign: 'center' }}>
        <strong>Loading LotOS UI</strong>
        <p style={{ color: 'var(--lotos-fg-secondary)' }}>Preparing the registry-backed surface.</p>
      </div>
    </main>
  );
}
