import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function useGoals() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchGoals = useCallback(async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
      if (error) throw error
      setGoals(data ?? [])
      return data ?? []
    } finally {
      setLoading(false)
    }
  }, [])

  const createGoal = useCallback(async (goal) => {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single()
    if (error) throw error
    setGoals((prev) => [...prev, data])
    return data
  }, [])

  const updateGoal = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('goals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setGoals((prev) => prev.map((g) => (g.id === id ? data : g)))
    return data
  }, [])

  const deleteGoal = useCallback(async (id) => {
    const { error } = await supabase
      .from('goals')
      .update({ is_active: false })
      .eq('id', id)
    if (error) throw error
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }, [])

  return { goals, loading, fetchGoals, createGoal, updateGoal, deleteGoal }
}
