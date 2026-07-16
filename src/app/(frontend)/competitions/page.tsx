import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal } from '../components/Reveal'

export const dynamic = 'force-dynamic'

const statusLabel: Record<string, string> = {
  upcoming: 'Upcoming',
  open: 'Open for entries',
  judging: 'Judging',
  closed: 'Closed',
}

export default async function CompetitionsPage() {
  const payload = await getPayload({ config })
  const competitions = await payload.find({
    collection: 'competitions',
    sort: '-startDate',
    limit: 50,
    depth: 1,
  })

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Competitions</div>
          <h1>Themed design challenges</h1>
          <p>Timed briefs with real prizes — enter your work, get judged by the community.</p>
        </div>

        {competitions.docs.length === 0 ? (
          <div className="empty list-pad">No competitions running right now.</div>
        ) : (
          <Reveal>
            <div className="grid list-pad">
              {competitions.docs.map((c: any) => (
                <Link key={c.id} href={`/competitions/${c.slug}`} className="card-a">
                  <div className="thumb" />
                  <div className="card-body">
                    <h3>{c.title}</h3>
                    <div className="byline">
                      {c.deadline ? `Deadline ${new Date(c.deadline).toLocaleDateString()}` : 'No deadline set'}
                    </div>
                    <div className="card-foot">
                      <span className="tag">{statusLabel[c.status] || c.status}</span>
                      {typeof c.engine === 'object' && c.engine && <span className="tag">{c.engine.name}</span>}
                    </div>
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
