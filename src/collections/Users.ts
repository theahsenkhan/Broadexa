import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'

const USERNAME_RE = /^[a-z0-9](?:[a-z0-9._-]{1,28}[a-z0-9])?$/

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'username', group: 'People', defaultColumns: ['name', 'username', 'role', 'email'] },
  access: {
    read: () => true,
    create: () => true,
    // No collection-level update was set before, which defaults to "any
    // logged-in user" — field-level access locked down role/badges, but
    // left every other field (name, bio, etc.) editable by any authenticated
    // user on any account, not just their own.
    update: ({ req, id }) => req.user?.role === 'admin' || String(req.user?.id) === String(id),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'username', type: 'text', required: true, unique: true,
      admin: { description: 'Unique handle — used for profile URLs and invites since studio/display names can collide. Lowercase letters, numbers, dots, dashes, underscores only.' },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'buyer',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Designer', value: 'designer' },
        { label: 'Buyer', value: 'buyer' },
      ],
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
    { name: 'avatar', type: 'upload', relationTo: 'media', label: 'Profile photo' },
    { name: 'studioName', type: 'text', label: 'Studio / display name' },
    { name: 'bio', type: 'textarea' },
    {
      name: 'profession', type: 'text', label: 'Profession / title',
      admin: { condition: (data) => data?.role === 'designer', description: 'e.g. "AR Developer", "Motion Designer"' },
    },
    {
      name: 'yearsExperience', type: 'number', min: 0, label: 'Years of experience',
      admin: { condition: (data) => data?.role === 'designer' },
    },
    {
      name: 'skills', type: 'array', label: 'Skills / specialties',
      admin: { condition: (data) => data?.role === 'designer' },
      fields: [{ name: 'skill', type: 'text', required: true }],
    },
    {
      name: 'portfolioUrl', type: 'text', label: 'Portfolio / website link',
      admin: { condition: (data) => data?.role === 'designer' },
    },
    {
      name: 'companyName', type: 'text', label: 'Company',
      admin: { condition: (data) => data?.role === 'buyer' },
    },
    {
      name: 'jobTitle', type: 'text', label: 'Job title',
      admin: { condition: (data) => data?.role === 'buyer' },
    },
    { name: 'onAirCredits', type: 'text', label: 'On-air credits', admin: { condition: (data) => data?.role === 'designer' } },
    {
      name: 'verifiedDesigner', type: 'checkbox', defaultValue: false,
      admin: { description: 'Identity + portfolio confirmed. Admin grants this.' },
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
    {
      name: 'certifiedDesigner', type: 'checkbox', defaultValue: false,
      admin: { description: 'Work quality vetted. Admin grants this.' },
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
    { name: 'country', type: 'text' },
    { name: 'stripeAccountId', type: 'text', admin: { description: 'Stripe Connect (Phase 3)', readOnly: true } },
    {
      name: 'authProvider', type: 'select', defaultValue: 'local',
      options: [{ label: 'Email + password', value: 'local' }, { label: 'Google', value: 'google' }, { label: 'LinkedIn', value: 'linkedin' }],
      admin: { position: 'sidebar', readOnly: true, description: 'Set automatically.' },
    },
    { name: 'acceptedTermsAt', type: 'date', admin: { readOnly: true, description: 'Set automatically at signup.' } },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, operation, req, originalDoc }) => {
        if (!data) return data
        if (data.username) data.username = String(data.username).trim().toLowerCase()
        if (data.username && !USERNAME_RE.test(data.username)) {
          throw new APIError('Username must be 3–30 characters: lowercase letters, numbers, dots, dashes or underscores, and can\'t start or end with a symbol.', 400)
        }
        if (operation === 'create' && !data.username && data.email) {
          data.username = String(data.email).split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 30) || `user-${Date.now()}`
        }
        if (data.username) {
          const existing = await req.payload.find({ collection: 'users', where: { username: { equals: data.username } }, limit: 1 })
          const clash = existing.docs.find((u: any) => String(u.id) !== String(originalDoc?.id))
          if (clash) throw new APIError('That username is already taken.', 400)
        }
        return data
      },
    ],
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') data.acceptedTermsAt = new Date().toISOString()
        return data
      },
    ],
  },
}
