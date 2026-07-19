'use client'

import { useState } from 'react'

type Invited = { id: string; name: string; studioName?: string; username?: string }

export function InviteDesigner({ projectId, initialInvited }: { projectId: string; initialInvited: Invited[] }) {
  const [username, setUsername] = useState('')
  const [invited, setInvited] = useState<Invited[]>(initialInvited)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not invite')
      setInvited((prev) => [...prev, data.designer])
      setUsername('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function remove(designerId: string) {
    setInvited((prev) => prev.filter((d) => d.id !== designerId))
    await fetch(`/api/projects/${projectId}/invite`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ designerId }),
    })
  }

  return (
    <div style={{ marginTop: 22, paddingTop: 18, borderTop: '1px solid var(--line)' }}>
      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Invite a designer to bid</h4>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={invite} style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          placeholder="designer's username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ flex: 1, fontSize: 13, padding: '9px 11px', border: '1.5px solid var(--line-strong)', borderRadius: 8, fontFamily: 'inherit' }}
        />
        <button className="btn btn-ghost" disabled={loading || !username} type="submit">Invite</button>
      </form>
      {invited.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {invited.map((d) => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, padding: '6px 0' }}>
              <span>{d.studioName || d.name} <span style={{ color: 'var(--muted)' }}>@{d.username}</span></span>
              <button className="a-compare" onClick={() => remove(d.id)} type="button">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
