import { getPayload } from 'payload'
import config from '@payload-config'
import { getSessionUser } from '@/lib/session'
import { DownloadButton } from './DownloadButton'

export const dynamic = 'force-dynamic'

const statusClass: Record<string, string> = {
  paid: 'good',
  delivered: 'good',
  pending: 'warn',
  'invoice-requested': 'warn',
  refunded: '',
  disputed: '',
}

export default async function OrdersPage() {
  const user = await getSessionUser()
  if (!user) return null
  const payload = await getPayload({ config })

  const orders = await payload.find({
    collection: 'orders',
    where: { buyer: { equals: user.id } },
    sort: '-createdAt',
    limit: 100,
    depth: 1,
  })

  return (
    <div>
      <h1 style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>Orders</h1>

      {orders.docs.length === 0 ? (
        <div className="empty">No orders yet. Browse the marketplace to get started.</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.docs.map((o: any) => (
              <tr key={o.id}>
                <td>{typeof o.asset === 'object' ? o.asset?.title : o.asset}</td>
                <td>{o.orderType}</td>
                <td>${Number(o.amount || 0).toLocaleString()}</td>
                <td><span className={`status-pill ${statusClass[o.status] || ''}`}>{o.status}</span></td>
                <td>{(o.status === 'paid' || o.status === 'delivered') && <DownloadButton orderId={o.id} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
