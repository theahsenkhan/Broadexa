import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'name', group: 'People' },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
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
    { name: 'studioName', type: 'text', label: 'Studio / display name' },
    { name: 'bio', type: 'textarea' },
    { name: 'onAirCredits', type: 'text', label: 'On-air credits' },
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
    { name: 'acceptedTermsAt', type: 'date', admin: { readOnly: true, description: 'Set automatically at signup.' } },
  ],
}
