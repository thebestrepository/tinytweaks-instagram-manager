import PillarBadge from './PillarBadge.jsx'
import PostTypeBadge from './PostTypeBadge.jsx'

const TODAY = new Date().toISOString().split('T')[0]

export default function WeekCalendar({ days, selectedDayNumber, onSelectDay }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        overflowX: 'auto',
        paddingBottom: '0.25rem',
      }}
    >
      {days.map((day) => {
        const isSelected = day.dayNumber === selectedDayNumber
        const isToday = day.date === TODAY

        return (
          <button
            key={day.dayNumber}
            onClick={() => onSelectDay(day.dayNumber)}
            aria-label={`Select ${day.dayName}`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.6rem 0.4rem',
              minWidth: '80px',
              background: isSelected ? 'var(--color-surface-2)' : 'var(--color-surface)',
              border: isSelected
                ? '1px solid var(--color-accent)'
                : isToday
                ? '1px solid rgba(240,180,41,0.3)'
                : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
              textAlign: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: isSelected ? 'var(--color-accent)' : 'var(--color-text-soft)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {day.dayName.slice(0, 3)}
            </span>
            <span
              style={{
                fontSize: '1.1rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                color: isSelected ? 'var(--color-text)' : 'var(--color-text-soft)',
                lineHeight: 1,
              }}
            >
              {day.date.split('-')[2]}
            </span>
            <PillarBadge pillar={day.pillar} />
          </button>
        )
      })}
    </div>
  )
}
