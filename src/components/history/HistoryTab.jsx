import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../../lib/supabase.js'
import { usePosts } from '../../hooks/usePosts.js'
import PillarBadge from '../shared/PillarBadge.jsx'
import PostTypeBadge from '../shared/PostTypeBadge.jsx'
import StatsModal from './StatsModal.jsx'

const STATUS_FILTERS = ['all', 'posted', 'planned', 'skipped']

const STATUS_STYLE = {
  posted:  { color: '#4eca8b', bg: 'rgba(78,202,139,0.1)'  },
  planned: { color: '#8b8fa8', bg: 'rgba(139,143,168,0.1)' },
  skipped: { color: '#e07b6e', bg: 'rgba(224,123,110,0.1)' },
}

function engRate(p) {
  if (!p.reach || !p.likes) return null
  return ((( p.likes ?? 0) + (p.saves ?? 0) + (p.comments ?? 0)) / p.reach * 100).toFixed(1)
}

export default function HistoryTab() {
  const { updatePost } = usePosts()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [editingPost, setEditingPost] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const q = supabase.from('posts').select('*').order('date', { ascending: false }).limit(200)
    const { data, error } = await q
    if (!error) setPosts(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter)

  const handleSave = useCallback(async (id, updates) => {
    const updated = await updatePost(id, updates)
    setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }, [updatePost])

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display:'flex', gap:'0.4rem', marginBottom:'1rem', flexWrap:'wrap' }}>
        {STATUS_FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding:'0.28rem 0.75rem', fontSize:'0.75rem', fontFamily:'var(--font-body)',
              fontWeight: filter === f ? 600 : 400, textTransform:'capitalize',
              color: filter === f ? 'var(--color-text)' : 'var(--color-text-soft)',
              background: filter === f ? 'var(--color-surface-2)' : 'transparent',
              border:`1px solid ${filter === f ? 'var(--color-border-mid)' : 'var(--color-border)'}`,
              borderRadius:'999px', cursor:'pointer', outline:'none' }}>
            {f} {f !== 'all' && `(${posts.filter((p) => p.status === f).length})`}
          </button>
        ))}
        <span style={{ marginLeft:'auto', fontSize:'0.75rem', color:'var(--color-text-muted)',
          fontFamily:'var(--font-body)', alignSelf:'center' }}>
          {filtered.length} posts
        </span>
      </div>

      {loading ? (
        <div style={{ padding:'2rem', textAlign:'center', color:'var(--color-text-muted)',
          fontFamily:'var(--font-body)', fontSize:'0.88rem' }}>Loading history…</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding:'2rem', textAlign:'center', color:'var(--color-text-muted)',
          fontFamily:'var(--font-body)', fontSize:'0.88rem' }}>No posts yet.</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
          {filtered.map((post) => {
            const sc = STATUS_STYLE[post.status] ?? STATUS_STYLE.planned
            const eng = engRate(post)
            return (
              <div key={post.id}
                style={{ display:'flex', alignItems:'center', gap:'0.75rem', flexWrap:'wrap',
                  padding:'0.75rem 1rem', background:'var(--color-surface)',
                  border:'1px solid var(--color-border)', borderRadius:'var(--radius-md)',
                  cursor:'pointer', transition:'border-color 0.12s' }}
                onClick={() => setEditingPost(post)}>

                {/* Date */}
                <span style={{ fontSize:'0.78rem', fontFamily:'var(--font-mono)',
                  color:'var(--color-text-soft)', minWidth:72, flexShrink:0 }}>
                  {post.date}
                </span>

                {/* Badges */}
                <PillarBadge pillar={post.pillar} />
                <PostTypeBadge type={post.post_type} />

                {/* Caption preview */}
                <span style={{ flex:1, minWidth:0, fontSize:'0.82rem', fontFamily:'var(--font-body)',
                  color:'var(--color-text-soft)', overflow:'hidden', textOverflow:'ellipsis',
                  whiteSpace:'nowrap' }}>
                  {post.caption?.substring(0, 80)}…
                </span>

                {/* Stats */}
                <div style={{ display:'flex', gap:'0.75rem', flexShrink:0, fontSize:'0.75rem',
                  fontFamily:'var(--font-body)', color:'var(--color-text-muted)' }}>
                  {post.likes != null && <span>❤️ {post.likes}</span>}
                  {post.saves != null && <span>🔖 {post.saves}</span>}
                  {post.reach != null && <span>👁 {post.reach}</span>}
                  {eng && <span style={{ color:'#4eca8b', fontWeight:500 }}>{eng}%</span>}
                </div>

                {/* Status badge */}
                <span style={{ padding:'0.18rem 0.5rem', fontSize:'0.68rem',
                  fontFamily:'var(--font-body)', fontWeight:500, textTransform:'capitalize',
                  color:sc.color, background:sc.bg, border:`1px solid ${sc.color}40`,
                  borderRadius:'999px', flexShrink:0 }}>
                  {post.status}
                </span>

                <span style={{ color:'var(--color-text-muted)', fontSize:'0.8rem' }}>→</span>
              </div>
            )
          })}
        </div>
      )}

      {editingPost && (
        <StatsModal post={editingPost} onSave={handleSave}
          onClose={() => setEditingPost(null)} />
      )}
    </div>
  )
}
