import { useState } from 'react'
import Modal from '../shared/Modal.jsx'

const TYPES = [
  { value:'follower_count',  label:'Follower Milestone' },
  { value:'posts_per_week',  label:'Posting Consistency' },
  { value:'engagement_rate', label:'Engagement Rate' },
  { value:'community',       label:'Community / Sales' },
  { value:'custom',          label:'Custom Goal' },
]

const UNIT_HINTS = {
  follower_count:  'followers',
  posts_per_week:  'posts/week',
  engagement_rate: '%',
  community:       '',
  custom:          '',
}

export default function GoalForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    type:          initial?.type          ?? 'follower_count',
    label:         initial?.label         ?? '',
    description:   initial?.description   ?? '',
    target_value:  initial?.target_value  ?? '',
    current_value: initial?.current_value ?? 0,
    unit:          initial?.unit          ?? UNIT_HINTS[initial?.type ?? 'follower_count'],
    deadline:      initial?.deadline      ?? '',
  })
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }))

  const handleSave = async () => {
    if (!form.label.trim()) return
    setSaving(true)
    await onSave({
      type:          form.type,
      label:         form.label.trim(),
      description:   form.description.trim() || null,
      target_value:  form.target_value !== '' ? Number(form.target_value) : null,
      current_value: Number(form.current_value ?? 0),
      unit:          form.unit || null,
      deadline:      form.deadline || null,
    })
    setSaving(false)
  }

  return (
    <Modal title={initial ? 'Edit Goal' : 'Add Goal'} onClose={onClose} width="460px">
      <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>

        <div>
          <Label>Goal Type</Label>
          <select value={form.type} onChange={(e) => { set('type', e.target.value); set('unit', UNIT_HINTS[e.target.value] ?? '') }}
            style={inputStyle}>
            {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <Label>Goal Label *</Label>
          <input value={form.label} onChange={(e) => set('label', e.target.value)}
            placeholder="e.g. Reach 1000 followers" style={inputStyle} />
        </div>

        <div>
          <Label>Description</Label>
          <textarea rows={2} value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Why this goal matters…"
            style={{ ...inputStyle, resize:'vertical' }} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.6rem' }}>
          <div>
            <Label>Current Value</Label>
            <input type="number" value={form.current_value}
              onChange={(e) => set('current_value', e.target.value)}
              style={inputStyle} />
          </div>
          <div>
            <Label>Target Value</Label>
            <input type="number" value={form.target_value}
              onChange={(e) => set('target_value', e.target.value)}
              placeholder="—" style={inputStyle} />
          </div>
          <div>
            <Label>Unit</Label>
            <input value={form.unit} onChange={(e) => set('unit', e.target.value)}
              placeholder="e.g. followers" style={inputStyle} />
          </div>
        </div>

        <div>
          <Label>Deadline</Label>
          <input type="date" value={form.deadline} onChange={(e) => set('deadline', e.target.value)}
            style={inputStyle} />
        </div>

        <button onClick={handleSave} disabled={saving || !form.label.trim()}
          style={{ padding:'0.55rem', background:'var(--color-accent-dim)',
            border:'1px solid rgba(240,180,41,0.4)', borderRadius:'var(--radius-md)',
            color:'var(--color-accent)', fontSize:'0.88rem', fontFamily:'var(--font-body)',
            fontWeight:500, cursor: saving ? 'not-allowed' : 'pointer', outline:'none' }}>
          {saving ? 'Saving…' : initial ? 'Update Goal' : 'Add Goal'}
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
