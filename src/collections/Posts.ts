import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'publishedAt', 'status'] },
  access: { read: () => true, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    { name: 'content', type: 'richText', editor: lexicalEditor() },
    { name: 'publishedAt', type: 'date' },
    { name: 'status', type: 'select', defaultValue: 'draft', options: ['draft', 'published'], admin: { position: 'sidebar' } },
    { name: 'seoTitle', type: 'text', admin: { position: 'sidebar' } },
    { name: 'seoDescription', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
