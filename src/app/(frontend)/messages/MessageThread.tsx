'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function MessageThread({
  contextType,
  contextId,
  messages,
  currentUserId,
}: {
  contextType: 'order' | 'bid'
  contextId: string
  messages: any[]
  currentUserId: string
}) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function send() {
    if (!body.trim()) return
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contextType, contextId: Number(contextId), body }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.errors?.[0]?.message || data?.message || 'Message could not be sent')
      setBody('')
      router.refresh()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 420, overflowY: 'auto' }}>
        {messages.length === 0 ? (
          <div className="empty">No messages yet — say hello.</div>
        ) : (
          messages.map((m) => {
            const sender = typeof m.sender === 'object' ? m.sender : null
            const mine = String(sender?.id || m.sender) === String(currentUserId)
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: mine ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  background: mine ? 'var(--ink)' : 'var(--line)',
                  color: mine ? '#fff' : 'var(--ink)',
                  borderRadius: 12,
                  padding: '8px 12px',
                }}
              >
                <div style={{ fontSize: 13 }}>{m.body}</div>
                <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3 }}>{sender?.name || 'User'} · {new Date(m.createdAt).toLocaleString()}</div>
              </div>
            )
          })
        )}
      </div>

      {error && <div className="form-error">{error}</div>}

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Write a message… (no contact details — keep it on Broadexa)"
          style={{ flex: 1, fontSize: 14, padding: '10px 12px', border: '1.5px solid var(--line-strong)', borderRadius: 9 }}
        />
        <button className="btn btn-primary" disabled={loading} onClick={send}>
          {loading ? 'Sending…' : 'Send'}
        </button>
      </div>
    </div>
  )
}
