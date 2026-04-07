import PillarBadge, { PILLARS } from '../shared/PillarBadge.jsx'
import PostTypeBadge from '../shared/PostTypeBadge.jsx'

const TODAY = new Date().toISOString().split('T')[0]

const STATUS_DOT = {
  posted:  '#4eca8b',
  skipped: '#e07b6e',
  planned: 'transparent',
}

export default function DayCell({ date, dayName, post, isSelected, onClick }) {
  const isToday    = date === TODAY
  const isPast     = date < TODAY
  const dayNum     = date.split('-')[2]
  const hasPost    = !!post
  const status     = post?.status ?? null
  const dotColor   = STATUS_DOT[status] ?? 'transparent'
  const pillarColor = post ? (PILLARS[post.pillar]?.color ?? '#8b8fa8') : null

  return (
    <button onClick={onClick}
      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem',
        padding:'0.5rem 0.3rem', minWidth:0, width:'100%',
        background: isSelected ? 'var(--color-surface-2)' : 'var(--color-surface)',
        border: isSelected
          ? `1px solid var(--color-accent)`
          : isToday
          ? '1px solid rgba(240,180,41,0.35)'
          : `1px solid ${hasPost ? 'rgba(255,255,255,0.09)' : 'var(--color-border)'}`,
        borderRadius:'var(--radius-md)', cursor:'pointer', outline:'none',
        transition:'border-color 0.12s, background 0.12s',
        opacity: isPast && !hasPost ? 0.4 : 1,
        position:'relative' }}>

      {/* Status dot */}
      {status && status !== 'planned' && (
        <span style={{ position:'absolute', top:5, right:5, width:6, height:6,
          borderRadius:'50%', background:dotColor }} />
      )}

      <span style={{ fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.08em',
        textTransform:'uppercase', color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
        fontFamily:'var(--font-body)' }}>
        {dayName.slice(0, 3)}
      </span>

      <span style={{ fontSize:'1rem', fontFamily:'var(--font-display)', fontWeight:600,
        lineHeight:1, color: isSelected ? 'var(--color-text)' : isPast ? 'var(--color-text-soft)' : 'var(--color-text)' }}>
        {dayNum}
      </span>

      {hasPost ? (
        <PillarBadge pillar={post.pillar} />
      ) : (
        <span style={{ fontSize:'0.6rem', color:'var(--color-text-muted)',
          fontFamily:'var(--font-body)', fontStyle:'italic' }}>
          empty
        </span>
      )}
    </button>
  )
}
