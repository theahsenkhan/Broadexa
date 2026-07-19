'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PostProjectForm({ userId, engines, inviteUsername }: { userId: string; engines: { id: string; name: string }[]; inviteUsername?: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [engine, setEngine] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          postedBy: userId,
          engine: engine || undefined,
          budgetMin: budgetMin ? Number(budgetMin) : undefined,
          budgetMax: budgetMax ? Number(budgetMax) : undefined,
          deadline: deadline || undefined,
          status: 'open',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Could not post project')

      if (inviteUsername) {
        await fetch(`/api/projects/${data.doc.id}/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: inviteUsername }),
        }).catch(() => {})
      }

      router.push(`/services/${data.doc.id}`)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 560 }}>
      {error && <div className="form-error">{error}</div>}
      <div className="field">
        <label>Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Election night AR package" />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Scope, deliverables, references…" />
      </div>
      <div className="field">
        <label>Engine (optional)</label>
        <select value={engine} onChange={(e) => setEngine(e.target.value)}>
          <option value="">No preference</option>
          {engines.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>
      <div className="field-row">
        <div className="field">
          <label>Budget min (USD)</label>
          <input type="number" min={0} value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
        </div>
        <div className="field">
          <label>Budget max (USD)</label>
          <input type="number" min={0} value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Deadline (optional)</label>
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? 'Posting…' : 'Post project'}
      </button>
    </form>
  )
}
