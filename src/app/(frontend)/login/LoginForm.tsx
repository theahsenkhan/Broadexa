'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { OAuthButtons } from '../components/OAuthButtons'

export function LoginForm({ oauth }: { oauth: { google: boolean; linkedin: boolean } }) {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(params.get('error') || '')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || data?.message || 'Invalid email or password')
      router.push(next)
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-shell">
      <Link href="/" className="logo" style={{ display: 'block', marginBottom: 28 }}>BROADEXA</Link>
      <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Sign in</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>Welcome back.</p>

      {error && <div className="form-error">{error}</div>}

      <OAuthButtons oauth={oauth} next={next} />

      <form onSubmit={onSubmit}>
        <div className="field">
          <label>Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-block" disabled={loading} type="submit">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p style={{ fontSize: 12.5, marginTop: 12, textAlign: 'center' }}>
        <Link href="/forgot-password" style={{ color: 'var(--muted)' }}>Forgot password?</Link>
      </p>

      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 10, textAlign: 'center' }}>
        New to Broadexa? <Link href={`/signup?next=${encodeURIComponent(next)}`} style={{ color: 'var(--violet)', fontWeight: 600 }}>Create an account</Link>
      </p>
    </div>
  )
}
