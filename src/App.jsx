import { useState } from 'react'
import PlannerTab  from './components/planner/PlannerTab.jsx'
import HistoryTab  from './components/history/HistoryTab.jsx'
import AnalyticsTab from './components/analytics/AnalyticsTab.jsx'
import GoalsTab    from './components/goals/GoalsTab.jsx'
import AiToolsTab  from './components/aitools/AiToolsTab.jsx'

const TABS = [
  { id:'planner',   label:'Planner'   },
  { id:'history',   label:'History'   },
  { id:'analytics', label:'Analytics' },
  { id:'goals',     label:'Goals'     },
  { id:'ai',        label:'AI Tools'  },
]

export default function App() {
  const [tab, setTab] = useState('planner')

  return (
    <div style={{ minHeight:'100vh', background:'var(--color-bg)', display:'flex', flexDirection:'column' }}>

      {/* Header */}
      <header style={{ borderBottom:'1px solid var(--color-border)',
        background:'var(--color-surface)', padding:'0.75rem 1.5rem',
        display:'flex', alignItems:'center', gap:'0.5rem', flexShrink:0 }}>
        <span style={{ fontFamily:'var(--font-display)', fontSize:'1.3rem', fontWeight:600,
          color:'var(--color-text)' }}>TinyTweaks</span>
        <span style={{ fontSize:'0.72rem', color:'var(--color-text-soft)',
          fontFamily:'var(--font-body)', letterSpacing:'0.04em' }}>
          · Instagram Manager
        </span>
      </header>

      {/* Tab nav */}
      <nav style={{ borderBottom:'1px solid var(--color-border)',
        background:'var(--color-surface-2)', padding:'0 1.5rem',
        display:'flex', gap:0, flexShrink:0, overflowX:'auto' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:'0.65rem 1rem', fontSize:'0.8rem', fontFamily:'var(--font-body)',
              fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? 'var(--color-accent)' : 'var(--color-text-soft)',
              background:'none', border:'none',
              borderBottom: tab === t.id ? '2px solid var(--color-accent)' : '2px solid transparent',
              cursor:'pointer', outline:'none', whiteSpace:'nowrap',
              transition:'color 0.12s, border-color 0.12s' }}>
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ flex:1, maxWidth:1100, width:'100%', margin:'0 auto',
        padding:'1.5rem 1.5rem 3rem', boxSizing:'border-box' }}>
        {tab === 'planner'   && <PlannerTab />}
        {tab === 'history'   && <HistoryTab />}
        {tab === 'analytics' && <AnalyticsTab />}
        {tab === 'goals'     && <GoalsTab />}
        {tab === 'ai'        && <AiToolsTab />}
      </main>
    </div>
  )
}
