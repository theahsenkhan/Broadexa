'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function BidRow({ bid, projectId }: { bid: any; projectId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const designer = typeof bid.designer === 'object' ? bid.designer : null

  async function setStatus(status: 'accepted' | 'declined') {
    setLoading(true)
    try {
      await fetch(`/api/bids/${bid.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (status === 'accepted') {
        await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'awarded' }),
        })
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr>
      <td>{designer?.studioName || designer?.name || 'Designer'}</td>
      <td>${bid.amount}</td>
      <td>{bid.timelineDays ? `${bid.timelineDays}d` : '—'}</td>
      <td><span className="status-pill">{bid.status}</span></td>
      <td>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {bid.status === 'submitted' && (
            <>
              <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 11.5 }} disabled={loading} onClick={() => setStatus('accepted')}>Accept</button>
              <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11.5 }} disabled={loading} onClick={() => setStatus('declined')}>Decline</button>
            </>
          )}
          {(bid.status === 'submitted' || bid.status === 'accepted') && (
            <Link href={`/messages/bid/${bid.id}`} style={{ fontSize: 11.5, color: 'var(--violet)', fontWeight: 600 }}>Message</Link>
          )}
        </div>
      </td>
    </tr>
  )
}
