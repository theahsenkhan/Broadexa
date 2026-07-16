import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const BlogCategories: CollectionConfig = {
  slug: 'blog-categories',
  admin: { useAsTitle: 'name', group: 'Content' },
  access: { read: () => true, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}
