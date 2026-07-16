'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ReviewForm({ orderId, assetId }: { orderId: string; assetId: string }) {
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderId, asset: assetId, rating, comment }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Could not submit review')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, marginBottom: 24 }}>
      <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Leave a review</h4>
      {error && <div className="form-error">{error}</div>}
      <div className="field">
        <label>Rating</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>)}
        </select>
      </div>
      <div className="field">
        <label>Comment (optional)</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <button className="btn btn-primary" disabled={loading} onClick={submit}>
        {loading ? 'Submitting…' : 'Submit review'}
      </button>
    </div>
  )
}
