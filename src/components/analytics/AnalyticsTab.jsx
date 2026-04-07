import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useSnapshots } from '../../hooks/useSnapshots.js'
import { PILLARS } from '../shared/PillarBadge.jsx'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts'
import SnapshotForm from './SnapshotForm.jsx'

function fmtWeek(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return `${d.toLocaleDateString('en-GB', { day:'numeric', month:'short' })}`
}

function StatCard({ label, value, sub, color }) {
  return (
    <div style={{ padding:'1rem', background:'var(--color-surface)',
      border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)', flex:1, minWidth:120 }}>
      <div style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em',
        textTransform:'uppercase', color:'var(--color-text-soft)', fontFamily:'var(--font-body)',
        marginBottom:'0.4rem' }}>{label}</div>
      <div style={{ fontSize:'1.6rem', fontFamily:'var(--font-display)', fontWeight:600,
        color: color ?? 'var(--color-text)', lineHeight:1 }}>{value ?? '—'}</div>
      {sub && <div style={{ fontSize:'0.72rem', color:'var(--color-text-muted)',
        fontFamily:'var(--font-body)', marginTop:'0.25rem' }}>{sub}</div>}
    </div>
  )
}

const CHART_TOOLTIP = {
  contentStyle: { background:'#1c2030', border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:8, fontSize:'0.78rem', fontFamily:'var(--font-body)' },
  labelStyle: { color:'#8b8fa8' },
}

export default function AnalyticsTab() {
  const { snapshots, loading: snapLoading, fetchSnapshots, upsertSnapshot } = useSnapshots()
  const [pillarData, setPillarData] = useState([])
  const [showSnapshotForm, setShowSnapshotForm] = useState(false)
  const [totalPosted, setTotalPosted] = useState(0)
  const [avgEng, setAvgEng] = useState(null)

  useEffect(() => { fetchSnapshots(12) }, [fetchSnapshots])

  useEffect(() => {
    // Load posted posts for pillar performance
    supabase.from('posts').select('pillar,likes,saves,reach,comments,status')
      .eq('status', 'posted').then(({ data }) => {
        if (!data) return
        setTotalPosted(data.length)

        const byPillar = {}
        data.forEach((p) => {
          if (!byPillar[p.pillar]) byPillar[p.pillar] = { total: 0, count: 0 }
          if (p.reach) {
            const eng = ((p.likes ?? 0) + (p.saves ?? 0) + (p.comments ?? 0)) / p.reach * 100
            byPillar[p.pillar].total += eng
            byPillar[p.pillar].count += 1
          }
        })

        const rows = Object.entries(byPillar).map(([pillar, { total, count }]) => ({
          pillar,
          label: PILLARS[pillar]?.label ?? pillar,
          avgEng: count > 0 ? parseFloat((total / count).toFixed(2)) : 0,
          posts: data.filter((p) => p.pillar === pillar).length,
          color: PILLARS[pillar]?.color ?? '#8b8fa8',
        })).sort((a, b) => b.avgEng - a.avgEng)

        setPillarData(rows)

        // Overall avg engagement
        const allEngs = data.filter((p) => p.reach).map((p) =>
          ((p.likes ?? 0) + (p.saves ?? 0) + (p.comments ?? 0)) / p.reach * 100
        )
        if (allEngs.length) setAvgEng((allEngs.reduce((a, b) => a + b, 0) / allEngs.length).toFixed(1))
      })
  }, [])

  const latestSnap = snapshots[snapshots.length - 1]
  const prevSnap   = snapshots[snapshots.length - 2]

  const followerChange = latestSnap?.follower_count && prevSnap?.follower_count
    ? latestSnap.follower_count - prevSnap.follower_count
    : latestSnap?.follower_change ?? null

  const engChartData = snapshots.map((s) => ({
    week: fmtWeek(s.week_start_date),
    reach: s.total_reach,
    saves: s.total_saves,
    likes: s.total_likes,
    followers: s.follower_count,
  }))

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>

      {/* Summary cards */}
      <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
        <StatCard label="Followers" value={latestSnap?.follower_count?.toLocaleString()}
          sub={followerChange != null ? `${followerChange >= 0 ? '+' : ''}${followerChange} last week` : null}
          color={followerChange > 0 ? '#4eca8b' : followerChange < 0 ? '#e07b6e' : undefined} />
        <StatCard label="Avg Engagement" value={avgEng ? `${avgEng}%` : null}
          sub={`across ${totalPosted} posted`} color="#f0b429" />
        <StatCard label="Posts Published" value={totalPosted} sub="total posted" />
        <StatCard label="Reach (last wk)" value={latestSnap?.total_reach?.toLocaleString()} />
      </div>

      {/* Follower growth chart */}
      {engChartData.length > 1 && (
        <Section title="Follower Growth">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={engChartData}>
              <defs>
                <linearGradient id="follGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f0b429" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f0b429" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill:'#8b8fa8', fontSize:11 }} />
              <YAxis tick={{ fill:'#8b8fa8', fontSize:11 }} />
              <Tooltip {...CHART_TOOLTIP} />
              <Area type="monotone" dataKey="followers" stroke="#f0b429"
                strokeWidth={2} fill="url(#follGrad)" name="Followers" />
            </AreaChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Reach & saves chart */}
      {engChartData.length > 1 && (
        <Section title="Weekly Reach & Saves">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={engChartData}>
              <defs>
                <linearGradient id="reachGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5aabee" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#5aabee" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="savesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4eca8b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4eca8b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill:'#8b8fa8', fontSize:11 }} />
              <YAxis tick={{ fill:'#8b8fa8', fontSize:11 }} />
              <Tooltip {...CHART_TOOLTIP} />
              <Area type="monotone" dataKey="reach" stroke="#5aabee" strokeWidth={2}
                fill="url(#reachGrad)" name="Reach" />
              <Area type="monotone" dataKey="saves" stroke="#4eca8b" strokeWidth={2}
                fill="url(#savesGrad)" name="Saves" />
            </AreaChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Pillar performance */}
      {pillarData.length > 0 && (
        <Section title="Average Engagement Rate by Pillar">
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {pillarData.map((row) => (
              <div key={row.pillar} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                <span style={{ fontSize:'0.75rem', fontFamily:'var(--font-body)',
                  color:'var(--color-text-soft)', minWidth:160, flexShrink:0 }}>
                  {row.label}
                </span>
                <div style={{ flex:1, height:8, background:'var(--color-surface-3)', borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min(row.avgEng * 10, 100)}%`,
                    background:row.color, borderRadius:4, transition:'width 0.3s' }} />
                </div>
                <span style={{ fontSize:'0.75rem', fontFamily:'var(--font-body)',
                  color:row.color, minWidth:40, textAlign:'right', fontWeight:500 }}>
                  {row.avgEng}%
                </span>
                <span style={{ fontSize:'0.7rem', color:'var(--color-text-muted)',
                  fontFamily:'var(--font-body)', minWidth:50 }}>
                  {row.posts} posts
                </span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Weekly snapshot entry */}
      <Section title="Record Weekly Snapshot"
        action={<button onClick={() => setShowSnapshotForm(true)}
          style={{ padding:'0.28rem 0.7rem', fontSize:'0.72rem', fontFamily:'var(--font-body)',
            fontWeight:500, color:'var(--color-accent)', background:'var(--color-accent-dim)',
            border:'1px solid rgba(240,180,41,0.3)', borderRadius:'6px', cursor:'pointer', outline:'none' }}>
          + Add Snapshot
        </button>}>
        {snapshots.length === 0 ? (
          <p style={{ margin:0, color:'var(--color-text-muted)', fontSize:'0.84rem',
            fontFamily:'var(--font-body)' }}>
            No weekly snapshots yet. Add one to start tracking growth trends.
          </p>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.78rem',
              fontFamily:'var(--font-body)', color:'var(--color-text-soft)' }}>
              <thead>
                <tr>{['Week','Followers','±','Reach','Likes','Saves'].map((h) => (
                  <th key={h} style={{ padding:'0.35rem 0.5rem', textAlign:'left',
                    borderBottom:'1px solid var(--color-border)', color:'var(--color-text-muted)',
                    fontSize:'0.65rem', letterSpacing:'0.08em', textTransform:'uppercase' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {[...snapshots].reverse().map((s) => (
                  <tr key={s.id}>
                    <td style={{ padding:'0.4rem 0.5rem' }}>{fmtWeek(s.week_start_date)}</td>
                    <td style={{ padding:'0.4rem 0.5rem', color:'var(--color-text)' }}>{s.follower_count?.toLocaleString() ?? '—'}</td>
                    <td style={{ padding:'0.4rem 0.5rem', color: s.follower_change > 0 ? '#4eca8b' : s.follower_change < 0 ? '#e07b6e' : 'var(--color-text-muted)' }}>
                      {s.follower_change != null ? `${s.follower_change > 0 ? '+' : ''}${s.follower_change}` : '—'}
                    </td>
                    <td style={{ padding:'0.4rem 0.5rem' }}>{s.total_reach?.toLocaleString() ?? '—'}</td>
                    <td style={{ padding:'0.4rem 0.5rem' }}>{s.total_likes?.toLocaleString() ?? '—'}</td>
                    <td style={{ padding:'0.4rem 0.5rem' }}>{s.total_saves?.toLocaleString() ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      {showSnapshotForm && (
        <SnapshotForm onSave={async (snap) => { await upsertSnapshot(snap); setShowSnapshotForm(false) }}
          onClose={() => setShowSnapshotForm(false)} />
      )}
    </div>
  )
}

function Section({ title, action, children }) {
  return (
    <div style={{ background:'var(--color-surface)', border:'1px solid var(--color-border)',
      borderRadius:'var(--radius-lg)', overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0.75rem 1.1rem', borderBottom:'1px solid var(--color-border)',
        background:'var(--color-surface-2)' }}>
        <span style={{ fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.08em',
          textTransform:'uppercase', color:'var(--color-text-soft)', fontFamily:'var(--font-body)' }}>
          {title}
        </span>
        {action}
      </div>
      <div style={{ padding:'1rem 1.1rem' }}>{children}</div>
    </div>
  )
}
