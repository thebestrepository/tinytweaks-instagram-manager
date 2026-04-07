import { useState, useEffect } from 'react'
import { useGoals } from '../../hooks/useGoals.js'
import GoalCard from './GoalCard.jsx'
import GoalForm from './GoalForm.jsx'

export default function GoalsTab() {
  const { goals, loading, fetchGoals, createGoal, updateGoal, deleteGoal } = useGoals()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => { fetchGoals() }, [fetchGoals])

  const handleSave = async (goal) => {
    if (editing) {
      await updateGoal(editing.id, goal)
      setEditing(null)
    } else {
      await createGoal(goal)
      setShowForm(false)
    }
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1rem' }}>
        <button onClick={() => setShowForm(true)}
          style={{ padding:'0.4rem 0.9rem', fontSize:'0.78rem', fontFamily:'var(--font-body)',
            fontWeight:500, color:'var(--color-accent)', background:'var(--color-accent-dim)',
            border:'1px solid rgba(240,180,41,0.3)', borderRadius:'6px',
            cursor:'pointer', outline:'none' }}>
          + Add Goal
        </button>
      </div>

      {loading ? (
        <div style={{ padding:'2rem', textAlign:'center', color:'var(--color-text-muted)',
          fontFamily:'var(--font-body)', fontSize:'0.88rem' }}>Loading…</div>
      ) : goals.length === 0 ? (
        <div style={{ padding:'3rem', textAlign:'center', color:'var(--color-text-muted)',
          fontFamily:'var(--font-body)', fontSize:'0.88rem',
          background:'var(--color-surface)', border:'1px solid var(--color-border)',
          borderRadius:'var(--radius-lg)' }}>
          No goals yet. Add your first long-term goal to start tracking progress.
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal}
              onEdit={() => setEditing(goal)}
              onDelete={() => deleteGoal(goal.id)}
              onUpdateValue={(val) => updateGoal(goal.id, { current_value: val })} />
          ))}
        </div>
      )}

      {(showForm || editing) && (
        <GoalForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }} />
      )}
    </div>
  )
}
