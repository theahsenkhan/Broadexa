import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

const statusClass: Record<string, string> = {
  live: 'good',
  hired: 'good',
  shortlisted: 'good',
  pending: 'warn',
  submitted: 'warn',
}

export default async function DashboardJobsPage() {
  const user = await getSessionUser()
  if (!user) return null
  const payload = await getPayload({ config })

  const [posted, applications] = await Promise.all([
    payload.find({ collection: 'jobs', where: { postedBy: { equals: user.id } }, sort: '-createdAt', limit: 100 }),
    payload.find({ collection: 'job-applications', where: { applicant: { equals: user.id } }, sort: '-createdAt', limit: 100, depth: 1 }),
  ])

  return (
    <div>
      <div className="results-head" style={{ marginBottom: 4 }}>
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20 }}>Jobs</h1>
        <Link className="btn btn-primary" href="/jobs/post">Post a job</Link>
      </div>

      <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--muted)', margin: '20px 0 10px' }}>Jobs you&apos;ve posted</h4>
      {posted.docs.length === 0 ? (
        <div className="empty">You haven&apos;t posted a job yet.</div>
      ) : (
        <table className="table">
          <thead><tr><th>Title</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {posted.docs.map((j: any) => (
              <tr key={j.id}>
                <td>{j.title}</td>
                <td><span className={`status-pill ${statusClass[j.status] || ''}`}>{j.status}</span></td>
                <td><Link href={`/jobs/${j.id}`} style={{ color: 'var(--violet)', fontSize: 12.5, fontWeight: 600 }}>View applicants</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--muted)', margin: '28px 0 10px' }}>Applications you&apos;ve made</h4>
      {applications.docs.length === 0 ? (
        <div className="empty">No applications yet.</div>
      ) : (
        <table className="table">
          <thead><tr><th>Job</th><th>Status</th></tr></thead>
          <tbody>
            {applications.docs.map((a: any) => (
              <tr key={a.id}>
                <td>{typeof a.job === 'object' ? a.job?.title : a.job}</td>
                <td><span className={`status-pill ${statusClass[a.status] || ''}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
