'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.errors?.[0]?.message || 'Something went wrong')
      }
      setSent(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-shell">
      <Link href="/" className="logo" style={{ display: 'block', marginBottom: 28 }}>BROADEXA</Link>
      <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Reset your password</h1>

      {sent ? (
        <div className="form-success">If an account exists for that email, a reset link is on its way.</div>
      ) : (
        <>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>Enter your email and we&apos;ll send you a reset link.</p>
          {error && <div className="form-error">{error}</div>}
          <form onSubmit={onSubmit}>
            <div className="field">
              <label>Email</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button className="btn btn-primary btn-block" disabled={loading} type="submit">
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        </>
      )}

      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 18, textAlign: 'center' }}>
        <Link href="/login" style={{ color: 'var(--violet)', fontWeight: 600 }}>Back to sign in</Link>
      </p>
    </div>
  )
}
