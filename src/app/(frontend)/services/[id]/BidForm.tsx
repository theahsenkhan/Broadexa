'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function BidForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [timelineDays, setTimelineDays] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: projectId,
          amount: Number(amount),
          timelineDays: timelineDays ? Number(timelineDays) : undefined,
          message,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Could not submit bid')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h5 style={{ marginBottom: 10 }}>Submit a bid</h5>
      {error && <div className="form-error">{error}</div>}
      <div className="field">
        <label>Your price (USD)</label>
        <input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="field">
        <label>Delivery (days)</label>
        <input type="number" min={0} value={timelineDays} onChange={(e) => setTimelineDays(e.target.value)} />
      </div>
      <div className="field">
        <label>Message</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Why you're a fit, questions, approach…" />
      </div>
      <button className="btn btn-primary btn-block" disabled={loading || !amount} onClick={submit}>
        {loading ? 'Submitting…' : 'Submit bid'}
      </button>
      <p className="field-hint" style={{ marginTop: 8 }}>Your bid is private — only you, the poster, and admins can see it.</p>
    </div>
  )
}
