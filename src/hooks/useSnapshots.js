import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useSnapshots() {
  const [snapshots, setSnapshots] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSnapshots = useCallback(async (limit = 16) => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('weekly_snapshots')
        .select('*')
        .order('week_start_date', { ascending: false })
        .limit(limit)
      if (error) throw error
      const sorted = [...(data ?? [])].sort((a, b) =>
        a.week_start_date.localeCompare(b.week_start_date)
      )
      setSnapshots(sorted)
      return sorted
    } finally {
      setLoading(false)
    }
  }, [])

  const upsertSnapshot = useCallback(async (snapshot) => {
    const { data, error } = await supabase
      .from('weekly_snapshots')
      .upsert(snapshot, { onConflict: 'week_start_date' })
      .select()
      .single()
    if (error) throw error
    setSnapshots((prev) => {
      const idx = prev.findIndex((s) => s.week_start_date === data.week_start_date)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = data
        return next
      }
      return [...prev, data].sort((a, b) =>
        a.week_start_date.localeCompare(b.week_start_date)
      )
    })
    return data
  }, [])

  return { snapshots, loading, fetchSnapshots, upsertSnapshot }
}
