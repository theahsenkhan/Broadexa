'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getCart, subscribeCart } from '@/lib/cart'

export function CartBadge() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setCount(getCart().length)
    return subscribeCart(() => setCount(getCart().length))
  }, [])

  if (count === 0) return null

  return (
    <Link className="btn btn-ghost" href="/cart">Cart ({count})</Link>
  )
}
