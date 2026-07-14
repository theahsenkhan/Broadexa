'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function EnterForm({ userId, engines }: { userId: string; engines: { id: string; name: string }[] }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [awardCategory, setAwardCategory] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [videoUrl, setVideoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [engine, setEngine] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/award-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          entrant: userId,
          awardCategory,
          year: Number(year),
          videoUrl,
          description,
          engine: engine || undefined,
          status: 'submitted',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Could not submit entry')
      setSuccess(true)
      setTimeout(() => router.push('/awards'), 1200)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) return <div className="form-success">Entry submitted — good luck!</div>

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 560 }}>
      {error && <div className="form-error">{error}</div>}
      <div className="field">
        <label>Title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Category</label>
          <input required value={awardCategory} onChange={(e) => setAwardCategory(e.target.value)} placeholder="e.g. Best Virtual Set" />
        </div>
        <div className="field">
          <label>Year</label>
          <input required type="number" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
      </div>
      <div className="field">
        <label>Engine</label>
        <select value={engine} onChange={(e) => setEngine(e.target.value)}>
          <option value="">Not specified</option>
          {engines.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Entry video URL</label>
        <input required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://…" />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? 'Submitting…' : 'Submit entry'}
      </button>
    </form>
  )
}
