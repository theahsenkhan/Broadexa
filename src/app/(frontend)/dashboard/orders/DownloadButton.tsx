'use client'

import { useState } from 'react'

export function DownloadButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)

  async function download() {
    setLoading(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/download`)
      const data = await res.json()
      if (res.ok && data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Could not generate download link')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className="btn btn-ghost" style={{ padding: '6px 14px', fontSize: 12.5 }} disabled={loading} onClick={download}>
      {loading ? 'Preparing…' : 'Download'}
    </button>
  )
}
