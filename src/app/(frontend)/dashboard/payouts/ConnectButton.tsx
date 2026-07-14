'use client'

import { useState } from 'react'

export function ConnectButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function connect() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/connect-onboarding', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not start onboarding')
      window.location.href = data.url
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="form-error">{error}</div>}
      <button className="btn btn-primary" disabled={loading} onClick={connect}>
        {loading ? 'Redirecting…' : 'Connect Stripe account'}
      </button>
    </div>
  )
}
