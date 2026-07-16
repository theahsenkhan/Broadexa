'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PostJobForm({ userId }: { userId: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('full-time')
  const [description, setDescription] = useState('')
  const [applyUrl, setApplyUrl] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          company,
          postedBy: userId,
          location,
          jobType,
          description,
          applyUrl: applyUrl || undefined,
          status: 'pending',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Could not post job')
      setSuccess(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="form-success">
        Job submitted — it&apos;ll go live once reviewed.{' '}
        <a href="/jobs" style={{ color: 'var(--green)', fontWeight: 600 }} onClick={() => router.refresh()}>Back to jobs</a>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 560 }}>
      {error && <div className="form-error">{error}</div>}
      <div className="field">
        <label>Job title</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Virtual Set Designer" />
      </div>
      <div className="field-row">
        <div className="field">
          <label>Company</label>
          <input required value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className="field">
          <label>Location</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote, city…" />
        </div>
      </div>
      <div className="field">
        <label>Type</label>
        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="full-time">Full-time</option>
          <option value="contract">Contract</option>
          <option value="freelance">Freelance</option>
          <option value="remote">Remote</option>
        </select>
      </div>
      <div className="field">
        <label>Description</label>
        <textarea required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Role, responsibilities, requirements…" />
      </div>
      <div className="field">
        <label>External apply link or email (optional)</label>
        <input value={applyUrl} onChange={(e) => setApplyUrl(e.target.value)} placeholder="https:// or mailto:…" />
        <span className="field-hint">Leave blank and applicants will apply directly on Broadexa instead.</span>
      </div>
      <button className="btn btn-primary" disabled={loading} type="submit">
        {loading ? 'Submitting…' : 'Submit for review'}
      </button>
    </form>
  )
}
