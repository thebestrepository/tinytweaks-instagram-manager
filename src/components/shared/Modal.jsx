import { useEffect } from 'react'

export default function Modal({ title, onClose, children, width = '520px' }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.65)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:'1rem' }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ background:'var(--color-surface)', border:'1px solid var(--color-border-mid)',
          borderRadius:'var(--radius-lg)', width:'100%', maxWidth:width, maxHeight:'90vh',
          display:'flex', flexDirection:'column', boxShadow:'var(--shadow-lg)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'1rem 1.25rem', borderBottom:'1px solid var(--color-border)' }}>
          <h3 style={{ margin:0, fontSize:'1rem', fontFamily:'var(--font-display)', fontWeight:600 }}>
            {title}
          </h3>
          <button onClick={onClose} aria-label="Close"
            style={{ background:'none', border:'none', color:'var(--color-text-soft)',
              fontSize:'1.2rem', cursor:'pointer', lineHeight:1, padding:'0.1rem 0.3rem' }}>
            ×
          </button>
        </div>
        <div style={{ padding:'1.25rem', overflowY:'auto' }}>{children}</div>
      </div>
    </div>
  )
}
