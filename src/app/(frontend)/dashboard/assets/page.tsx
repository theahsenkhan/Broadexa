import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

const statusClass: Record<string, string> = {
  published: 'good',
  pending: 'warn',
  draft: '',
  delisted: '',
}

export default async function MyAssetsPage() {
  const user = await getSessionUser()
  if (!user) return null
  const payload = await getPayload({ config })

  const assets = await payload.find({
    collection: 'assets',
    where: { designer: { equals: user.id } },
    sort: '-createdAt',
    limit: 100,
  })

  return (
    <div>
      <div className="results-head" style={{ marginBottom: 4 }}>
        <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20 }}>My assets</h1>
        <Link className="btn btn-primary" href="/dashboard/new-asset">Upload asset</Link>
      </div>

      {assets.docs.length === 0 ? (
        <div className="empty">You haven&apos;t listed anything yet.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Status</th>
              <th>Verified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {assets.docs.map((a: any) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.isFree ? 'Free' : `$${Number(a.price || 0).toLocaleString()}`}</td>
                <td><span className={`status-pill ${statusClass[a.status] || ''}`}>{a.status}</span></td>
                <td>{a.verified ? '✓' : '—'}</td>
                <td>
                  <Link href={`/admin/collections/assets/${a.id}`} style={{ color: 'var(--violet)', fontSize: 12.5, fontWeight: 600 }}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
