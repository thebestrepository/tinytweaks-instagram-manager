import { useState, useEffect, useCallback } from 'react'
import { usePosts } from '../../hooks/usePosts.js'
import { useGoals } from '../../hooks/useGoals.js'
import { n8nService } from '../../services/N8nService.js'
import FourWeekGrid from './FourWeekGrid.jsx'
import DayBrief from './DayBrief.jsx'

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function getMondayOf(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  const dow = d.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

export default function PlannerTab() {
  const { fetchPostsInRange, fetchRecentPosts, createPosts, updatePost } = usePosts()
  const { goals, fetchGoals } = useGoals()

  const [postsByDate, setPostsByDate] = useState({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [generatingWeek, setGeneratingWeek] = useState(null)
  const [error, setError] = useState(null)

  // Load posts for the 4-week window
  const loadPosts = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0]
    const from = getMondayOf(today)
    const to = addDays(from, 27)
    const posts = await fetchPostsInRange(from, to)
    const map = {}
    posts.forEach((p) => { map[p.date] = p })
    setPostsByDate(map)
  }, [fetchPostsInRange])

  useEffect(() => {
    loadPosts()
    fetchGoals()
  }, [loadPosts, fetchGoals])

  const handleGenerateWeek = useCallback(async (mondayDate) => {
    setGeneratingWeek(mondayDate)
    setError(null)
    try {
      // Gather context: last 8 weeks of posts to avoid repetition
      const recentPosts = await fetchRecentPosts(56)
      const goalLabels = goals.map((g) => `${g.label}: ${g.current_value}/${g.target_value} ${g.unit ?? ''}`.trim())

      const followerGoal = goals.find((g) => g.type === 'follower_count')
      const currentFollowers = followerGoal?.current_value ?? null

      const previousPostsContext = recentPosts.map((p) => ({
        date: p.date,
        pillar: p.pillar,
        postType: p.post_type,
        captionSummary: p.caption?.substring(0, 100),
        visualTheme: p.visual_concept?.substring(0, 80),
        engagement: p.reach ? ((( p.likes ?? 0) + (p.saves ?? 0) + (p.comments ?? 0)) / p.reach * 100).toFixed(1) : null,
      }))

      const data = await n8nService.generateWeek({
        weekStartDate: mondayDate,
        previousPosts: previousPostsContext,
        goals: goalLabels,
        currentFollowers,
      })

      if (!data?.weeklyPlan?.length) throw new Error('No plan returned from n8n')

      // Map n8n camelCase → Supabase snake_case
      const rows = data.weeklyPlan.map((day) => ({
        date: day.date,
        day_name: day.dayName,
        pillar: day.pillar,
        post_type: day.postType,
        visual_concept: day.visualConcept,
        caption: day.caption,
        hashtags: day.hashtags,
        best_time_to_post: day.bestTimeToPost,
        week_label: data.weekLabel,
        week_start_date: mondayDate,
        status: 'planned',
      }))

      // Delete existing posts for this week before inserting (regenerate scenario)
      // We'll just upsert by overwriting — for simplicity do insert + reload
      await createPosts(rows)
      await loadPosts()
    } catch (e) {
      setError(e.message)
    } finally {
      setGeneratingWeek(null)
    }
  }, [fetchRecentPosts, goals, createPosts, loadPosts])

  const handleStatusChange = useCallback(async (id, status) => {
    const updates = { status }
    if (status === 'posted') updates.posted_at = new Date().toISOString()
    const updated = await updatePost(id, updates)
    setPostsByDate((prev) => ({ ...prev, [updated.date]: updated }))
  }, [updatePost])

  const selectedPost = postsByDate[selectedDate] ?? null

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
      {error && (
        <div style={{ padding:'0.6rem 1rem', background:'rgba(224,123,110,0.08)',
          border:'1px solid rgba(224,123,110,0.25)', borderRadius:'var(--radius-md)',
          fontSize:'0.82rem', color:'#e07b6e', fontFamily:'var(--font-body)' }}>
          ⚠ {error}
        </div>
      )}

      <FourWeekGrid
        postsByDate={postsByDate}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        onGenerateWeek={handleGenerateWeek}
        generatingWeek={generatingWeek}
      />

      {selectedPost ? (
        <DayBrief post={selectedPost} onStatusChange={handleStatusChange} />
      ) : (
        <div style={{ padding:'2rem', textAlign:'center', color:'var(--color-text-muted)',
          fontSize:'0.88rem', fontFamily:'var(--font-body)',
          background:'var(--color-surface)', border:'1px solid var(--color-border)',
          borderRadius:'var(--radius-lg)' }}>
          {selectedDate < new Date().toISOString().split('T')[0]
            ? 'No post was planned for this day.'
            : 'Click "+ Generate week" to create content for this week, then select a day.'}
        </div>
      )}
    </div>
  )
}
