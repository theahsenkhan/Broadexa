import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'company', 'postedBy', 'status'] },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user), // any logged-in user can post — admin verifies before it's live
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { postedBy: { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    { name: 'postedBy', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar', readOnly: true } },
    { name: 'location', type: 'text' },
    { name: 'jobType', type: 'select', options: ['full-time', 'contract', 'freelance', 'remote'] },
    { name: 'description', type: 'textarea', required: true },
    { name: 'applyUrl', type: 'text', label: 'External apply link or email (optional — applicants can also apply on Broadexa)' },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'pending',
      options: [
        { label: 'Pending review', value: 'pending' },
        { label: 'Live', value: 'live' },
        { label: 'Filled', value: 'filled' },
        { label: 'Expired', value: 'expired' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar', description: 'Every posting is reviewed before it goes live.' },
      access: { update: adminOnly },
    },
  ],
}
