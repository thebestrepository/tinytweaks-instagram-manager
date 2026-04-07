import { useState } from 'react'
import Modal from '../shared/Modal.jsx'

function getMondayOf(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const dow = d.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

const FIELDS = [
  { key:'follower_count',    label:'Follower Count',    hint:'Your current total followers' },
  { key:'follower_change',   label:'Followers Gained',  hint:'Net change this week (can be negative)' },
  { key:'total_reach',       label:'Total Reach',       hint:'Sum of reach across all posts this week' },
  { key:'total_likes',       label:'Total Likes',       hint:'' },
  { key:'total_saves',       label:'Total Saves',       hint:'' },
  { key:'total_comments',    label:'Total Comments',    hint:'' },
  { key:'total_shares',      label:'Total Shares',      hint:'' },
  { key:'posts_published',   label:'Posts Published',   hint:'How many posts went live this week' },
  { key:'profile_visits',    label:'Profile Visits',    hint:'' },
  { key:'website_clicks',    label:'Website Clicks',    hint:'Link in bio clicks' },
]

export default function SnapshotForm({ onSave, onClose }) {
  const [weekStart, setWeekStart] = useState(getMondayOf(new Date().toISOString().split('T')[0]))
  const [form, setForm] = useState({})
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const snap = { week_start_date: weekStart, notes: notes || null }
    FIELDS.forEach(({ key }) => {
      snap[key] = form[key] !== undefined && form[key] !== '' ? Number(form[key]) : null
    })
    await onSave(snap)
    setSaving(false)
  }

  return (
    <Modal title="Add Weekly Snapshot" onClose={onClose} width="480px">
      <div style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>
        <div>
          <Label>Week starting (Monday)</Label>
          <input type="date" value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            style={inputStyle} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
          {FIELDS.map(({ key, label, hint }) => (
            <div key={key}>
              <Label>{label}</Label>
              {hint && <span style={{ display:'block', fontSize:'0.65rem',
                color:'var(--color-text-muted)', fontFamily:'var(--font-body)',
                marginBottom:'0.15rem' }}>{hint}</span>}
              <input type="number" min="0" placeholder="—"
                value={form[key] ?? ''}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                style={inputStyle} />
            </div>
          ))}
        </div>
        <div>
          <Label>Notes</Label>
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="Any noteworthy events this week…"
            style={{ ...inputStyle, resize:'vertical' }} />
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ padding:'0.55rem', background:'var(--color-accent-dim)',
            border:'1px solid rgba(240,180,41,0.4)', borderRadius:'var(--radius-md)',
            color:'var(--color-accent)', fontSize:'0.88rem', fontFamily:'var(--font-body)',
            fontWeight:500, cursor: saving ? 'not-allowed' : 'pointer', outline:'none' }}>
          {saving ? 'Saving…' : 'Save Snapshot'}
        </button>
      </div>
    </Modal>
  )
}

function Label({ children }) {
  return (
    <span style={{ display:'block', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em',
      textTransform:'uppercase', color:'var(--color-text-soft)', fontFamily:'var(--font-body)',
      marginBottom:'0.25rem' }}>
      {children}
    </span>
  )
}

const inputStyle = {
  width:'100%', padding:'0.4rem 0.6rem', background:'var(--color-surface-2)',
  border:'1px solid var(--color-border)', borderRadius:'6px', color:'var(--color-text)',
  fontSize:'0.88rem', fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box',
}
