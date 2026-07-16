import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'
import { getSessionUser } from '@/lib/session'
import { ApplyForm } from './ApplyForm'
import { ApplicantRow } from './ApplicantRow'

export const dynamic = 'force-dynamic'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const job: any = await payload.findByID({ collection: 'jobs', id, depth: 1 }).catch(() => null)
  if (!job) notFound()

  const user = await getSessionUser().catch(() => null)
  const posterId = typeof job.postedBy === 'object' ? job.postedBy?.id : job.postedBy
  const isOwner = user && String(posterId) === String(user.id)
  const isAdmin = user?.role === 'admin'

  // Only the poster/admin can preview a job that isn't live yet.
  if (job.status !== 'live' && !isOwner && !isAdmin) notFound()

  let applications: any[] = []
  let myApplication: any = null
  if (user) {
    const result = await payload.find({
      collection: 'job-applications',
      where: { job: { equals: id } },
      depth: 1,
      limit: 100,
      sort: '-createdAt',
    })
    applications = result.docs
    if (!isOwner) myApplication = applications.find((a) => (typeof a.applicant === 'object' ? a.applicant.id : a.applicant) === user.id)
  }

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="listing">
          <div>
            <div className="eyebrow">{job.jobType}</div>
            {(isOwner || isAdmin) && job.status !== 'live' && <span className="status-pill" style={{ marginBottom: 8, display: 'inline-block' }}>{job.status}</span>}
            <h1 className="listing-title">{job.title}</h1>
            <div className="byline" style={{ marginBottom: 20 }}>{job.company}{job.location ? ` · ${job.location}` : ''}</div>
            <p className="listing-desc">{job.description}</p>

            {(isOwner || isAdmin) && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Applicants ({applications.length}) — private to you</h4>
                {applications.length === 0 ? (
                  <div className="empty">No applications yet.</div>
                ) : (
                  <table className="table">
                    <thead><tr><th>Applicant</th><th>Resume</th><th>Status</th></tr></thead>
                    <tbody>
                      {applications.map((a) => <ApplicantRow key={a.id} application={a} />)}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          <div className="buybox">
            {job.applyUrl && (
              <div className="buy-path">
                <h5>Apply externally</h5>
                <a className="btn btn-primary btn-block" href={job.applyUrl}>Apply</a>
              </div>
            )}
            {!user ? (
              <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>Sign in to apply on Broadexa.</p>
            ) : isOwner ? (
              <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>This is your posting. Applicants are listed to the left.</p>
            ) : myApplication ? (
              <div>
                <h5 style={{ marginBottom: 6 }}>Your application</h5>
                <p style={{ fontSize: 13.5, color: 'var(--muted)' }}><span className="status-pill">{myApplication.status}</span></p>
              </div>
            ) : (
              <ApplyForm jobId={job.id} />
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
