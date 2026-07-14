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
    // Admin, or the project owner accepting/declining bids on their own project.
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { 'project.postedBy': { equals: req.user.id } }
      return false
    },
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
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== 'create') return
        const projectId = typeof doc.project === 'object' ? doc.project.id : doc.project
        const project = await req.payload.findByID({ collection: 'projects', id: projectId })
        await req.payload.update({
          collection: 'projects',
          id: projectId,
          data: { bidCount: (project.bidCount || 0) + 1 },
        })
      },
    ],
  },
}
