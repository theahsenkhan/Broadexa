'use client'

const KEY = 'broadexa-cart'
const EVENT = 'broadexa-cart-updated'

function read(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function write(ids: string[]) {
  window.localStorage.setItem(KEY, JSON.stringify(ids))
  window.dispatchEvent(new Event(EVENT))
}

export function getCart(): string[] {
  return read()
}

export function addToCart(assetId: string) {
  const ids = read()
  if (!ids.includes(assetId)) write([...ids, assetId])
}

export function removeFromCart(assetId: string) {
  write(read().filter((id) => id !== assetId))
}

export function clearCart() {
  write([])
}

export function isInCart(assetId: string): boolean {
  return read().includes(assetId)
}

export function subscribeCart(callback: () => void): () => void {
  window.addEventListener(EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
