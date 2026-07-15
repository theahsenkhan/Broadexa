import type { CollectionConfig, Where } from 'payload'

export const AwardEntries: CollectionConfig = {
  slug: 'award-entries',
  admin: { useAsTitle: 'title', group: 'Awards', defaultColumns: ['title', 'entrant', 'year', 'status'] },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      // entrants see their own; winners are public
      if (req.user) {
        const where: Where = { or: [{ entrant: { equals: req.user.id } }, { status: { equals: 'winner' } }] }
        return where
      }
      return { status: { equals: 'winner' } }
    },
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'entrant', type: 'relationship', relationTo: 'users', required: true },
    { name: 'competition', type: 'relationship', relationTo: 'competitions', label: 'Competition (optional)' },
    { name: 'awardCategory', type: 'text', required: true },
    { name: 'year', type: 'number', required: true, defaultValue: 2026 },
    { name: 'videoUrl', type: 'text', required: true, label: 'Entry video URL' },
    { name: 'description', type: 'textarea' },
    { name: 'engine', type: 'relationship', relationTo: 'engines' },
    { name: 'status', type: 'select', defaultValue: 'submitted', options: ['submitted', 'shortlisted', 'winner', 'declined'], admin: { position: 'sidebar' } },
  ],
}
