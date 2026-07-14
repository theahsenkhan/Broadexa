import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function DashboardOverview() {
  const user = await getSessionUser()
  if (!user) return null
  const payload = await getPayload({ config })

  const isDesigner = user.role === 'designer' || user.role === 'admin'

  const [assets, orders, projects] = await Promise.all([
    isDesigner
      ? payload.find({ collection: 'assets', where: { designer: { equals: user.id } }, limit: 100 })
      : Promise.resolve({ docs: [] as any[], totalDocs: 0 }),
    payload.find({ collection: 'orders', where: { buyer: { equals: user.id } }, limit: 100 }),
    payload.find({ collection: 'projects', where: { postedBy: { equals: user.id } }, limit: 100 }),
  ])

  const publishedCount = assets.docs.filter((a: any) => a.status === 'published').length
  const pendingCount = assets.docs.filter((a: any) => a.status === 'pending').length

  return (
    <div>
      <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 22, marginBottom: 20 }}>
        Welcome back, {user.name}
      </h1>

      <div className="stat-row">
        {isDesigner && (
          <>
            <div className="stat">
              <div className="num">{assets.totalDocs}</div>
              <div className="lbl">Total listings</div>
            </div>
            <div className="stat">
              <div className="num">{publishedCount}</div>
              <div className="lbl">Published</div>
            </div>
            <div className="stat">
              <div className="num">{pendingCount}</div>
              <div className="lbl">Pending review</div>
            </div>
          </>
        )}
        <div className="stat">
          <div className="num">{orders.totalDocs}</div>
          <div className="lbl">Orders placed</div>
        </div>
        <div className="stat">
          <div className="num">{projects.totalDocs}</div>
          <div className="lbl">Projects posted</div>
        </div>
      </div>

      {isDesigner && (
        <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>
          <Link href="/dashboard/new-asset" style={{ color: 'var(--violet)', fontWeight: 600 }}>Upload a new asset</Link> to get it in front of buyers.
        </p>
      )}
    </div>
  )
}
