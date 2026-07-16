import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal } from '../components/Reveal'

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

        <div className="results-head">
          <span>{jobs.totalDocs} open role{jobs.totalDocs === 1 ? '' : 's'}</span>
          <Link className="btn btn-primary" href="/jobs/post">Post a job</Link>
        </div>

        {jobs.docs.length === 0 ? (
          <div className="empty list-pad">No open roles right now.</div>
        ) : (
          <Reveal>
            <div className="list-rows list-pad">
              {jobs.docs.map((j: any) => (
                <Link key={j.id} href={`/jobs/${j.id}`} className="card-a">
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 600 }}>{j.title}</h3>
                    {j.jobType && <span className="tag">{j.jobType}</span>}
                  </div>
                  <div className="byline">{j.company}{j.location ? ` · ${j.location}` : ''}</div>
                </Link>
              ))}
            </div>
          </Reveal>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
