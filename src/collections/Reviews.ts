import type { CollectionConfig, Where } from 'payload'
import { APIError } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: { useAsTitle: 'id', group: 'Marketplace', defaultColumns: ['asset', 'buyer', 'rating', 'status'] },
  access: {
    // Public sees published reviews only; a buyer can also see their own (e.g. while pending).
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) {
        const where: Where = { or: [{ status: { equals: 'published' } }, { buyer: { equals: req.user.id } }] }
        return where
      }
      const where: Where = { status: { equals: 'published' } }
      return where
    },
    create: ({ req }) => Boolean(req.user),
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'asset', type: 'relationship', relationTo: 'assets', required: true },
    { name: 'order', type: 'relationship', relationTo: 'orders', unique: true, admin: { description: 'One review per order. Left blank for admin-authored seed/editorial reviews.' } },
    { name: 'buyer', type: 'relationship', relationTo: 'users', required: true, admin: { readOnly: true } },
    { name: 'rating', type: 'number', required: true, min: 1, max: 5 },
    { name: 'title', type: 'text' },
    { name: 'comment', type: 'textarea' },
    {
      name: 'verifiedPurchase', type: 'checkbox', defaultValue: false,
      admin: { position: 'sidebar', readOnly: true, description: 'Set automatically — true only for reviews tied to a real paid order.' },
    },
    {
      name: 'status', type: 'select', defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Published', value: 'published' },
      ],
      admin: { position: 'sidebar', description: 'Only published reviews are shown on the site. Admin approves buyer reviews here.' },
      access: { update: adminOnly },
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (operation !== 'create' || !data) return data
        if (!req.user) throw new APIError('Sign in required', 401)

        if (req.user.role === 'admin') {
          // Admin-authored review (seed/editorial) — no real order required.
          data.buyer = data.buyer || req.user.id
          data.verifiedPurchase = false
          if (!data.status) data.status = 'published'
          return data
        }

        if (!data.order) throw new APIError('A review must be linked to a paid order', 400)
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
        data.verifiedPurchase = true
        data.status = 'pending'
        return data
      },
    ],
  },
}
