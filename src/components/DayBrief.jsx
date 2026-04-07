import PillarBadge, { PILLARS } from './PillarBadge.jsx'
import PostTypeBadge from './PostTypeBadge.jsx'
import CopyButton from './CopyButton.jsx'

export default function DayBrief({ day }) {
  const pillarConfig = PILLARS[day.pillar] ?? { color: '#8b8fa8' }
  const hashtagsText = day.hashtags.join(' ')

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T12:00:00')
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface-2)',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '1.35rem',
              fontFamily: 'var(--font-display)',
              color: 'var(--color-text)',
            }}
          >
            {formatDate(day.date)}
          </h2>
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            <PillarBadge pillar={day.pillar} size="lg" />
            <PostTypeBadge type={day.postType} />
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--color-text-soft)',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span style={{ fontSize: '1rem' }}>🕐</span>
          <span>Post at <strong style={{ color: 'var(--color-text)' }}>{day.bestTimeToPost}</strong></span>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Visual Concept */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-soft)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Visual Concept
            </span>
            <CopyButton text={day.visualConcept} label="Visual" />
          </div>
          <blockquote
            style={{
              margin: 0,
              padding: '0.85rem 1rem',
              borderLeft: `3px solid ${pillarConfig.color}`,
              background: `${pillarConfig.color}08`,
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              fontFamily: 'var(--font-display)',
              fontSize: '1.02rem',
              lineHeight: 1.65,
              color: 'var(--color-text)',
              fontStyle: 'italic',
            }}
          >
            {day.visualConcept}
          </blockquote>
        </section>

        {/* Caption */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-soft)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Caption
            </span>
            <CopyButton text={day.caption} label="Caption" />
          </div>
          <div
            style={{
              padding: '0.85rem 1rem',
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              color: 'var(--color-text)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {day.caption}
          </div>
        </section>

        {/* Hashtags */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-text-soft)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Hashtags
            </span>
            <CopyButton text={hashtagsText} label="All" />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {day.hashtags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-sky)',
                  background: 'rgba(90,171,238,0.08)',
                  border: '1px solid rgba(90,171,238,0.2)',
                  borderRadius: '999px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
