const POST_TYPES = {
  'Reel':      { color: '#e07b6e', bg: 'rgba(224,123,110,0.12)', icon: '▶' },
  'Feed Post': { color: '#5aabee', bg: 'rgba(90,171,238,0.12)',  icon: '⊞' },
  'Story':     { color: '#4eca8b', bg: 'rgba(78,202,139,0.12)',  icon: '◑' },
}

export default function PostTypeBadge({ type }) {
  const config = POST_TYPES[type] ?? { color: '#8b8fa8', bg: 'rgba(139,143,168,0.12)', icon: '●' }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding: '0.2rem 0.55rem',
        fontSize: '0.7rem',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}30`,
        borderRadius: '999px',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontSize: '0.6rem' }}>{config.icon}</span>
      {type}
    </span>
  )
}
