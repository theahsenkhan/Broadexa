import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function DesignerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  const designer: any = await payload.findByID({ collection: 'users', id }).catch(() => null)
  if (!designer || designer.role !== 'designer') notFound()

  const assets = await payload.find({
    collection: 'assets',
    where: { designer: { equals: id }, status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  })

  const reviews = await payload.find({
    collection: 'reviews',
    where: { asset: { in: assets.docs.map((a: any) => a.id) } },
    limit: 200,
  })
  const avgRating = reviews.docs.length > 0
    ? (reviews.docs.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.docs.length).toFixed(1)
    : null

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="avatar" style={{ width: 64, height: 64, marginBottom: 16 }} />
          <h1>{designer.studioName || designer.name}</h1>
          <div className="listing-meta" style={{ marginTop: 10 }}>
            {designer.verifiedDesigner && <span className="badge verified">✓ Verified designer</span>}
            {designer.certifiedDesigner && <span className="badge verified">★ Certified</span>}
            {avgRating && <span className="tag">★ {avgRating} ({reviews.docs.length} review{reviews.docs.length === 1 ? '' : 's'})</span>}
            {designer.country && <span className="tag">{designer.country}</span>}
          </div>
          {designer.bio && <p style={{ maxWidth: 640, color: 'var(--ink-soft)', marginTop: 16, lineHeight: 1.65 }}>{designer.bio}</p>}
          {designer.onAirCredits && (
            <p style={{ maxWidth: 640, color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>On-air credits: {designer.onAirCredits}</p>
          )}
        </div>

        <div className="results-head">
          <span>{assets.totalDocs} listing{assets.totalDocs === 1 ? '' : 's'}</span>
        </div>

        {assets.docs.length === 0 ? (
          <div className="empty" style={{ marginBottom: 60 }}>No published listings yet.</div>
        ) : (
          <div className="grid" style={{ paddingBottom: 60 }}>
            {assets.docs.map((a: any) => (
              <Link key={a.id} href={`/marketplace/${a.slug}`} className="card-a">
                <div className="thumb" />
                <div className="card-body">
                  <h3>{a.title}</h3>
                  <div className="card-foot">
                    <span className="price">{a.isFree ? 'Free' : `$${Number(a.price || 0).toLocaleString()}`}</span>
                    {a.verified && <span className="badge verified">✓ Verified</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
