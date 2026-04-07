import { useState } from 'react'

export default function CopyButton({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button onClick={handleCopy} aria-label={copied ? 'Copied!' : `Copy ${label}`}
      style={{ display:'inline-flex', alignItems:'center', gap:'0.3rem',
        padding:'0.28rem 0.65rem', fontSize:'0.72rem', fontFamily:'var(--font-body)',
        fontWeight:500, color: copied ? '#4eca8b' : '#8b8fa8',
        background: copied ? 'rgba(78,202,139,0.1)' : 'rgba(255,255,255,0.04)',
        border:`1px solid ${copied ? 'rgba(78,202,139,0.3)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius:'6px', cursor:'pointer', transition:'all 0.15s', outline:'none', flexShrink:0 }}>
      {copied ? '✓ Copied' : `⎘ ${label}`}
    </button>
  )
}
