import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { cache } from 'react'
import type { Metadata } from 'next'
import { SiteNav } from '../../components/SiteNav'
import { SiteFooter } from '../../components/SiteFooter'
import { BuyBox } from './BuyBox'
import { getSessionUser } from '@/lib/session'

export const dynamic = 'force-dynamic'

const getAsset = cache(async (slug: string) => {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'assets',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  return result.docs[0] as any
})

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const asset = await getAsset(slug)
  if (!asset) return {}
  return {
    title: asset.seoTitle || `${asset.title} — Broadexa`,
    description: asset.seoDescription || asset.description?.slice(0, 160),
  }
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const asset = await getAsset(slug)
  if (!asset) notFound()

  const user = await getSessionUser().catch(() => null)
  const designer = typeof asset.designer === 'object' ? asset.designer : null

  const payload = await getPayload({ config })
  const reviews = await payload.find({ collection: 'reviews', where: { asset: { equals: asset.id }, status: { equals: 'published' } }, sort: '-createdAt', limit: 50, depth: 1 })
  const avgRating = reviews.docs.length > 0
    ? (reviews.docs.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.docs.length).toFixed(1)
    : null

  return (
    <>
      <SiteNav />
      <div className="container">
        <div className="listing">
          <div>
            <div className="preview">
              {asset.previewVideoUrl ? (
                <video src={asset.previewVideoUrl} controls />
              ) : Array.isArray(asset.gallery) && asset.gallery[0]?.url ? (
                <img src={asset.gallery[0].url} alt={asset.gallery[0].alt || asset.title} />
              ) : null}
            </div>

            <h1 className="listing-title">{asset.title}</h1>
            <div className="listing-meta">
              {typeof asset.engine === 'object' && <span className="tag">{asset.engine?.name}</span>}
              {typeof asset.category === 'object' && <span className="tag">{asset.category?.name}</span>}
              {Array.isArray(asset.genre) && asset.genre.map((g: any) => <span key={g.id || g} className="tag">{typeof g === 'object' ? g.name : g}</span>)}
              {asset.verified && <span className="badge verified">✓ Verified</span>}
              {asset.awardWinner && <span className="badge verified">🏆 Award winner</span>}
              {avgRating && <span className="tag">★ {avgRating} ({reviews.docs.length})</span>}
            </div>

            <p className="listing-desc">{asset.description}</p>

            <table className="specs">
              <tbody>
                <tr><td>Engine</td><td>{typeof asset.engine === 'object' ? asset.engine?.name : '—'}</td></tr>
                <tr><td>Built in</td><td>{asset.engineVersionBuilt || '—'}</td></tr>
                <tr><td>Opens in</td><td>{asset.engineVersionMin || 'Not specified'}</td></tr>
                <tr><td>Editable</td><td>{asset.editableNotes || 'Not specified'}</td></tr>
                <tr><td>Requirements</td><td>{asset.requirements || 'None listed'}</td></tr>
                <tr><td>Tracking-ready</td><td>{asset.trackingReady ? 'Yes' : 'No'}</td></tr>
                <tr><td>File size</td><td>{asset.fileSizeGB ? `${asset.fileSizeGB} GB` : '—'}</td></tr>
              </tbody>
            </table>

            {Array.isArray(asset.includes) && asset.includes.length > 0 && (
              <>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>What&apos;s included</h4>
                <div className="chips">
                  {asset.includes.map((inc: any, i: number) => (
                    <span key={i} className={`chip ${inc.included ? '' : 'off'}`}>
                      {inc.included ? '✓' : '✕'} {inc.item}
                    </span>
                  ))}
                </div>
              </>
            )}

            {reviews.docs.length > 0 && (
              <>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Reviews</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
                  {reviews.docs.map((r: any) => (
                    <div key={r.id} style={{ borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
                      <div style={{ fontSize: 13, color: 'var(--amber)' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                      {r.comment && <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginTop: 4 }}>{r.comment}</p>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <BuyBox asset={asset} isLoggedIn={Boolean(user)} />
        </div>

        {designer && designer.username && (
          <div style={{ paddingBottom: 60 }}>
            <Link href={`/designer/${designer.username}`} className="designer-card">
              {designer.avatar?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={designer.avatar.url} alt="" className="avatar" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="avatar" />
              )}
              <div>
                <div className="name">{designer.studioName || designer.name}</div>
                <div className="sub">{designer.verifiedDesigner ? 'Verified designer' : 'Designer'}</div>
              </div>
            </Link>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
