import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: { useAsTitle: 'id', group: 'Marketplace', defaultColumns: ['asset', 'buyer', 'rating'] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'asset', type: 'relationship', relationTo: 'assets', required: true },
    { name: 'order', type: 'relationship', relationTo: 'orders', required: true, unique: true, admin: { description: 'One review per order.' } },
    { name: 'buyer', type: 'relationship', relationTo: 'users', required: true, admin: { readOnly: true } },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'comment', type: 'textarea' },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation !== 'create' || !data) return data
        if (!req.user) throw new APIError('Sign in required', 401)

        const order = await req.payload.findByID({ collection: 'orders', id: data.order }).catch(() => null)
        if (!order) throw new APIError('Order not found', 404)
        const buyerId = typeof order.buyer === 'object' ? order.buyer.id : order.buyer
        if (String(buyerId) !== String(req.user.id)) throw new APIError('You can only review your own orders', 403)
        if (order.status !== 'paid' && order.status !== 'delivered') {
          throw new APIError('You can only review a paid order', 400)
        }
        const orderAssetId = typeof order.asset === 'object' ? order.asset.id : order.asset
        if (String(orderAssetId) !== String(data.asset)) {
          throw new APIError('Asset does not match the order', 400)
        }

        const existing = await req.payload.find({ collection: 'reviews', where: { order: { equals: data.order } }, limit: 1 })
        if (existing.docs.length > 0) throw new APIError('You already reviewed this order', 400)

        data.buyer = req.user.id
        return data
      },
    ],
  },
}
