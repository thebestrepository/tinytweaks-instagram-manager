import { useState } from 'react'

const TYPE_CONFIG = {
  follower_count:  { icon: '👥', color: '#f0b429' },
  posts_per_week:  { icon: '📅', color: '#5aabee' },
  engagement_rate: { icon: '📈', color: '#4eca8b' },
  community:       { icon: '🌱', color: '#7db88a' },
  custom:          { icon: '🎯', color: '#b89fd4' },
}

function fmtDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })
}

export default function GoalCard({ goal, onEdit, onDelete, onUpdateValue }) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const tc = TYPE_CONFIG[goal.type] ?? TYPE_CONFIG.custom

  const pct = goal.target_value
    ? Math.min((Number(goal.current_value ?? 0) / Number(goal.target_value)) * 100, 100)
    : null

  const handleValueSave = async () => {
    if (inputVal === '') return
    await onUpdateValue(Number(inputVal))
    setEditing(false)
    setInputVal('')
  }

  return (
    <div style={{ padding:'1.1rem 1.25rem', background:'var(--color-surface)',
      border:'1px solid var(--color-border)', borderRadius:'var(--radius-lg)' }}>

      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'0.75rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flex:1, minWidth:0 }}>
          <span style={{ fontSize:'1.2rem' }}>{tc.icon}</span>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:'0.5rem', flexWrap:'wrap' }}>
              <span style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', fontWeight:600 }}>
                {goal.label}
              </span>
              {goal.deadline && (
                <span style={{ fontSize:'0.7rem', color:'var(--color-text-muted)',
                  fontFamily:'var(--font-body)' }}>
                  by {fmtDate(goal.deadline)}
                </span>
              )}
            </div>
            {goal.description && (
              <p style={{ margin:'0.15rem 0 0', fontSize:'0.82rem', color:'var(--color-text-soft)',
                fontFamily:'var(--font-body)', lineHeight:1.5 }}>{goal.description}</p>
            )}
          </div>
        </div>

        <div style={{ display:'flex', gap:'0.4rem', flexShrink:0 }}>
          <button onClick={onEdit}
            style={{ fontSize:'0.7rem', color:'var(--color-text-muted)', background:'none',
              border:'none', cursor:'pointer', padding:'0.1rem 0.3rem', fontFamily:'var(--font-body)' }}>
            Edit
          </button>
          <button onClick={onDelete}
            style={{ fontSize:'0.7rem', color:'#e07b6e', background:'none',
              border:'none', cursor:'pointer', padding:'0.1rem 0.3rem', fontFamily:'var(--font-body)' }}>
            Remove
          </button>
        </div>
      </div>

      {/* Progress */}
      {goal.target_value && (
        <div style={{ marginTop:'0.9rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            marginBottom:'0.35rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
              {editing ? (
                <div style={{ display:'flex', gap:'0.3rem' }}>
                  <input type="number" value={inputVal} autoFocus
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleValueSave(); if (e.key === 'Escape') setEditing(false) }}
                    placeholder={String(goal.current_value ?? 0)}
                    style={{ width:90, padding:'0.2rem 0.4rem', background:'var(--color-surface-2)',
                      border:'1px solid var(--color-border-mid)', borderRadius:4, color:'var(--color-text)',
                      fontSize:'0.82rem', fontFamily:'var(--font-body)', outline:'none' }} />
                  <button onClick={handleValueSave}
                    style={{ fontSize:'0.7rem', color:'#4eca8b', background:'none',
                      border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>✓</button>
                  <button onClick={() => setEditing(false)}
                    style={{ fontSize:'0.7rem', color:'var(--color-text-muted)', background:'none',
                      border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>×</button>
                </div>
              ) : (
                <button onClick={() => setEditing(true)}
                  style={{ fontFamily:'var(--font-body)', fontSize:'0.88rem', fontWeight:600,
                    color:tc.color, background:'none', border:'none', cursor:'pointer',
                    padding:0 }}>
                  {Number(goal.current_value ?? 0).toLocaleString()} {goal.unit}
                </button>
              )}
              <span style={{ fontSize:'0.8rem', color:'var(--color-text-muted)',
                fontFamily:'var(--font-body)' }}>
                / {Number(goal.target_value).toLocaleString()} {goal.unit}
              </span>
            </div>
            <span style={{ fontSize:'0.88rem', fontWeight:600, color:tc.color,
              fontFamily:'var(--font-body)' }}>
              {pct?.toFixed(0)}%
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height:6, background:'var(--color-surface-3)', borderRadius:999, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:tc.color,
              borderRadius:999, transition:'width 0.4s ease' }} />
          </div>
        </div>
      )}
    </div>
  )
}
