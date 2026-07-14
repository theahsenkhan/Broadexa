import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function DashboardProjectsPage() {
  const user = await getSessionUser()
  if (!user) return null
  const payload = await getPayload({ config })

  const [posted, bids] = await Promise.all([
    payload.find({ collection: 'projects', where: { postedBy: { equals: user.id } }, sort: '-createdAt', limit: 100 }),
    payload.find({ collection: 'bids', where: { designer: { equals: user.id } }, sort: '-createdAt', limit: 100, depth: 1 }),
  ])

  return (
    <div>
      <div className="results-head" style={{ marginBottom: 4 }}>
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20 }}>Projects &amp; bids</h1>
        <Link className="btn btn-primary" href="/services/post">Post a project</Link>
      </div>

      <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--muted)', margin: '20px 0 10px' }}>Projects you&apos;ve posted</h4>
      {posted.docs.length === 0 ? (
        <div className="empty">You haven&apos;t posted a project yet.</div>
      ) : (
        <table className="table">
          <thead><tr><th>Title</th><th>Status</th><th>Bids</th><th></th></tr></thead>
          <tbody>
            {posted.docs.map((p: any) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td><span className="status-pill">{p.status}</span></td>
                <td>{p.bidCount || 0}</td>
                <td><Link href={`/services/${p.id}`} style={{ color: 'var(--violet)', fontSize: 12.5, fontWeight: 600 }}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h4 style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--muted)', margin: '28px 0 10px' }}>Bids you&apos;ve made</h4>
      {bids.docs.length === 0 ? (
        <div className="empty">No bids yet.</div>
      ) : (
        <table className="table">
          <thead><tr><th>Project</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {bids.docs.map((b: any) => (
              <tr key={b.id}>
                <td>{typeof b.project === 'object' ? b.project?.title : b.project}</td>
                <td>${Number(b.amount || 0).toLocaleString()}</td>
                <td><span className="status-pill">{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
