import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: { useAsTitle: 'title', group: 'Content', defaultColumns: ['title', 'company', 'status'] },
  access: { read: () => true, create: adminOnly, update: adminOnly, delete: adminOnly },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'company', type: 'text', required: true },
    { name: 'location', type: 'text' },
    { name: 'jobType', type: 'select', options: ['full-time', 'contract', 'freelance', 'remote'] },
    { name: 'description', type: 'textarea', required: true },
    { name: 'applyUrl', type: 'text', label: 'Apply link or email' },
    { name: 'status', type: 'select', defaultValue: 'live', options: ['live', 'filled', 'expired'], admin: { position: 'sidebar' } },
  ],
}
