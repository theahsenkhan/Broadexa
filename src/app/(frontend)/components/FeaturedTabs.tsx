'use client'

import { useState } from 'react'
import Link from 'next/link'

export type AssetCard = {
  id: string
  slug: string
  title: string
  price: number
  isFree?: boolean
  verified?: boolean
  designerName?: string
  thumbUrl?: string | null
}

function AssetGrid({ assets }: { assets: AssetCard[] }) {
  return (
    <div className="bento">
      {assets.map((a) => (
        <Link key={a.id} href={`/marketplace/${a.slug}`} className="card-a">
          <div className="thumb" style={a.thumbUrl ? { background: `center/cover no-repeat url(${a.thumbUrl})` } : undefined} />
          <div className="card-body">
            <h3>{a.title}</h3>
            {a.designerName && <div className="byline">{a.designerName}</div>}
            <div className="card-foot">
              <span className="price">{a.isFree ? 'Free' : `$${Number(a.price || 0).toLocaleString()}`}</span>
              {a.verified && <span className="badge verified">✓ Verified</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function FeaturedTabs({ featured, free }: { featured: AssetCard[]; free: AssetCard[] }) {
  const [tab, setTab] = useState<'featured' | 'free'>(featured.length > 0 ? 'featured' : 'free')

  if (featured.length === 0 && free.length === 0) return null

  const list = tab === 'featured' ? featured : free

  return (
    <div>
      {featured.length > 0 && free.length > 0 && (
        <div className="tab-switch">
          <button className={`tab-btn ${tab === 'featured' ? 'active' : ''}`} onClick={() => setTab('featured')}>
            Featured
          </button>
          <button className={`tab-btn ${tab === 'free' ? 'active' : ''}`} onClick={() => setTab('free')}>
            Free assets
          </button>
        </div>
      )}
      <AssetGrid assets={list} />
    </div>
  )
}
