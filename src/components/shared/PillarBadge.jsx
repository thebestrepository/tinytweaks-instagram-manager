export const PILLARS = {
  'tiny-step':            { label: 'The Tiny Step',           color: '#4eca8b', bg: 'rgba(78,202,139,0.12)' },
  'morning-anchor':       { label: 'Morning Anchor',          color: '#f0b429', bg: 'rgba(240,180,41,0.12)' },
  'ordered-space':        { label: 'Ordered Space',           color: '#5aabee', bg: 'rgba(90,171,238,0.12)' },
  'slow-progress':        { label: 'Slow Progress',           color: '#e07b6e', bg: 'rgba(224,123,110,0.12)' },
  'gratitude-discipline': { label: 'Gratitude Discipline',    color: '#b89fd4', bg: 'rgba(184,159,212,0.12)' },
  'service-ordinary':     { label: 'Service in the Ordinary', color: '#7db88a', bg: 'rgba(125,184,138,0.12)' },
  'rest-discipline':      { label: 'Rest as Discipline',      color: '#7a9bb5', bg: 'rgba(122,155,181,0.12)' },
}

export default function PillarBadge({ pillar, size = 'sm' }) {
  const c = PILLARS[pillar] ?? { label: pillar, color: '#8b8fa8', bg: 'rgba(139,143,168,0.12)' }
  const pad = size === 'lg' ? '0.35rem 0.75rem' : '0.18rem 0.5rem'
  const fs  = size === 'lg' ? '0.8rem' : '0.68rem'
  const dot = size === 'lg' ? 7 : 5

  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'0.28rem', padding:pad,
      fontSize:fs, fontFamily:'var(--font-body)', fontWeight:500, letterSpacing:'0.02em',
      color:c.color, background:c.bg, border:`1px solid ${c.color}30`, borderRadius:'999px', whiteSpace:'nowrap' }}>
      <span style={{ width:dot, height:dot, borderRadius:'50%', background:c.color, flexShrink:0 }} />
      {c.label}
    </span>
  )
}
