import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getSessionUser } from '@/lib/session'
import { PrintButton } from './PrintButton'

export const dynamic = 'force-dynamic'

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) redirect(`/login?next=/dashboard/orders/${id}/invoice`)

  const payload = await getPayload({ config })
  const order: any = await payload.findByID({ collection: 'orders', id, depth: 2 }).catch(() => null)
  if (!order) notFound()

  const buyerId = typeof order.buyer === 'object' ? order.buyer.id : order.buyer
  if (String(buyerId) !== String(user.id) && user.role !== 'admin') notFound()
  if (order.status !== 'paid' && order.status !== 'delivered') notFound()

  const asset = typeof order.asset === 'object' ? order.asset : null
  const buyer = typeof order.buyer === 'object' ? order.buyer : null
  const designer = asset && typeof asset.designer === 'object' ? asset.designer : null
  const commissionAmount = (Number(order.amount || 0) * (order.commissionPct || 20)) / 100
  const designerAmount = Number(order.amount || 0) - commissionAmount

  return (
    <div className="invoice-shell">
      <div className="invoice-noprint" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link href={`/dashboard/orders/${id}`} style={{ color: 'var(--violet)', fontWeight: 600, fontSize: 13.5 }}>← Back to order</Link>
        <PrintButton />
      </div>
      <div className="invoice-doc">
        <div className="invoice-head">
          <div className="logo">BROADEXA</div>
          <div style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
            <div>Receipt #{order.id}</div>
            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="invoice-parties">
          <div>
            <div className="invoice-label">Billed to</div>
            <div>{buyer?.name}</div>
            <div>{buyer?.email}</div>
          </div>
          <div>
            <div className="invoice-label">Sold by</div>
            <div>{designer?.studioName || designer?.name || 'Broadexa designer'}</div>
          </div>
        </div>

        <table className="specs" style={{ marginTop: 28 }}>
          <tbody>
            <tr><td>Item</td><td>{asset?.title}</td></tr>
            <tr><td>Licence</td><td>{order.orderType === 'exclusive' ? 'Exclusive buyout' : 'Standard, non-exclusive'}</td></tr>
            <tr><td>Amount</td><td>${Number(order.amount || 0).toLocaleString()}</td></tr>
            <tr><td>Platform commission ({order.commissionPct || 20}%)</td><td>${commissionAmount.toFixed(2)}</td></tr>
            <tr><td>Designer receives</td><td>${designerAmount.toFixed(2)}</td></tr>
            <tr><td>Status</td><td>Paid</td></tr>
          </tbody>
        </table>

        <p style={{ fontSize: 11.5, color: 'var(--muted)', marginTop: 32 }}>
          This is a system-generated receipt for a Broadexa marketplace transaction. Questions? See our refund policy at /refund-policy.
        </p>
      </div>
    </div>
  )
}
