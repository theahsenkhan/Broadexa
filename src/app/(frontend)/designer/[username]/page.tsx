import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'
import { AssetCard, type AssetCardData } from '../../components/AssetCard'
import { InviteToProjectButton } from '../../components/InviteToProjectButton'
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

function idOf(v: any) {
  return typeof v === 'object' && v !== null ? v.id : v
}

export default async function DesignerProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const payload = await getPayload({ config })
  const viewer = await getSessionUser().catch(() => null)

  const found = await payload.find({ collection: 'users', where: { username: { equals: username.toLowerCase() } }, limit: 1, depth: 1 })
  const designer: any = found.docs[0]
  if (!designer || designer.role !== 'designer') notFound()

  const assets = await payload.find({
    collection: 'assets',
    where: { designer: { equals: designer.id }, status: { equals: 'published' } },
    sort: '-createdAt',
    limit: 50,
    depth: 1,
  })
  const assetIds = assets.docs.map((a: any) => a.id)

  const [reviews, soldCount, acceptedBids] = await Promise.all([
    payload.find({ collection: 'reviews', where: { asset: { in: assetIds.length ? assetIds : [-1] }, status: { equals: 'published' } }, limit: 200 }),
    assetIds.length
      ? payload.count({ collection: 'orders', where: { asset: { in: assetIds }, status: { in: ['paid', 'delivered'] } } })
      : Promise.resolve({ totalDocs: 0 }),
    payload.find({ collection: 'bids', where: { designer: { equals: designer.id }, status: { equals: 'accepted' } }, depth: 1, limit: 200 }),
  ])

  const deliveredProjects = acceptedBids.docs.filter((b: any) => typeof b.project === 'object' && b.project?.status === 'delivered').length

  const avgRating = reviews.docs.length > 0
    ? (reviews.docs.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.docs.length).toFixed(1)
    : null

  const avatar: any = designer.avatar
  const initials = String(designer.name || '?').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
  const memberSince = new Date(designer.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="page-head">
          <div className="profile-head">
            {avatar?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="profile-photo" src={avatar.url} alt="" />
            ) : (
              <span className="profile-photo-fallback">{initials}</span>
            )}
            <div className="profile-head-info">
              <h1>{designer.studioName || designer.name}</h1>
              {designer.profession && <div className="profile-profession">{designer.profession}{designer.yearsExperience ? ` · ${designer.yearsExperience} years experience` : ''}</div>}
              <div className="listing-meta">
                {designer.verifiedDesigner && <span className="badge verified">✓ Verified designer</span>}
                {designer.certifiedDesigner && <span className="badge verified">★ Certified</span>}
                {avgRating && <span className="tag">★ {avgRating} ({reviews.docs.length} review{reviews.docs.length === 1 ? '' : 's'})</span>}
                {designer.country && <span className="tag">{designer.country}</span>}
                <span className="tag">Member since {memberSince}</span>
              </div>
            </div>
            <div className="profile-cta">
              <InviteToProjectButton designerUsername={designer.username} isLoggedIn={Boolean(viewer)} />
            </div>
          </div>

          {designer.bio && <p style={{ maxWidth: 640, color: 'var(--ink-soft)', marginTop: 20, lineHeight: 1.65 }}>{designer.bio}</p>}
          {designer.portfolioUrl && (
            <p style={{ fontSize: 13, marginTop: 8 }}>
              <a href={designer.portfolioUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--violet)', fontWeight: 600 }}>Portfolio / website ↗</a>
            </p>
          )}
          {designer.onAirCredits && (
            <p style={{ maxWidth: 640, color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>On-air credits: {designer.onAirCredits}</p>
          )}
          {Array.isArray(designer.skills) && designer.skills.length > 0 && (
            <div className="profile-skills">
              {designer.skills.map((s: any, i: number) => <span key={i} className="profile-skill">{s.skill}</span>)}
            </div>
          )}

          <div className="stat-row" style={{ marginTop: 28 }}>
            <div className="stat" style={{ textAlign: 'center' }}>
              <div className="num">{assets.totalDocs}</div>
              <div className="lbl">Assets published</div>
            </div>
            <div className="stat" style={{ textAlign: 'center' }}>
              <div className="num">{soldCount.totalDocs}</div>
              <div className="lbl">Assets sold</div>
            </div>
            <div className="stat" style={{ textAlign: 'center' }}>
              <div className="num">{deliveredProjects}</div>
              <div className="lbl">Projects delivered</div>
            </div>
            <div className="stat" style={{ textAlign: 'center' }}>
              <div className="num">{avgRating || '—'}</div>
              <div className="lbl">Average rating</div>
            </div>
          </div>
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
