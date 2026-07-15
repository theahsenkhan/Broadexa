import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  admin: { useAsTitle: 'question', group: 'Content', defaultColumns: ['question', 'order'] },
  access: { read: () => true, create: adminOnly, update: adminOnly, delete: adminOnly },
  defaultSort: 'order',
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'textarea', required: true },
    { name: 'order', type: 'number', defaultValue: 0, admin: { description: 'Lower numbers show first.' } },
  ],
}
