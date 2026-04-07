import DayCell from './DayCell.jsx'

const DAY_NAMES = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

function getMondayOf(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const dow = d.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function fmt(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-GB', { day:'numeric', month:'short' })
}

export default function FourWeekGrid({ postsByDate, selectedDate, onSelectDate, onGenerateWeek, generatingWeek }) {
  const today = new Date().toISOString().split('T')[0]
  const startMonday = getMondayOf(today)

  const weeks = Array.from({ length: 4 }, (_, wi) => {
    const monday = addDays(startMonday, wi * 7)
    const days = DAY_NAMES.map((name, di) => ({
      date: addDays(monday, di),
      dayName: name,
    }))
    return { monday, days }
  })

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
      {weeks.map(({ monday, days }) => {
        const sunday = addDays(monday, 6)
        const weekPosts = days.filter((d) => postsByDate[d.date])
        const allGenerated = weekPosts.length === 7
        const isGenerating = generatingWeek === monday

        return (
          <div key={monday} style={{ background:'var(--color-surface)',
            border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)', overflow:'hidden' }}>

            {/* Week header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'0.5rem 0.75rem', borderBottom:'1px solid var(--color-border)',
              background:'var(--color-surface-2)' }}>
              <span style={{ fontSize:'0.75rem', fontFamily:'var(--font-body)',
                color:'var(--color-text-soft)', fontWeight:500 }}>
                {fmt(monday)} — {fmt(sunday)}
                <span style={{ marginLeft:'0.5rem', color:'var(--color-text-muted)' }}>
                  ({weekPosts.length}/7 planned)
                </span>
              </span>
              <button onClick={() => onGenerateWeek(monday)} disabled={isGenerating}
                style={{ padding:'0.25rem 0.65rem', fontSize:'0.7rem', fontFamily:'var(--font-body)',
                  fontWeight:500, color: isGenerating ? 'var(--color-text-muted)' : 'var(--color-accent)',
                  background: isGenerating ? 'transparent' : 'var(--color-accent-dim)',
                  border:`1px solid ${isGenerating ? 'var(--color-border)' : 'rgba(240,180,41,0.3)'}`,
                  borderRadius:'6px', cursor: isGenerating ? 'not-allowed' : 'pointer', outline:'none' }}>
                {isGenerating ? 'Generating…' : allGenerated ? '↻ Regenerate' : '+ Generate week'}
              </button>
            </div>

            {/* Day cells */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'0.4rem', padding:'0.5rem' }}>
              {days.map(({ date, dayName }) => (
                <DayCell key={date} date={date} dayName={dayName}
                  post={postsByDate[date] ?? null}
                  isSelected={selectedDate === date}
                  onClick={() => onSelectDate(date)} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
