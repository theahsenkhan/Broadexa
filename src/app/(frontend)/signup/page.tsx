'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SignupForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') || '/dashboard'
  const defaultRole = params.get('role') === 'designer' ? 'designer' : 'buyer'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState(defaultRole)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const createRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      })
      const createData = await createRes.json()
      if (!createRes.ok) throw new Error(createData?.errors?.[0]?.message || 'Could not create account')

      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (!loginRes.ok) throw new Error('Account created — please sign in.')

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
      <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Create your account</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 24 }}>Buyers browse for free. Designers keep 80% of every sale.</p>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={onSubmit}>
        <div className="field">
          <label>I am a</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="buyer">Buyer — I want to purchase assets</option>
            <option value="designer">Designer — I want to sell my work</option>
          </select>
        </div>
        <div className="field">
          <label>Name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="field">
          <label>Password</label>
          <input required type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          <span className="field-hint">At least 8 characters.</span>
        </div>
        <button className="btn btn-primary btn-block" disabled={loading} type="submit">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 18, textAlign: 'center' }}>
        Already have an account? <Link href={`/login?next=${encodeURIComponent(next)}`} style={{ color: 'var(--violet)', fontWeight: 600 }}>Sign in</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
