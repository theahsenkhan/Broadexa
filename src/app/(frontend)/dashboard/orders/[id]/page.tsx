import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/session'
import { MessageThread } from '../../../messages/MessageThread'
import { DownloadButton } from '../DownloadButton'
import { ReviewForm } from './ReviewForm'

export const dynamic = 'force-dynamic'

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) redirect(`/login?next=/dashboard/orders/${id}`)

  const payload = await getPayload({ config })
  const order: any = await payload.findByID({ collection: 'orders', id, depth: 2 }).catch(() => null)
  if (!order) notFound()

  const buyerId = typeof order.buyer === 'object' ? order.buyer.id : order.buyer
  if (String(buyerId) !== String(user.id) && user.role !== 'admin') notFound()

  const asset = typeof order.asset === 'object' ? order.asset : null
  const canMessage = order.status === 'paid' || order.status === 'delivered'

  const existingReview = canMessage
    ? await payload.find({ collection: 'reviews', where: { order: { equals: id } }, limit: 1 }).catch(() => ({ docs: [] as any[] }))
    : { docs: [] as any[] }

  const messages = canMessage
    ? await payload.find({
        collection: 'messages',
        where: { contextType: { equals: 'order' }, contextId: { equals: Number(id) } },
        sort: 'createdAt',
        limit: 200,
        depth: 1,
      })
    : { docs: [] as any[] }

  return (
    <div>
      <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20, marginBottom: 6 }}>{asset?.title || 'Order'}</h1>
      <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 20 }}>
        ${Number(order.amount || 0).toLocaleString()} · <span className="status-pill">{order.status}</span>
      </p>

      {(order.status === 'paid' || order.status === 'delivered') && (
        <div style={{ marginBottom: 24, display: 'flex', gap: 10 }}>
          <DownloadButton orderId={order.id} />
          <Link className="btn btn-ghost" href={`/dashboard/orders/${order.id}/invoice`}>View receipt</Link>
        </div>
      )}

      {canMessage && asset && (
        existingReview.docs.length > 0 ? (
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Your review</h4>
            <p style={{ fontSize: 13.5, color: 'var(--muted)' }}>
              {'★'.repeat(existingReview.docs[0].rating)}{'☆'.repeat(5 - existingReview.docs[0].rating)} {existingReview.docs[0].comment}
            </p>
          </div>
        ) : (
          <ReviewForm orderId={id} assetId={String(asset.id)} />
        )
      )}

      {canMessage && (
        <div style={{ maxWidth: 560 }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Message the designer</h4>
          <MessageThread contextType="order" contextId={id} messages={messages.docs} currentUserId={String(user.id)} />
        </div>
      )}
    </div>
  )
}
