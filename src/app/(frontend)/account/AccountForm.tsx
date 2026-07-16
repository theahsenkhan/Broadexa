'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Fields = { name: string; studioName: string; bio: string; onAirCredits: string; country: string }

export function AccountForm({ userId, initial }: { userId: string; initial: Fields }) {
  const router = useRouter()
  const [fields, setFields] = useState<Fields>(initial)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function set<K extends keyof Fields>(key: K, value: string) {
    setFields((f) => ({ ...f, [key]: value }))
    setSuccess(false)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Could not save changes')
      setSuccess(true)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 480 }}>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">Saved.</div>}
      <div className="field">
        <label>Name</label>
        <input required value={fields.name} onChange={(e) => set('name', e.target.value)} />
      </div>
      <div className="field">
        <label>Studio / display name</label>
        <input value={fields.studioName} onChange={(e) => set('studioName', e.target.value)} />
      </div>
      <div className="field">
        <label>Bio</label>
        <textarea value={fields.bio} onChange={(e) => set('bio', e.target.value)} />
      </div>
      <div className="field">
        <label>On-air credits</label>
        <input value={fields.onAirCredits} onChange={(e) => set('onAirCredits', e.target.value)} />
      </div>
      <div className="field">
        <label>Country</label>
        <input value={fields.country} onChange={(e) => set('country', e.target.value)} />
      </div>
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? 'Saving…' : 'Save changes'}
      </button>
    </form>
  )
}
