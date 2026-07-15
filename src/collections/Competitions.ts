import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const Competitions: CollectionConfig = {
  slug: 'competitions',
  admin: { useAsTitle: 'title', group: 'Awards', defaultColumns: ['title', 'status', 'deadline'] },
  access: { read: () => true, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'theme', type: 'textarea', label: 'Theme / brief', required: true },
    { name: 'coverImage', type: 'upload', relationTo: 'media' },
    { name: 'engine', type: 'relationship', relationTo: 'engines', label: 'Engine (optional restriction)' },
    { name: 'startDate', type: 'date' },
    { name: 'deadline', type: 'date', label: 'Entry deadline' },
    {
      name: 'prizes', type: 'array', label: 'Prizes',
      fields: [
        { name: 'place', type: 'text', required: true, label: 'Place (e.g. "1st")' },
        { name: 'prize', type: 'text', required: true },
      ],
    },
    { name: 'rules', type: 'textarea' },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'upcoming',
      options: [
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Open for entries', value: 'open' },
        { label: 'Judging', value: 'judging' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
