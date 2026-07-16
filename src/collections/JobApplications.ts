import type { CollectionConfig, Where } from 'payload'

export const JobApplications: CollectionConfig = {
  slug: 'job-applications',
  admin: { useAsTitle: 'id', group: 'Content', defaultColumns: ['job', 'applicant', 'status'] },
  access: {
    // Private, like Bids: only the job poster, the applicant, and admin can read.
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) {
        const where: Where = {
          or: [
            { applicant: { equals: req.user.id } },
            { 'job.postedBy': { equals: req.user.id } },
          ],
        }
        return where
      }
      return false
    },
    create: ({ req }) => Boolean(req.user),
    // Admin, or the job's poster reviewing applicants to their own posting.
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user) return { 'job.postedBy': { equals: req.user.id } }
      return false
    },
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'job', type: 'relationship', relationTo: 'jobs', required: true },
    { name: 'applicant', type: 'relationship', relationTo: 'users', required: true },
    { name: 'coverNote', type: 'textarea' },
    { name: 'resumeUrl', type: 'text', label: 'Resume / portfolio link' },
    { name: 'status', type: 'select', defaultValue: 'submitted', options: ['submitted', 'reviewed', 'shortlisted', 'rejected', 'hired'] },
  ],
}
