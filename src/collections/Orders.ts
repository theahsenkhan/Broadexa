import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: { useAsTitle: 'id', group: 'Commerce', defaultColumns: ['asset', 'buyer', 'orderType', 'amount', 'status'] },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { buyer: { equals: req.user.id } }
      return false
    },
    create: () => false, // created by checkout code only (Phase 3)
    update: adminOnly,
    delete: () => false,
  },
  fields: [
    { name: 'asset', type: 'relationship', relationTo: 'assets', required: true },
    { name: 'buyer', type: 'relationship', relationTo: 'users', required: true },
    { name: 'orderType', type: 'select', required: true, defaultValue: 'standard', options: ['standard', 'exclusive', 'custom-project'] },
    { name: 'amount', type: 'number', required: true },
    { name: 'currency', type: 'text', defaultValue: 'USD' },
    { name: 'commissionPct', type: 'number', defaultValue: 20 },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'pending',
      options: ['pending', 'paid', 'invoice-requested', 'delivered', 'refunded', 'disputed'],
    },
    { name: 'stripePaymentIntentId', type: 'text', admin: { readOnly: true } },
    { name: 'downloadCount', type: 'number', defaultValue: 0, admin: { readOnly: true } },
    { name: 'notes', type: 'textarea', admin: { description: 'Refunds are case-by-case (locked decision) — record reasoning here.' } },
    {
      name: 'milestones', type: 'array', label: 'Milestones (custom projects)',
      admin: { condition: (data) => data?.orderType === 'custom-project' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'amount', type: 'number', required: true },
        { name: 'status', type: 'select', defaultValue: 'pending', options: ['pending', 'in-progress', 'delivered', 'paid'] },
      ],
    },
  ],
}
