import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'
import { AssetCard, type AssetCardData } from '../../components/AssetCard'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

function toCardData(a: any): AssetCardData {
  return {
    id: String(a.id),
    slug: a.slug,
    title: a.title,
    price: a.price,
    isFree: a.isFree,
    originalPrice: a.originalPrice,
    dealLabel: a.dealLabel,
    ribbon: a.ribbon,
    verified: a.verified,
    rating: a.rating,
    reviewCount: a.reviewCount,
    categoryName: typeof a.category === 'object' ? a.category?.name : undefined,
    engineLabel: typeof a.engine === 'object' ? `${a.engine?.shortLabel || a.engine?.name || ''} ${a.engineVersionBuilt || ''}`.trim() : undefined,
    thumbUrl: Array.isArray(a.gallery) && typeof a.gallery[0] === 'object' ? a.gallery[0]?.url : null,
  }
}

export default async function DesignerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })
  const viewer = await getSessionUser().catch(() => null)

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
    where: { asset: { in: assets.docs.map((a: any) => a.id) }, status: { equals: 'published' } },
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
          <div className="grid-dense" style={{ paddingBottom: 60 }}>
            {assets.docs.map((a: any, i: number) => (
              <AssetCard key={a.id} asset={toCardData(a)} index={i} isLoggedIn={Boolean(viewer)} />
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
