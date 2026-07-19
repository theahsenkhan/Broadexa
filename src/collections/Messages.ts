import type { CollectionConfig, Where } from 'payload'
import { APIError } from 'payload'
import { findContactInfo } from '../lib/contactFilter'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

// Threads are scoped to a real transaction — a paid Order or an accepted Bid —
// never a free-standing DM. Participants are computed server-side from that
// context, not client-supplied, so a thread can't be created between two
// users who have no actual business relationship.
export const Messages: CollectionConfig = {
  slug: 'messages',
  admin: { useAsTitle: 'id', group: 'Content', defaultColumns: ['contextType', 'contextId', 'sender', 'createdAt'] },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) {
        const where: Where = { participants: { equals: req.user.id } }
        return where
      }
      return false
    },
    create: ({ req }) => Boolean(req.user),
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'contextType', type: 'select', required: true, options: ['order', 'bid'] },
    { name: 'contextId', type: 'number', required: true },
    { name: 'participants', type: 'relationship', relationTo: 'users', hasMany: true, admin: { readOnly: true } },
    { name: 'sender', type: 'relationship', relationTo: 'users', required: true, admin: { readOnly: true } },
    { name: 'body', type: 'textarea', required: true },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation !== 'create' || !data) return data
        if (!req.user) throw new APIError('Sign in required', 401)

        const found = findContactInfo(data.body || '')
        if (found) {
          throw new APIError(
            `Messages can't include contact details — that looked like ${found}. Keep communication on Broadexa.`,
            400,
          )
        }

        let participantIds: (string | number)[] = []
        if (data.contextType === 'order') {
          const order = await req.payload.findByID({ collection: 'orders', id: data.contextId, depth: 1 }).catch(() => null)
          if (!order) throw new APIError('Order not found', 404)
          const asset: any = typeof order.asset === 'object' ? order.asset : await req.payload.findByID({ collection: 'assets', id: order.asset })
          const buyerId = typeof order.buyer === 'object' ? order.buyer.id : order.buyer
          const designerId = typeof asset.designer === 'object' ? asset.designer.id : asset.designer
          if (order.status !== 'paid' && order.status !== 'delivered') {
            throw new APIError('Messaging unlocks once the order is paid', 400)
          }
          participantIds = [buyerId, designerId]
        } else if (data.contextType === 'bid') {
          const bid = await req.payload.findByID({ collection: 'bids', id: data.contextId, depth: 1 }).catch(() => null)
          if (!bid) throw new APIError('Bid not found', 404)
          // Open as soon as a bid exists, so the designer and project owner can
          // negotiate price/timeline before the owner decides — not just after
          // acceptance. Still closed once a bid has been withdrawn or declined.
          if (bid.status !== 'submitted' && bid.status !== 'accepted') {
            throw new APIError('Messaging is only available while a bid is active', 400)
          }
          const project: any = typeof bid.project === 'object' ? bid.project : await req.payload.findByID({ collection: 'projects', id: bid.project })
          const designerId = typeof bid.designer === 'object' ? bid.designer.id : bid.designer
          const posterId = typeof project.postedBy === 'object' ? project.postedBy.id : project.postedBy
          participantIds = [posterId, designerId]
        } else {
          throw new APIError('Invalid message context', 400)
        }

        if (!participantIds.map(String).includes(String(req.user.id))) {
          throw new APIError('You are not part of this conversation', 403)
        }

        data.participants = participantIds
        data.sender = req.user.id
        return data
      },
    ],
  },
}
