'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearCompare, getCompare, subscribeCompare } from '@/lib/compare'

export function CompareBar() {
  const router = useRouter()
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    setIds(getCompare())
    return subscribeCompare(() => setIds(getCompare()))
  }, [])

  if (ids.length < 2) return null

  return (
    <div className="compare-bar">
      <span>{ids.length} asset{ids.length === 1 ? '' : 's'} selected to compare</span>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn btn-ghost" onClick={clearCompare}>Clear</button>
        <button className="btn btn-primary" onClick={() => router.push('/compare')}>Compare now</button>
      </div>
    </div>
  )
}
