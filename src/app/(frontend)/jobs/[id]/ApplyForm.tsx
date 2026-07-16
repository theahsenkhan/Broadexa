'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ApplyForm({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [coverNote, setCoverNote] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/job-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job: jobId, resumeUrl, coverNote }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || 'Could not submit application')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h5 style={{ marginBottom: 10 }}>Apply on Broadexa</h5>
      {error && <div className="form-error">{error}</div>}
      <div className="field">
        <label>Resume / portfolio link</label>
        <input value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://…" />
      </div>
      <div className="field">
        <label>Cover note</label>
        <textarea value={coverNote} onChange={(e) => setCoverNote(e.target.value)} placeholder="Why you're a fit…" />
      </div>
      <button className="btn btn-primary btn-block" disabled={loading} onClick={submit}>
        {loading ? 'Submitting…' : 'Apply'}
      </button>
      <p className="field-hint" style={{ marginTop: 8 }}>Your application is private — only you, the poster, and admins can see it.</p>
    </div>
  )
}
