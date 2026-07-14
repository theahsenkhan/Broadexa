'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function BuyBox({ asset, isLoggedIn }: { asset: any; isLoggedIn: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function startCheckout(orderType: 'standard' | 'exclusive') {
    if (!isLoggedIn) {
      router.push(`/login?next=/marketplace/${asset.slug}`)
      return
    }
    setError('')
    setLoading(orderType)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: asset.id, orderType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Checkout failed')
      if (data.url) window.location.href = data.url
    } catch (e: any) {
      setError(e.message)
      setLoading(null)
    }
  }

  async function requestInvoice() {
    if (!isLoggedIn) {
      router.push(`/login?next=/marketplace/${asset.slug}`)
      return
    }
    setError('')
    setLoading('invoice')
    try {
      const res = await fetch('/api/orders/invoice-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: asset.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      router.push('/dashboard/orders')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="buybox">
      <div className="buybox-price">
        {asset.isFree ? 'Free' : `$${Number(asset.price || 0).toLocaleString()}`}
        <small>Standard licence, non-exclusive</small>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="buy-path">
        <h5>Buy now</h5>
        <p>Instant download after purchase. Standard, non-exclusive licence.</p>
        <button className="btn btn-primary btn-block" disabled={loading !== null} onClick={() => startCheckout('standard')}>
          {loading === 'standard' ? 'Redirecting…' : asset.isFree ? 'Get it free' : 'Buy now'}
        </button>
      </div>

      {asset.exclusiveAvailable && (
        <div className="buy-path">
          <h5>Exclusive buyout</h5>
          <p>Take this scene off the market — the designer delists it after sale. ${Number(asset.exclusivePrice || 0).toLocaleString()}</p>
          <button className="btn btn-dark btn-block" disabled={loading !== null} onClick={() => startCheckout('exclusive')}>
            {loading === 'exclusive' ? 'Redirecting…' : 'Buy exclusive'}
          </button>
        </div>
      )}

      <div className="buy-path">
        <h5>Request an invoice</h5>
        <p>For studios that pay via PO or bank transfer. We&apos;ll follow up by email.</p>
        <button className="btn btn-ghost btn-block" disabled={loading !== null} onClick={requestInvoice}>
          {loading === 'invoice' ? 'Sending…' : 'Request invoice'}
        </button>
      </div>
    </div>
  )
}
