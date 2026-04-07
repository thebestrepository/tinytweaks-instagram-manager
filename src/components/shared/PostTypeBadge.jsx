const TYPES = {
  'Reel':      { color: '#e07b6e', bg: 'rgba(224,123,110,0.12)', icon: '▶' },
  'Feed Post': { color: '#5aabee', bg: 'rgba(90,171,238,0.12)',  icon: '⊞' },
  'Story':     { color: '#4eca8b', bg: 'rgba(78,202,139,0.12)',  icon: '◑' },
}

export default function PostTypeBadge({ type }) {
  const c = TYPES[type] ?? { color: '#8b8fa8', bg: 'rgba(139,143,168,0.12)', icon: '●' }
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.28rem',
      padding:'0.18rem 0.5rem', fontSize:'0.68rem', fontFamily:'var(--font-body)',
      fontWeight:600, letterSpacing:'0.07em', textTransform:'uppercase',
      color:c.color, background:c.bg, border:`1px solid ${c.color}30`, borderRadius:'999px', whiteSpace:'nowrap' }}>
      <span style={{ fontSize:'0.55rem' }}>{c.icon}</span>
      {type}
    </span>
  )
}
