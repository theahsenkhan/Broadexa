'use client'

import { useState } from 'react'

export function PasswordForm({ userId, email }: { userId: string; email: string }) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)
    try {
      const verify = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password: currentPassword }),
      })
      if (!verify.ok) throw new Error('Current password is incorrect')

      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Could not change password')
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 480 }}>
      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">Password changed.</div>}
      <div className="field">
        <label>Current password</label>
        <input required type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
      </div>
      <div className="field">
        <label>New password</label>
        <input required type="password" minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </div>
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? 'Updating…' : 'Change password'}
      </button>
    </form>
  )
}
