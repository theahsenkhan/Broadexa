'use client'

const KEY = 'broadexa-compare'
const EVENT = 'broadexa-compare-updated'
const MAX = 4

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

export function getCompare(): string[] {
  return read()
}

export function addToCompare(assetId: string) {
  const ids = read()
  if (ids.includes(assetId)) return
  write([...ids, assetId].slice(-MAX))
}

export function removeFromCompare(assetId: string) {
  write(read().filter((id) => id !== assetId))
}

export function clearCompare() {
  write([])
}

export function isInCompare(assetId: string): boolean {
  return read().includes(assetId)
}

export function subscribeCompare(callback: () => void): () => void {
  window.addEventListener(EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
