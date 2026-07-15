import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'

export const dynamic = 'force-dynamic'

const statusLabel: Record<string, string> = {
  upcoming: 'Upcoming',
  open: 'Open for entries',
  judging: 'Judging',
  closed: 'Closed',
}

export default async function CompetitionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'competitions',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  const competition: any = result.docs[0]
  if (!competition) notFound()

  const winners = await payload.find({
    collection: 'award-entries',
    where: { competition: { equals: competition.id }, status: { equals: 'winner' } },
    depth: 1,
    limit: 20,
  })

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="listing">
          <div>
            <div className="listing-meta">
              <span className="tag">{statusLabel[competition.status] || competition.status}</span>
              {typeof competition.engine === 'object' && competition.engine && <span className="tag">{competition.engine.name}</span>}
            </div>
            <h1 className="listing-title">{competition.title}</h1>
            <p className="listing-desc">{competition.theme}</p>

            <table className="specs">
              <tbody>
                <tr><td>Starts</td><td>{competition.startDate ? new Date(competition.startDate).toLocaleDateString() : 'TBA'}</td></tr>
                <tr><td>Entry deadline</td><td>{competition.deadline ? new Date(competition.deadline).toLocaleDateString() : 'TBA'}</td></tr>
              </tbody>
            </table>

            {Array.isArray(competition.prizes) && competition.prizes.length > 0 && (
              <>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Prizes</h4>
                <div className="chips" style={{ marginBottom: 28 }}>
                  {competition.prizes.map((p: any, i: number) => (
                    <span key={i} className="chip">{p.place}: {p.prize}</span>
                  ))}
                </div>
              </>
            )}

            {competition.rules && (
              <>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Rules</h4>
                <p className="listing-desc">{competition.rules}</p>
              </>
            )}

            {winners.docs.length > 0 && (
              <>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Winners</h4>
                <div className="grid" style={{ marginBottom: 40 }}>
                  {winners.docs.map((w: any) => (
                    <div key={w.id} className="card-a">
                      <div className="thumb" />
                      <div className="card-body">
                        <h3>{w.title}</h3>
                        <div className="byline">{typeof w.entrant === 'object' ? w.entrant?.studioName || w.entrant?.name : ''}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="buybox">
            {competition.status === 'open' ? (
              <>
                <h5>Enter this competition</h5>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>
                  Submit your work before the deadline. You&apos;ll need an account to enter.
                </p>
                <Link className="btn btn-primary btn-block" href={`/awards/enter?competition=${competition.id}`}>
                  Submit entry
                </Link>
              </>
            ) : (
              <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>
                {competition.status === 'upcoming' ? 'Entries open soon.' : 'Entries are closed for this competition.'}
              </p>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
