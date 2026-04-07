import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useGoals } from '../../hooks/useGoals.js'
import { n8nService } from '../../services/N8nService.js'
import { PILLARS } from '../shared/PillarBadge.jsx'
import CopyButton from '../shared/CopyButton.jsx'

// ─── Shared helpers ────────────────────────────────────────────────────────────
function Section({ title, subtitle, children }) {
  return (
    <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)',
      borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
      <div style={{ padding:'0.85rem 1.25rem', borderBottom:'1px solid var(--color-border)',
        background:'var(--color-surface-2)' }}>
        <div style={{ fontSize:'0.88rem', fontFamily:'var(--font-display)', fontWeight:600,
          color:'var(--color-text)' }}>{title}</div>
        {subtitle && <div style={{ fontSize:'0.75rem', color:'var(--color-text-soft)',
          fontFamily:'var(--font-body)', marginTop:'0.15rem' }}>{subtitle}</div>}
      </div>
      <div style={{ padding:'1.1rem 1.25rem' }}>{children}</div>
    </div>
  )
}

function ResultBox({ label, content, mono }) {
  if (!content) return null
  return (
    <div style={{ marginTop:'0.75rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
        marginBottom:'0.35rem' }}>
        <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em',
          textTransform:'uppercase', color:'var(--color-text-soft)', fontFamily:'var(--font-body)' }}>
          {label}
        </span>
        <CopyButton text={typeof content === 'string' ? content : JSON.stringify(content, null, 2)} label={label} />
      </div>
      <div style={{ padding:'0.75rem 1rem', background:'var(--color-surface-2)',
        border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)',
        fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
        fontSize:'0.86rem', lineHeight:1.7, color:'var(--color-text)', whiteSpace:'pre-wrap' }}>
        {typeof content === 'string' ? content : JSON.stringify(content, null, 2)}
      </div>
    </div>
  )
}

function RunButton({ onClick, loading, label }) {
  return (
    <button onClick={onClick} disabled={loading}
      style={{ padding:'0.45rem 1rem', fontSize:'0.8rem', fontFamily:'var(--font-body)',
        fontWeight:500, color: loading ? 'var(--color-text-muted)' : 'var(--color-accent)',
        background: loading ? 'transparent' : 'var(--color-accent-dim)',
        border:`1px solid ${loading ? 'var(--color-border)' : 'rgba(240,180,41,0.35)'}`,
        borderRadius:'6px', cursor: loading ? 'not-allowed' : 'pointer', outline:'none' }}>
      {loading ? 'Running…' : label}
    </button>
  )
}

const selectStyle = {
  padding:'0.4rem 0.6rem', background:'var(--color-surface-2)',
  border:'1px solid var(--color-border)', borderRadius:'6px', color:'var(--color-text)',
  fontSize:'0.85rem', fontFamily:'var(--font-body)', outline:'none',
}

const textareaStyle = {
  width:'100%', padding:'0.5rem 0.75rem', background:'var(--color-surface-2)',
  border:'1px solid var(--color-border)', borderRadius:'6px', color:'var(--color-text)',
  fontSize:'0.86rem', fontFamily:'var(--font-body)', outline:'none', resize:'vertical',
  boxSizing:'border-box', lineHeight:1.65,
}

// ─── Caption Optimizer ─────────────────────────────────────────────────────────
function CaptionOptimizer() {
  const [idea, setIdea] = useState('')
  const [pillar, setPillar] = useState('morning-anchor')
  const [postType, setPostType] = useState('Feed Post')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const run = async () => {
    if (!idea.trim()) return
    setLoading(true)
    setError(null)
    try {
      const data = await n8nService.optimizeCaption({ idea: idea.trim(), pillar, postType })
      setResult(data)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <Section title="Caption Optimizer"
      subtitle="Give a rough idea or draft — get a polished on-brand caption with hashtags.">
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem', flex:1, minWidth:160 }}>
            <Label>Content Pillar</Label>
            <select value={pillar} onChange={(e) => setPillar(e.target.value)} style={selectStyle}>
              {Object.entries(PILLARS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem', minWidth:130 }}>
            <Label>Post Type</Label>
            <select value={postType} onChange={(e) => setPostType(e.target.value)} style={selectStyle}>
              {['Feed Post','Reel','Story'].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div>
          <Label>Your idea or rough draft</Label>
          <textarea rows={3} value={idea} onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g. 'something about making your bed first thing and how it sets the tone for the day'"
            style={{ ...textareaStyle, marginTop:'0.25rem' }} />
        </div>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <RunButton onClick={run} loading={loading} label="✦ Optimize Caption →" />
        {result && (
          <>
            <ResultBox label="Polished Caption" content={result.caption} />
            {result.alternativeCaption && <ResultBox label="Alternative" content={result.alternativeCaption} />}
            {result.hashtags && <ResultBox label="Hashtags" content={Array.isArray(result.hashtags) ? result.hashtags.join(' ') : result.hashtags} />}
            {result.reasoning && <ResultBox label="Reasoning" content={result.reasoning} />}
          </>
        )}
      </div>
    </Section>
  )
}

// ─── Weekly Review ─────────────────────────────────────────────────────────────
function WeeklyReview() {
  const [weeks, setWeeks] = useState([])
  const [selectedWeek, setSelectedWeek] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.from('posts').select('week_label,week_start_date')
      .not('week_start_date', 'is', null).order('week_start_date', { ascending: false })
      .then(({ data }) => {
        const seen = new Set()
        const uniq = (data ?? []).filter((r) => {
          if (seen.has(r.week_start_date)) return false
          seen.add(r.week_start_date)
          return true
        })
        setWeeks(uniq)
        if (uniq.length) setSelectedWeek(uniq[0].week_start_date)
      })
  }, [])

  const run = async () => {
    if (!selectedWeek) return
    setLoading(true)
    setError(null)
    try {
      const { data: posts } = await supabase.from('posts').select('*')
        .eq('week_start_date', selectedWeek)
      const weekLabel = weeks.find((w) => w.week_start_date === selectedWeek)?.week_label ?? selectedWeek
      const data = await n8nService.weeklyReview({ weekLabel, posts: posts ?? [] })
      setResult(data)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <Section title="Weekly Review"
      subtitle="AI analysis of a past week — what performed, what didn't, and what to do next.">
      <div style={{ display:'flex', gap:'0.6rem', alignItems:'flex-end', flexWrap:'wrap' }}>
        <div>
          <Label>Select Week</Label>
          <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}
            style={{ ...selectStyle, marginTop:'0.25rem' }}>
            {weeks.map((w) => (
              <option key={w.week_start_date} value={w.week_start_date}>
                {w.week_label ?? w.week_start_date}
              </option>
            ))}
          </select>
        </div>
        <RunButton onClick={run} loading={loading} label="✦ Generate Review →" />
      </div>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {result && (
        <>
          {result.insights && <ResultBox label="Insights" content={result.insights} />}
          {result.topPerformer && (
            <ResultBox label="Top Performer" content={`${result.topPerformer.date} — ${result.topPerformer.pillar}\n${result.topPerformer.reason}`} />
          )}
          {result.recommendations?.length > 0 && (
            <ResultBox label="Recommendations" content={result.recommendations.join('\n• ').replace(/^/, '• ')} />
          )}
          {result.nextWeekFocus && <ResultBox label="Next Week Focus" content={result.nextWeekFocus} />}
        </>
      )}
    </Section>
  )
}

// ─── Content Audit ─────────────────────────────────────────────────────────────
function ContentAudit() {
  const { goals, fetchGoals } = useGoals()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => { fetchGoals() }, [fetchGoals])

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: posts } = await supabase.from('posts').select('*')
        .order('date', { ascending: false }).limit(28)
      const data = await n8nService.contentAudit({
        posts: posts ?? [],
        goals: goals.map((g) => `${g.label}: ${g.current_value}/${g.target_value} ${g.unit ?? ''}`),
      })
      setResult(data)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <Section title="Content Audit (4 weeks)"
      subtitle="Analyse pillar balance, topic diversity, and strategic gaps across recent content.">
      <RunButton onClick={run} loading={loading} label="✦ Run Audit →" />
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {result && (
        <>
          {result.summary && <ResultBox label="Summary" content={result.summary} />}
          {result.strengths?.length > 0 && (
            <ResultBox label="Strengths" content={result.strengths.join('\n✓ ').replace(/^/, '✓ ')} />
          )}
          {result.gaps?.length > 0 && (
            <ResultBox label="Gaps to Address" content={result.gaps.join('\n⚠ ').replace(/^/, '⚠ ')} />
          )}
          {result.recommendations?.length > 0 && (
            <ResultBox label="Recommendations" content={result.recommendations.join('\n• ').replace(/^/, '• ')} />
          )}
        </>
      )}
    </Section>
  )
}

// ─── Community Strategy ────────────────────────────────────────────────────────
function CommunityStrategy() {
  const { goals, fetchGoals } = useGoals()
  const [followers, setFollowers] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchGoals()
    // Pre-fill from follower_count goal
  }, [fetchGoals])

  useEffect(() => {
    const g = goals.find((g) => g.type === 'follower_count')
    if (g?.current_value && !followers) setFollowers(String(g.current_value))
  }, [goals])

  const run = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: posts } = await supabase.from('posts').select('pillar,likes,saves,reach,comments')
        .eq('status','posted').limit(28)
      const pillarCounts = {}
      posts?.forEach((p) => { pillarCounts[p.pillar] = (pillarCounts[p.pillar] ?? 0) + 1 })
      const topPillars = Object.entries(pillarCounts).sort((a,b) => b[1]-a[1]).slice(0,3).map(([k]) => k)

      let avgEng = null
      const engPosts = (posts ?? []).filter((p) => p.reach)
      if (engPosts.length) {
        avgEng = (engPosts.reduce((sum, p) =>
          sum + ((p.likes ?? 0) + (p.saves ?? 0) + (p.comments ?? 0)) / p.reach * 100, 0
        ) / engPosts.length).toFixed(1)
      }

      const data = await n8nService.communityStrategy({
        currentFollowers: followers ? Number(followers) : null,
        goals: goals.map((g) => ({ label: g.label, type: g.type, target: g.target_value, current: g.current_value, unit: g.unit })),
        topPillars,
        recentEngagementRate: avgEng,
      })
      setResult(data)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <Section title="30-Day Community Strategy"
      subtitle="A GPT-4o plan for growing your audience and converting them to app users.">
      <div style={{ display:'flex', gap:'0.6rem', alignItems:'flex-end', flexWrap:'wrap', marginBottom:'0.75rem' }}>
        <div>
          <Label>Current Followers</Label>
          <input type="number" value={followers} onChange={(e) => setFollowers(e.target.value)}
            placeholder="e.g. 245" style={{ ...selectStyle, marginTop:'0.25rem', width:130 }} />
        </div>
        <RunButton onClick={run} loading={loading} label="✦ Generate Strategy →" />
      </div>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {result && (
        <>
          {result.strategyOverview && <ResultBox label="Strategy Overview" content={result.strategyOverview} />}
          {result.weeklyFocus?.map((wk, i) => (
            <ResultBox key={i} label={`Week ${wk.week} — ${wk.theme}`}
              content={Array.isArray(wk.tactics) ? wk.tactics.join('\n• ').replace(/^/, '• ') : wk.tactics} />
          ))}
          {result.ctaStrategy && <ResultBox label="CTA Strategy (App Promotion)" content={result.ctaStrategy} />}
        </>
      )}
    </Section>
  )
}

// ─── Main Tab ──────────────────────────────────────────────────────────────────
export default function AiToolsTab() {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      <CaptionOptimizer />
      <WeeklyReview />
      <ContentAudit />
      <CommunityStrategy />
    </div>
  )
}

function Label({ children }) {
  return (
    <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em',
      textTransform:'uppercase', color:'var(--color-text-soft)', fontFamily:'var(--font-body)' }}>
      {children}
    </span>
  )
}

function ErrorMsg({ children }) {
  return (
    <div style={{ padding:'0.5rem 0.75rem', background:'rgba(224,123,110,0.08)',
      border:'1px solid rgba(224,123,110,0.2)', borderRadius:'6px',
      fontSize:'0.8rem', color:'#e07b6e', fontFamily:'var(--font-body)', marginTop:'0.5rem' }}>
      ⚠ {children}
    </div>
  )
}
