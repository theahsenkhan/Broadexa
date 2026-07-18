'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { clearCompare, getCompare, removeFromCompare, subscribeCompare } from '@/lib/compare'

type Asset = {
  id: string
  slug: string
  title: string
  price?: number
  isFree?: boolean
  verified?: boolean
  rating?: number
  reviewCount?: number
  engineVersionBuilt?: string
  engineVersionMin?: string
  fileSizeGB?: number
  editableNotes?: string
  requirements?: string
  trackingReady?: boolean
  engine?: { name?: string }
  category?: { name?: string }
  includes?: { item: string; included: boolean }[]
}

export function CompareView() {
  const [ids, setIds] = useState<string[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIds(getCompare())
    return subscribeCompare(() => setIds(getCompare()))
  }, [])

  useEffect(() => {
    if (ids.length === 0) {
      setAssets([])
      setLoading(false)
      return
    }
    setLoading(true)
    Promise.all(
      ids.map((id) => fetch(`/api/assets/${id}?depth=1`).then((res) => (res.ok ? res.json() : null))),
    ).then((docs) => {
      setAssets(docs.filter(Boolean))
      setLoading(false)
    })
  }, [ids])

  if (ids.length === 0) {
    return <div className="empty" style={{ marginBottom: 60 }}>Nothing to compare yet — hit &ldquo;+ Compare&rdquo; on a couple of listings first.</div>
  }
  if (loading) {
    return <div className="empty" style={{ marginBottom: 60 }}>Loading…</div>
  }

  const rows: { label: string; render: (a: Asset) => React.ReactNode }[] = [
    { label: 'Engine', render: (a) => a.engine?.name || '—' },
    { label: 'Built in version', render: (a) => a.engineVersionBuilt || '—' },
    { label: 'Opens in (min version)', render: (a) => a.engineVersionMin || '—' },
    { label: 'Category', render: (a) => a.category?.name || '—' },
    { label: 'Price', render: (a) => (a.isFree ? 'Free' : `$${Number(a.price || 0).toLocaleString()}`) },
    { label: 'Rating', render: (a) => (a.rating ? `★ ${a.rating.toFixed(1)} (${a.reviewCount || 0})` : '—') },
    { label: 'Verified', render: (a) => (a.verified ? '✓ Verified' : '—') },
    { label: 'Tracking-ready', render: (a) => (a.trackingReady ? 'Yes' : 'No') },
    { label: 'File size', render: (a) => (a.fileSizeGB ? `${a.fileSizeGB} GB` : '—') },
    {
      label: "What's included",
      render: (a) => (a.includes?.length ? a.includes.map((i) => i.item).join(', ') : '—'),
    },
    { label: 'What is editable', render: (a) => a.editableNotes || '—' },
    { label: 'Needs to run', render: (a) => a.requirements || '—' },
  ]

  return (
    <div style={{ paddingBottom: 60 }}>
      <div className="results-head">
        <span>{assets.length} asset{assets.length === 1 ? '' : 's'}</span>
        <button className="btn btn-ghost" onClick={clearCompare}>Clear all</button>
      </div>
      <div className="compare-scroll">
        <table className="compare-table">
          <thead>
            <tr>
              <th></th>
              {assets.map((a) => (
                <th key={a.id}>
                  <Link href={`/marketplace/${a.slug}`} style={{ color: 'var(--violet)' }}>{a.title}</Link>
                  <div>
                    <button className="a-compare" style={{ marginTop: 6 }} onClick={() => removeFromCompare(a.id)}>Remove</button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                {assets.map((a) => <td key={a.id}>{row.render(a)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
