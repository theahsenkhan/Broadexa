import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const payload = await getPayload({ config })
  const jobs = await payload.find({
    collection: 'jobs',
    where: { status: { equals: 'live' } },
    sort: '-createdAt',
    limit: 50,
  })

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Jobs</div>
          <h1>Broadcast design jobs</h1>
        </div>

        {jobs.docs.length === 0 ? (
          <div className="empty" style={{ marginBottom: 60 }}>No open roles right now.</div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 12, paddingBottom: 60 }}>
            {jobs.docs.map((j: any) => (
              <Link key={j.id} href={`/jobs/${j.id}`} className="card-a" style={{ padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                  <h3 style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 600 }}>{j.title}</h3>
                  {j.jobType && <span className="tag">{j.jobType}</span>}
                </div>
                <div className="byline">{j.company}{j.location ? ` · ${j.location}` : ''}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
