const PILLARS = {
  'tiny-step':            { label: 'The Tiny Step',            color: '#4eca8b', bg: 'rgba(78,202,139,0.12)' },
  'morning-anchor':       { label: 'Morning Anchor',           color: '#f0b429', bg: 'rgba(240,180,41,0.12)' },
  'ordered-space':        { label: 'Ordered Space',            color: '#5aabee', bg: 'rgba(90,171,238,0.12)' },
  'slow-progress':        { label: 'Slow Progress',            color: '#e07b6e', bg: 'rgba(224,123,110,0.12)' },
  'gratitude-discipline': { label: 'Gratitude Discipline',     color: '#b89fd4', bg: 'rgba(184,159,212,0.12)' },
  'service-ordinary':     { label: 'Service in the Ordinary',  color: '#7db88a', bg: 'rgba(125,184,138,0.12)' },
  'rest-discipline':      { label: 'Rest as Discipline',       color: '#7a9bb5', bg: 'rgba(122,155,181,0.12)' },
}

export default function PillarBadge({ pillar, size = 'sm' }) {
  const config = PILLARS[pillar] ?? { label: pillar, color: '#8b8fa8', bg: 'rgba(139,143,168,0.12)' }
  const padding = size === 'lg' ? '0.375rem 0.75rem' : '0.2rem 0.55rem'
  const fontSize = size === 'lg' ? '0.8rem' : '0.7rem'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        padding,
        fontSize,
        fontFamily: 'var(--font-body)',
        fontWeight: 500,
        letterSpacing: '0.02em',
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.color}30`,
        borderRadius: '999px',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: size === 'lg' ? 7 : 6,
          height: size === 'lg' ? 7 : 6,
          borderRadius: '50%',
          background: config.color,
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  )
}

export { PILLARS }
