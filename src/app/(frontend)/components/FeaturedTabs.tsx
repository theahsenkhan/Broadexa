'use client'

import { useState } from 'react'
import { AssetCard, type AssetCardData } from './AssetCard'

export function FeaturedTabs({ featured, free, isLoggedIn }: { featured: AssetCardData[]; free: AssetCardData[]; isLoggedIn: boolean }) {
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
      <div className="grid-dense">
        {list.map((a, i) => (
          <AssetCard key={a.id} asset={a} index={i} isLoggedIn={isLoggedIn} />
        ))}
      </div>
    </div>
  )
}
