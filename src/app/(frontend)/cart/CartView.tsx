'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCart, removeFromCart, subscribeCart } from '@/lib/cart'

export function CartView({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter()
  const [assets, setAssets] = useState<any[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function load() {
    const ids = getCart()
    if (ids.length === 0) {
      setAssets([])
      return
    }
    const params = new URLSearchParams()
    params.set('where[id][in]', ids.join(','))
    params.set('depth', '1')
    params.set('limit', '100')
    const res = await fetch(`/api/assets?${params.toString()}`)
    const data = await res.json()
    setAssets(data.docs || [])
  }

  useEffect(() => {
    load()
    return subscribeCart(load)
  }, [])

  function remove(id: string) {
    removeFromCart(id)
  }

  async function checkout() {
    if (!isLoggedIn) {
      router.push('/login?next=/cart')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetIds: getCart() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      if (data.url) window.location.href = data.url
    } catch (e: any) {
      setError(e.message)
      setLoading(false)
    }
  }

  if (assets === null) return <div className="empty">Loading…</div>

  if (assets.length === 0) {
    return (
      <div className="empty" style={{ marginBottom: 60 }}>
        Your cart is empty. <Link href="/marketplace" style={{ color: 'var(--violet)', fontWeight: 600 }}>Browse the marketplace</Link>
      </div>
    )
  }

  const total = assets.reduce((sum, a) => sum + Number(a.price || 0), 0)

  return (
    <div style={{ maxWidth: 640, paddingBottom: 60 }}>
      {error && <div className="form-error">{error}</div>}
      <table className="table">
        <thead><tr><th>Asset</th><th>Price</th><th></th></tr></thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.id}>
              <td><Link href={`/marketplace/${a.slug}`} style={{ color: 'var(--ink)' }}>{a.title}</Link></td>
              <td>${Number(a.price || 0).toLocaleString()}</td>
              <td><button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 12 }} onClick={() => remove(String(a.id))}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <div className="buybox-price">${total.toLocaleString()}</div>
        <button className="btn btn-primary" disabled={loading} onClick={checkout}>
          {loading ? 'Redirecting…' : 'Checkout'}
        </button>
      </div>
    </div>
  )
}
