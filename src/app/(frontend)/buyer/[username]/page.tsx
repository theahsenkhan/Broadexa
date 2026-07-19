import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'

export const dynamic = 'force-dynamic'

export default async function BuyerProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const payload = await getPayload({ config })

  const found = await payload.find({ collection: 'users', where: { username: { equals: username.toLowerCase() } }, limit: 1 })
  const buyer: any = found.docs[0]
  if (!buyer || buyer.role !== 'buyer') notFound()

  const reviewsWritten = await payload.count({ collection: 'reviews', where: { buyer: { equals: buyer.id }, status: { equals: 'published' } } })

  const avatar: any = buyer.avatar
  const initials = String(buyer.name || '?').split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()
  const memberSince = new Date(buyer.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

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
              <h1>{buyer.name}</h1>
              <div className="listing-meta">
                {buyer.country && <span className="tag">{buyer.country}</span>}
                <span className="tag">Member since {memberSince}</span>
              </div>
            </div>
          </div>

          <div className="stat-row" style={{ marginTop: 28, maxWidth: 320 }}>
            <div className="stat" style={{ textAlign: 'center' }}>
              <div className="num">{reviewsWritten.totalDocs}</div>
              <div className="lbl">Reviews written</div>
            </div>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
