import PillarBadge, { PILLARS } from '../shared/PillarBadge.jsx'
import PostTypeBadge from '../shared/PostTypeBadge.jsx'
import CopyButton from '../shared/CopyButton.jsx'

const STATUS_CONFIG = {
  planned: { label: 'Planned',  color: '#8b8fa8', bg: 'rgba(139,143,168,0.1)' },
  posted:  { label: 'Posted ✓', color: '#4eca8b', bg: 'rgba(78,202,139,0.1)'  },
  skipped: { label: 'Skipped',  color: '#e07b6e', bg: 'rgba(224,123,110,0.1)' },
}

function fmt(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', {
    weekday:'long', day:'numeric', month:'long',
  })
}

export default function DayBrief({ post, onStatusChange }) {
  const pillarColor = PILLARS[post.pillar]?.color ?? '#8b8fa8'
  const sc = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.planned

  return (
    <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)',
      borderRadius:'var(--radius-lg)', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        flexWrap:'wrap', gap:'0.5rem', padding:'1rem 1.25rem',
        borderBottom:'1px solid var(--color-border)', background:'var(--color-surface-2)' }}>
        <div>
          <h2 style={{ margin:'0 0 0.4rem', fontSize:'1.25rem', fontFamily:'var(--font-display)' }}>
            {fmt(post.date)}
          </h2>
          <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap' }}>
            <PillarBadge pillar={post.pillar} size="lg" />
            <PostTypeBadge type={post.post_type} />
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
          <span style={{ fontSize:'0.78rem', color:'var(--color-text-soft)' }}>
            🕐 {post.best_time_to_post}
          </span>
          {/* Status toggle */}
          {onStatusChange && (
            <div style={{ display:'flex', gap:'0.3rem' }}>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <button key={key} onClick={() => onStatusChange(post.id, key)}
                  style={{ padding:'0.22rem 0.6rem', fontSize:'0.68rem', fontFamily:'var(--font-body)',
                    fontWeight:500, color: post.status === key ? cfg.color : 'var(--color-text-muted)',
                    background: post.status === key ? cfg.bg : 'transparent',
                    border:`1px solid ${post.status === key ? cfg.color + '50' : 'var(--color-border)'}`,
                    borderRadius:'999px', cursor:'pointer', outline:'none' }}>
                  {cfg.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stats summary if posted */}
      {post.status === 'posted' && (post.likes != null || post.reach != null) && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', padding:'0.75rem 1.25rem',
          borderBottom:'1px solid var(--color-border)', background:'rgba(78,202,139,0.04)' }}>
          {[['❤️', post.likes, 'likes'], ['🔖', post.saves, 'saves'], ['👁', post.reach, 'reach'],
            ['💬', post.comments, 'comments'], ['👤+', post.follows_gained, 'follows'],
            ['↗️', post.shares, 'shares']].map(([icon, val, lbl]) =>
            val != null && (
              <span key={lbl} style={{ fontSize:'0.78rem', color:'var(--color-text-soft)',
                fontFamily:'var(--font-body)', display:'flex', alignItems:'center', gap:'0.25rem' }}>
                {icon} <strong style={{ color:'var(--color-text)' }}>{val.toLocaleString()}</strong> {lbl}
              </span>
            )
          )}
          {post.reach && post.likes && (
            <span style={{ fontSize:'0.78rem', color:'#4eca8b', fontFamily:'var(--font-body)',
              marginLeft:'auto', fontWeight:500 }}>
              {(((post.likes + (post.saves ?? 0) + (post.comments ?? 0)) / post.reach) * 100).toFixed(1)}% eng.
            </span>
          )}
        </div>
      )}

      {/* Body */}
      <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column', gap:'1.1rem' }}>

        {/* Visual Concept */}
        <section>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
            <Label>Visual Concept</Label>
            <CopyButton text={post.visual_concept} label="Visual" />
          </div>
          <blockquote style={{ margin:0, padding:'0.75rem 1rem',
            borderLeft:`3px solid ${pillarColor}`, background:`${pillarColor}08`,
            borderRadius:'0 var(--radius-md) var(--radius-md) 0',
            fontFamily:'var(--font-display)', fontSize:'0.97rem', lineHeight:1.65,
            color:'var(--color-text)', fontStyle:'italic' }}>
            {post.visual_concept}
          </blockquote>
        </section>

        {/* Caption */}
        <section>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
            <Label>Caption</Label>
            <CopyButton text={post.caption} label="Caption" />
          </div>
          <div style={{ padding:'0.75rem 1rem', background:'var(--color-surface-2)',
            border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)',
            fontFamily:'var(--font-body)', fontSize:'0.88rem', lineHeight:1.7, whiteSpace:'pre-wrap' }}>
            {post.caption}
          </div>
        </section>

        {/* Hashtags */}
        <section>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.4rem' }}>
            <Label>Hashtags</Label>
            <CopyButton text={post.hashtags.join(' ')} label="All" />
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem' }}>
            {post.hashtags.map((tag) => (
              <span key={tag} style={{ padding:'0.18rem 0.55rem', fontSize:'0.75rem',
                fontFamily:'var(--font-mono)', color:'var(--color-sky)',
                background:'rgba(90,171,238,0.08)', border:'1px solid rgba(90,171,238,0.2)',
                borderRadius:'999px' }}>
                {tag}
              </span>
            ))}
          </div>
        </section>

        {post.notes && (
          <section>
            <Label>Notes</Label>
            <p style={{ margin:'0.3rem 0 0', fontSize:'0.85rem', color:'var(--color-text-soft)',
              fontFamily:'var(--font-body)', lineHeight:1.6 }}>{post.notes}</p>
          </section>
        )}
      </div>
    </div>
  )
}

function Label({ children }) {
  return (
    <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em',
      textTransform:'uppercase', color:'var(--color-text-soft)', fontFamily:'var(--font-body)' }}>
      {children}
    </span>
  )
}
