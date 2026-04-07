import { useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

export function usePosts() {
  const fetchPostsInRange = useCallback(async (from, to) => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: true })
    if (error) throw error
    return data ?? []
  }, [])

  // Last N posts for AI context (to avoid repetition)
  const fetchRecentPosts = useCallback(async (limit = 56) => {
    const { data, error } = await supabase
      .from('posts')
      .select('id,date,day_name,pillar,post_type,visual_concept,caption,hashtags,status,likes,saves,reach,comments,follows_gained,shares')
      .order('date', { ascending: false })
      .limit(limit)
    if (error) throw error
    return data ?? []
  }, [])

  const fetchAllPosted = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'posted')
      .order('date', { ascending: false })
    if (error) throw error
    return data ?? []
  }, [])

  // Bulk insert after n8n generation
  const createPosts = useCallback(async (posts) => {
    const { data, error } = await supabase
      .from('posts')
      .insert(posts)
      .select()
    if (error) throw error
    return data
  }, [])

  const updatePost = useCallback(async (id, updates) => {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  }, [])

  const deletePost = useCallback(async (id) => {
    const { error } = await supabase.from('posts').delete().eq('id', id)
    if (error) throw error
  }, [])

  return { fetchPostsInRange, fetchRecentPosts, fetchAllPosted, createPosts, updatePost, deletePost }
}
