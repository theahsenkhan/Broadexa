'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getWishlistIds, loadWishlist, subscribeWishlist, toggleWishlist } from '@/lib/wishlist'
import { addToCompare, isInCompare, removeFromCompare } from '@/lib/compare'

export type AssetCardData = {
  id: string
  slug: string
  title: string
  price?: number | null
  isFree?: boolean
  originalPrice?: number | null
  dealLabel?: string
  ribbon?: string
  verified?: boolean
  rating?: number | null
  reviewCount?: number | null
  designerName?: string
  categoryName?: string
  engineLabel?: string
  thumbUrl?: string | null
}

const DEAL_LABELS: Record<string, string> = { intro: 'Intro price', launch: 'Launch price', featured: 'Featured' }
const RIBBON_LABELS: Record<string, string> = {
  'editors-choice': "Editor's Choice",
  'best-seller': 'Best Seller',
  'best-value': 'Best Value',
  new: 'New',
}
const GRADIENTS = [
  'linear-gradient(135deg,#1B2740,#3E5A8F)',
  'linear-gradient(135deg,#2B1D3E,#7E4FA6)',
  'linear-gradient(135deg,#123244,#2E7DA6)',
  'linear-gradient(135deg,#1F1B33,#5A4A9E)',
  'linear-gradient(135deg,#232946,#3E5A8F)',
]
const ICONS = ['ic-monitor', 'ic-ar', 'ic-signal', 'ic-wave', 'ic-play']

function hashIndex(id: string, mod: number) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 997
  return h % mod
}

export function AssetCard({ asset, index, isLoggedIn }: { asset: AssetCardData; index?: number; isLoggedIn: boolean }) {
  const router = useRouter()
  const i = index ?? hashIndex(asset.id, GRADIENTS.length)
  const [wishlisted, setWishlisted] = useState(false)
  const [compared, setCompared] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setCompared(isInCompare(asset.id))
    if (!isLoggedIn) return
    setWishlisted(getWishlistIds().has(String(asset.id)))
    loadWishlist()
    const unsub = subscribeWishlist(() => setWishlisted(getWishlistIds().has(String(asset.id))))
    return unsub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset.id, isLoggedIn])

  async function onWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      router.push(`/login?next=/marketplace`)
      return
    }
    if (busy) return
    setBusy(true)
    await toggleWishlist(asset.id)
    setBusy(false)
  }

  function onCompare(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (compared) {
      removeFromCompare(asset.id)
      setCompared(false)
    } else {
      addToCompare(asset.id)
      setCompared(true)
    }
  }

  const ribbonLabel = asset.ribbon && asset.ribbon !== 'none' ? RIBBON_LABELS[asset.ribbon] : null
  const dealLabel = asset.dealLabel && asset.dealLabel !== 'none' ? DEAL_LABELS[asset.dealLabel] : null
  const rating = asset.rating ? Math.round(asset.rating) : 0

  return (
    <Link href={`/marketplace/${asset.slug}`} className="a-card">
      <div className="a-thumb">
        {asset.thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ph" src={asset.thumbUrl} alt="" />
        ) : (
          <>
            <div className="ph" style={{ background: GRADIENTS[i % GRADIENTS.length] }} />
            <div className="thumb-dots" />
            <div className="thumb-icon-wrap">
              <svg><use href={`#${ICONS[i % ICONS.length]}`} /></svg>
            </div>
          </>
        )}
        {asset.categoryName && <div className="a-cat">{asset.categoryName}</div>}
        {ribbonLabel && <div className="a-ribbon">{ribbonLabel}</div>}
        <button type="button" className={`a-wish${wishlisted ? ' active' : ''}`} onClick={onWishlist} aria-label="Save to wishlist" disabled={busy}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
          </svg>
        </button>
      </div>
      <div className="a-body">
        <div className="a-title">{asset.title}</div>
        {(rating > 0 || asset.reviewCount) && (
          <div className="a-rating">
            <span className="stars">
              {[1, 2, 3, 4, 5].map((n) => (
                <svg key={n} viewBox="0 0 24 24" className={n > rating ? 'off' : ''} fill={n <= rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l2.9 6.5 7.1.6-5.4 4.7 1.7 7-6.3-3.9-6.3 3.9 1.7-7L2 9.1l7.1-.6z" />
                </svg>
              ))}
            </span>
            <span>{(asset.rating || 0).toFixed(1)} {asset.reviewCount ? `(${asset.reviewCount})` : ''}</span>
          </div>
        )}
        <div className="a-meta">
          {asset.engineLabel && <span className="a-badge mono">{asset.engineLabel}</span>}
          {asset.verified && (
            <span className="a-badge verified">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg> Verified
            </span>
          )}
        </div>
        <div className="a-foot">
          <div className="a-price-wrap">
            {asset.isFree ? (
              <span className="a-price free">Free</span>
            ) : (
              <>
                <div className="a-price-row">
                  <span className="a-price">${Number(asset.price || 0).toLocaleString()}</span>
                  {asset.originalPrice && asset.originalPrice > (asset.price || 0) && (
                    <span className="a-orig">${asset.originalPrice.toLocaleString()}</span>
                  )}
                </div>
                {dealLabel && asset.originalPrice && <div className="a-deal">{dealLabel}</div>}
              </>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            {asset.designerName && <span className="a-designer">{asset.designerName}</span>}
            <button type="button" className="a-compare" onClick={onCompare}>{compared ? '✓ Comparing' : '+ Compare'}</button>
          </div>
        </div>
      </div>
    </Link>
  )
}
