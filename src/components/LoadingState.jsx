export default function LoadingState() {
  return (
    <div>
      {/* Week strip skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse"
            style={{
              height: '88px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-surface-2)',
            }}
          />
        ))}
      </div>

      {/* Detail skeleton */}
      <div
        className="animate-pulse"
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ height: 24, width: 120, borderRadius: 999, background: 'var(--color-surface-2)' }} />
          <div style={{ height: 24, width: 80, borderRadius: 999, background: 'var(--color-surface-2)' }} />
        </div>
        {[160, 120, 100, 140].map((w, i) => (
          <div
            key={i}
            style={{
              height: 14,
              width: `${w}px`,
              maxWidth: '100%',
              borderRadius: 4,
              background: 'var(--color-surface-2)',
              marginBottom: '0.6rem',
            }}
          />
        ))}
        <div style={{ height: 80, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', marginTop: '1rem' }} />
        <div style={{ height: 60, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', marginTop: '0.75rem' }} />
      </div>
    </div>
  )
}
