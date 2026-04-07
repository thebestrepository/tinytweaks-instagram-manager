import { useState, useEffect, useCallback } from 'react'
import instagramPlanService from '../services/InstagramPlanService.js'
import fallbackPlan from '../data/fallbackPlan.js'
import WeekCalendar from './WeekCalendar.jsx'
import DayBrief from './DayBrief.jsx'
import LoadingState from './LoadingState.jsx'

const TODAY = new Date().toISOString().split('T')[0]

function getTodayDayNumber(days) {
  const idx = days.findIndex((d) => d.date === TODAY)
  return idx !== -1 ? days[idx].dayNumber : 1
}

export default function PlannerPage() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [usingFallback, setUsingFallback] = useState(false)
  const [selectedDay, setSelectedDay] = useState(1)

  const loadPlan = useCallback(async () => {
    setLoading(true)
    setUsingFallback(false)
    try {
      const data = await instagramPlanService.fetchWeeklyPlan()
      if (!data?.weeklyPlan?.length) throw new Error('Empty plan returned')
      setPlan(data)
      setSelectedDay(getTodayDayNumber(data.weeklyPlan))
    } catch {
      setPlan(fallbackPlan)
      setUsingFallback(true)
      setSelectedDay(1)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPlan()
  }, [loadPlan])

  const selectedDayData = plan?.weeklyPlan?.find((d) => d.dayNumber === selectedDay)

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        padding: '0 0 3rem',
      }}
    >
      {/* Top bar */}
      <header
        style={{
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-surface)',
          padding: '0.9rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 600,
              color: 'var(--color-text)',
            }}
          >
            TinyTweaks
          </span>
          <span
            style={{
              fontSize: '0.75rem',
              color: 'var(--color-text-soft)',
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.04em',
            }}
          >
            · Instagram Planner
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {plan && !loading && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-soft)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {plan.weekLabel}
            </span>
          )}
          <button
            onClick={loadPlan}
            disabled={loading}
            style={{
              padding: '0.4rem 0.9rem',
              fontSize: '0.78rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              color: loading ? 'var(--color-text-muted)' : 'var(--color-accent)',
              background: loading ? 'transparent' : 'var(--color-accent-dim)',
              border: `1px solid ${loading ? 'var(--color-border)' : 'rgba(240,180,41,0.3)'}`,
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              outline: 'none',
            }}
          >
            {loading ? 'Generating…' : '↻ Regenerate'}
          </button>
        </div>
      </header>

      {/* Fallback banner */}
      {usingFallback && (
        <div
          style={{
            background: 'rgba(224,123,110,0.08)',
            borderBottom: '1px solid rgba(224,123,110,0.2)',
            padding: '0.55rem 1.5rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-body)',
            color: '#e07b6e',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>⚠</span>
          Showing sample plan — live generation unavailable. Click Regenerate to try again.
        </div>
      )}

      {/* Main content */}
      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: '1.5rem 1.5rem 0' }}>
        {loading ? (
          <LoadingState />
        ) : (
          <>
            <WeekCalendar
              days={plan.weeklyPlan}
              selectedDayNumber={selectedDay}
              onSelectDay={setSelectedDay}
            />
            {selectedDayData && <DayBrief day={selectedDayData} />}
          </>
        )}
      </main>
    </div>
  )
}
