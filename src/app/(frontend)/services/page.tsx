import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal } from '../components/Reveal'

export const dynamic = 'force-dynamic'

export default async function ServicesPage() {
  const payload = await getPayload({ config })
  const projects = await payload.find({
    collection: 'projects',
    where: { status: { equals: 'open' } },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  })

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Services</div>
          <h1>Custom project briefs</h1>
          <p>Studios post projects here. Designers bid privately — only the bid count is public.</p>
        </div>

        <div className="results-head">
          <span>{projects.totalDocs} open project{projects.totalDocs === 1 ? '' : 's'}</span>
          <Link className="btn btn-primary" href="/services/post">Post a project</Link>
        </div>

        {projects.docs.length === 0 ? (
          <div className="empty list-pad">No open projects right now.</div>
        ) : (
          <Reveal>
            <div className="list-rows list-pad">
              {projects.docs.map((p: any) => (
                <Link key={p.id} href={`/services/${p.id}`} className="card-a">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                    <h3 style={{ fontFamily: 'Montserrat', fontSize: 16, fontWeight: 600 }}>{p.title}</h3>
                    <span className="tag">{p.bidCount || 0} bid{p.bidCount === 1 ? '' : 's'}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0' }}>
                    {p.description?.slice(0, 160)}{p.description?.length > 160 ? '…' : ''}
                  </p>
                  <div className="listing-meta" style={{ marginBottom: 0 }}>
                    {typeof p.engine === 'object' && p.engine && <span className="tag">{p.engine.name}</span>}
                    {(p.budgetMin || p.budgetMax) && (
                      <span className="tag">${p.budgetMin || 0}–${p.budgetMax || '?'}</span>
                    )}
                    {p.deadline && <span className="tag">Due {new Date(p.deadline).toLocaleDateString()}</span>}
                  </div>
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
