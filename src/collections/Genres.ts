import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const Genres: CollectionConfig = {
  slug: 'genres',
  admin: { useAsTitle: 'name', group: 'Marketplace' },
  access: { read: () => true, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}
