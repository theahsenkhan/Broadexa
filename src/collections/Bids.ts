import type { CollectionConfig, Where } from 'payload'

export const Bids: CollectionConfig = {
  slug: 'bids',
  admin: { useAsTitle: 'id', group: 'Services', defaultColumns: ['project', 'designer', 'amount', 'status'] },
  access: {
    // Private bids (locked): only the project owner, the bidding designer, and admin can read
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) {
        const where: Where = {
          or: [
            { designer: { equals: req.user.id } },
            { 'project.postedBy': { equals: req.user.id } },
          ],
        }
        return where
      }
      return false
    },
    create: ({ req }) => req.user?.role === 'designer',
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'project', type: 'relationship', relationTo: 'projects', required: true },
    { name: 'designer', type: 'relationship', relationTo: 'users', required: true },
    { name: 'amount', type: 'number', required: true },
    { name: 'timelineDays', type: 'number', label: 'Delivery (days)' },
    { name: 'message', type: 'textarea' },
    { name: 'status', type: 'select', defaultValue: 'submitted', options: ['submitted', 'accepted', 'declined', 'withdrawn'] },
  ],
}
