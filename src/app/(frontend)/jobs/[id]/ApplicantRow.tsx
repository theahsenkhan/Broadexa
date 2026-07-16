'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ApplicantRow({ application }: { application: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const applicant = typeof application.applicant === 'object' ? application.applicant : null

  async function setStatus(status: string) {
    setLoading(true)
    try {
      await fetch(`/api/job-applications/${application.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr>
      <td>{applicant?.name || 'Applicant'}</td>
      <td>{application.resumeUrl ? <a href={application.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--violet)' }}>Resume</a> : '—'}</td>
      <td>
        <select value={application.status} disabled={loading} onChange={(e) => setStatus(e.target.value)} style={{ fontSize: 12, padding: '4px 8px' }}>
          <option value="submitted">Submitted</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
      </td>
    </tr>
  )
}
