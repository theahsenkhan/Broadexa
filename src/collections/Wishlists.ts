import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

function idOf(v: any): string {
  return String(typeof v === 'object' && v !== null ? v.id : v)
}

async function bumpWishlistCount(payload: any, assetId: string | number, delta: number) {
  const asset = await payload.findByID({ collection: 'assets', id: assetId }).catch(() => null)
  if (!asset) return
  const next = Math.max(0, (asset.wishlistCount || 0) + delta)
  await payload.update({ collection: 'assets', id: assetId, data: { wishlistCount: next } })
}

export const Wishlists: CollectionConfig = {
  slug: 'wishlists',
  admin: { useAsTitle: 'id', group: 'Marketplace', defaultColumns: ['user'] },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { user: { equals: req.user.id } }
      return false
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { user: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, unique: true, admin: { readOnly: true, description: 'One wishlist per buyer.' } },
    { name: 'assets', type: 'relationship', relationTo: 'assets', hasMany: true, label: 'Saved assets' },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, req, operation }) => {
        if (!data) return data
        if (!req.user) throw new APIError('Sign in required', 401)
        if (operation === 'create' || req.user.role !== 'admin') data.user = req.user.id
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        const before: Set<string> = new Set(((previousDoc?.assets || []) as any[]).map(idOf))
        const after: Set<string> = new Set(((doc.assets || []) as any[]).map(idOf))
        const added: string[] = Array.from(after).filter((id) => !before.has(id))
        const removed: string[] = Array.from(before).filter((id) => !after.has(id))
        for (const id of added) await bumpWishlistCount(req.payload, id, 1)
        for (const id of removed) await bumpWishlistCount(req.payload, id, -1)
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        for (const id of (doc.assets || []).map(idOf)) await bumpWishlistCount(req.payload, id, -1)
      },
    ],
  },
}
