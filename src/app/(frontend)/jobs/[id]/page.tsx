import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const job: any = await payload.findByID({ collection: 'jobs', id }).catch(() => null)
  if (!job || job.status !== 'live') notFound()

  return (
    <>
      <SiteNav />
      <div className="form-wide">
        <div className="eyebrow">{job.jobType}</div>
        <h1 className="listing-title">{job.title}</h1>
        <div className="byline" style={{ marginBottom: 20 }}>{job.company}{job.location ? ` · ${job.location}` : ''}</div>
        <p className="listing-desc">{job.description}</p>
        {job.applyUrl && (
          <a className="btn btn-primary" href={job.applyUrl}>Apply</a>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
