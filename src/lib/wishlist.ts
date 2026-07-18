'use client'

const EVENT = 'broadexa-wishlist-updated'

let cache: Set<string> = new Set()
let loaded = false
let loading: Promise<Set<string>> | null = null

export function getWishlistIds(): Set<string> {
  return cache
}

export function isWishlistLoaded(): boolean {
  return loaded
}

export async function loadWishlist(): Promise<Set<string>> {
  if (loaded) return cache
  if (loading) return loading
  loading = fetch('/api/wishlist')
    .then((res) => (res.ok ? res.json() : { assetIds: [] }))
    .then((data) => {
      cache = new Set((data.assetIds || []).map(String))
      loaded = true
      window.dispatchEvent(new Event(EVENT))
      return cache
    })
    .catch(() => cache)
    .finally(() => {
      loading = null
    })
  return loading
}

export async function toggleWishlist(assetId: string): Promise<{ wishlisted: boolean; count: number } | null> {
  const res = await fetch('/api/wishlist', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ assetId }),
  })
  if (!res.ok) return null
  const data = await res.json()
  if (data.wishlisted) cache.add(String(assetId))
  else cache.delete(String(assetId))
  window.dispatchEvent(new Event(EVENT))
  return data
}

export function subscribeWishlist(callback: () => void): () => void {
  window.addEventListener(EVENT, callback)
  return () => window.removeEventListener(EVENT, callback)
}
