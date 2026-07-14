import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title', group: 'Services', defaultColumns: ['title', 'postedBy', 'status', 'bidCount'] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user), // account required (locked decision)
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { postedBy: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'postedBy', type: 'relationship', relationTo: 'users', required: true },
    { name: 'engine', type: 'relationship', relationTo: 'engines' },
    { name: 'budgetMin', type: 'number' },
    { name: 'budgetMax', type: 'number' },
    { name: 'deadline', type: 'date' },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'open',
      options: ['open', 'awarded', 'in-progress', 'delivered', 'closed'],
    },
    { name: 'bidCount', type: 'number', defaultValue: 0, admin: { description: 'Shown publicly. Bids themselves are private (locked decision).' } },
  ],
}
