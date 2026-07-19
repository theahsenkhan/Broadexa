'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function InviteToProjectButton({ designerUsername, isLoggedIn }: { designerUsername: string; isLoggedIn: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState<{ id: string; title: string }[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  async function onOpen() {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(`/designer/${designerUsername}`)}`)
      return
    }
    setOpen((o) => !o)
    if (projects === null) {
      setLoading(true)
      const res = await fetch('/api/projects/mine')
      const data = await res.json()
      setProjects(data.projects || [])
      setLoading(false)
    }
  }

  async function invite(projectId: string) {
    setMessage('')
    const res = await fetch(`/api/projects/${projectId}/invite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: designerUsername }),
    })
    const data = await res.json()
    setMessage(res.ok ? "Invited — they'll see this in their dashboard." : data.error || 'Could not invite')
  }

  return (
    <div className="invite-menu" ref={ref}>
      <button type="button" className="btn btn-primary btn-block" onClick={onOpen}>Invite to a project</button>
      {open && (
        <div className="invite-popover">
          {loading ? (
            <p className="field-hint">Loading your projects…</p>
          ) : projects && projects.length > 0 ? (
            <>
              <p className="field-hint" style={{ marginBottom: 8 }}>Pick a project to invite them to:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {projects.map((p) => (
                  <button key={p.id} type="button" className="invite-popover-item" onClick={() => invite(p.id)}>{p.title}</button>
                ))}
              </div>
            </>
          ) : (
            <>
              <p className="field-hint" style={{ marginBottom: 10 }}>You don&apos;t have an open project yet.</p>
              <Link className="btn btn-ghost btn-block" href={`/services/post?invite=${designerUsername}`}>Post a project</Link>
            </>
          )}
          {message && <p style={{ fontSize: 12, color: 'var(--violet)', marginTop: 10 }}>{message}</p>}
        </div>
      )}
    </div>
  )
}
