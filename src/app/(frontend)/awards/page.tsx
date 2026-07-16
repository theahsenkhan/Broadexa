import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal } from '../components/Reveal'

export const dynamic = 'force-dynamic'

export default async function AwardsPage() {
  const payload = await getPayload({ config })
  const winners = await payload.find({
    collection: 'award-entries',
    where: { status: { equals: 'winner' } },
    sort: '-year',
    limit: 50,
    depth: 1,
  })

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Awards</div>
          <h1>Broadexa Design Awards</h1>
          <p>Celebrating the best broadcast-ready real-time work on the platform.</p>
        </div>

        <div className="results-head">
          <span>{winners.totalDocs} winner{winners.totalDocs === 1 ? '' : 's'}</span>
          <Link className="btn btn-primary" href="/awards/enter">Enter your work</Link>
        </div>

        {winners.docs.length === 0 ? (
          <div className="empty list-pad">No winners announced yet.</div>
        ) : (
          <Reveal>
            <div className="grid list-pad">
              {winners.docs.map((w: any) => (
                <div key={w.id} className="card-a">
                  <div className="thumb" />
                  <div className="card-body">
                    <h3>{w.title}</h3>
                    <div className="byline">{typeof w.entrant === 'object' ? w.entrant?.studioName || w.entrant?.name : ''} · {w.year}</div>
                    <span className="badge verified">🏆 {w.awardCategory}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
