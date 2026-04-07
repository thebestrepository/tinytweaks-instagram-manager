import { useState } from 'react'
import Modal from '../shared/Modal.jsx'

const FIELDS = [
  { key:'likes',          label:'Likes',         icon:'❤️'  },
  { key:'saves',          label:'Saves',         icon:'🔖'  },
  { key:'reach',          label:'Reach',         icon:'👁'  },
  { key:'comments',       label:'Comments',      icon:'💬'  },
  { key:'follows_gained', label:'Follows gained',icon:'👤+' },
  { key:'shares',         label:'Shares / Sends',icon:'↗️'  },
]

export default function StatsModal({ post, onSave, onClose }) {
  const [form, setForm] = useState({
    likes:          post.likes          ?? '',
    saves:          post.saves          ?? '',
    reach:          post.reach          ?? '',
    comments:       post.comments       ?? '',
    follows_gained: post.follows_gained ?? '',
    shares:         post.shares         ?? '',
    notes:          post.notes          ?? '',
    status:         post.status         ?? 'planned',
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    const updates = { notes: form.notes || null, status: form.status }
    FIELDS.forEach(({ key }) => {
      updates[key] = form[key] !== '' ? Number(form[key]) : null
    })
    if (form.status === 'posted' && !post.posted_at) {
      updates.posted_at = new Date().toISOString()
    }
    await onSave(post.id, updates)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title={`Stats — ${post.date}`} onClose={onClose}>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

        {/* Status */}
        <div>
          <FieldLabel>Status</FieldLabel>
          <div style={{ display:'flex', gap:'0.4rem', marginTop:'0.3rem' }}>
            {['planned','posted','skipped'].map((s) => (
              <button key={s} onClick={() => setForm((f) => ({ ...f, status: s }))}
                style={{ flex:1, padding:'0.35rem', fontSize:'0.75rem', fontFamily:'var(--font-body)',
                  fontWeight:500, textTransform:'capitalize',
                  color: form.status === s ? 'var(--color-text)' : 'var(--color-text-muted)',
                  background: form.status === s ? 'var(--color-surface-3)' : 'transparent',
                  border:`1px solid ${form.status === s ? 'var(--color-border-mid)' : 'var(--color-border)'}`,
                  borderRadius:'6px', cursor:'pointer', outline:'none' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
          {FIELDS.map(({ key, label, icon }) => (
            <div key={key}>
              <FieldLabel>{icon} {label}</FieldLabel>
              <input type="number" min="0" value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder="—"
                style={{ width:'100%', marginTop:'0.25rem', padding:'0.4rem 0.6rem',
                  background:'var(--color-surface-2)', border:'1px solid var(--color-border)',
                  borderRadius:'6px', color:'var(--color-text)', fontSize:'0.88rem',
                  fontFamily:'var(--font-body)', outline:'none', boxSizing:'border-box' }} />
            </div>
          ))}
        </div>

        {/* Notes */}
        <div>
          <FieldLabel>Notes</FieldLabel>
          <textarea value={form.notes} rows={2}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            placeholder="Any observations about this post…"
            style={{ width:'100%', marginTop:'0.25rem', padding:'0.4rem 0.6rem',
              background:'var(--color-surface-2)', border:'1px solid var(--color-border)',
              borderRadius:'6px', color:'var(--color-text)', fontSize:'0.85rem',
              fontFamily:'var(--font-body)', outline:'none', resize:'vertical', boxSizing:'border-box' }} />
        </div>

        {/* Engagement preview */}
        {form.reach && form.likes && (
          <div style={{ padding:'0.5rem 0.75rem', background:'rgba(78,202,139,0.06)',
            border:'1px solid rgba(78,202,139,0.2)', borderRadius:'6px',
            fontSize:'0.78rem', color:'#4eca8b', fontFamily:'var(--font-body)' }}>
            Engagement rate: {(((Number(form.likes) + Number(form.saves || 0) + Number(form.comments || 0)) / Number(form.reach)) * 100).toFixed(1)}%
          </div>
        )}

        <button onClick={handleSave} disabled={saving}
          style={{ padding:'0.55rem', background:'var(--color-accent-dim)',
            border:'1px solid rgba(240,180,41,0.4)', borderRadius:'var(--radius-md)',
            color:'var(--color-accent)', fontSize:'0.88rem', fontFamily:'var(--font-body)',
            fontWeight:500, cursor: saving ? 'not-allowed' : 'pointer', outline:'none' }}>
          {saving ? 'Saving…' : 'Save Stats'}
        </button>
      </div>
    </Modal>
  )
}

function FieldLabel({ children }) {
  return (
    <span style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.08em',
      textTransform:'uppercase', color:'var(--color-text-soft)', fontFamily:'var(--font-body)' }}>
      {children}
    </span>
  )
}
