import type { CollectionConfig } from 'payload'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const Assets: CollectionConfig = {
  slug: 'assets',
  admin: { useAsTitle: 'title', group: 'Marketplace', defaultColumns: ['title', 'designer', 'price', 'status', 'verified'] },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'designer' || req.user?.role === 'admin',
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      if (req.user?.role === 'designer') return { designer: { equals: req.user.id } }
      return false
    },
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'designer', type: 'relationship', relationTo: 'users', required: true },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'engine', type: 'relationship', relationTo: 'engines', required: true },
    { name: 'engineVersionBuilt', type: 'text', required: true, label: 'Built in (engine version)' },
    { name: 'engineVersionMin', type: 'text', label: 'Opens in (lowest version)' },
    { name: 'genre', type: 'select', hasMany: true, options: ['news', 'sports', 'weather', 'election', 'talk', 'other'] },
    { name: 'description', type: 'textarea', required: true },

    // ── Pricing (designer sets their own — locked decision) ──
    { name: 'isFree', type: 'checkbox', defaultValue: false },
    { name: 'price', type: 'number', min: 0, admin: { condition: (data) => !data?.isFree } },
    { name: 'exclusiveAvailable', type: 'checkbox', defaultValue: false, label: 'Offer exclusive buyout' },
    { name: 'exclusivePrice', type: 'number', min: 0, admin: { condition: (data) => data?.exclusiveAvailable } },

    // ── Listing requirements (locked: buyers cannot open the file first) ──
    {
      name: 'includes', type: 'array', label: "What's included",
      fields: [
        { name: 'item', type: 'text', required: true },
        { name: 'included', type: 'checkbox', defaultValue: true },
      ],
    },
    { name: 'editableNotes', type: 'text', label: 'What is editable (colours, text, logos…)' },
    { name: 'requirements', type: 'text', label: 'Needs to run (plugins, tracking, fonts…)' },
    { name: 'trackingReady', type: 'checkbox', defaultValue: false },
    { name: 'fileSizeGB', type: 'number', label: 'File size (GB)' },

    // ── Previews ──
    { name: 'gallery', type: 'upload', relationTo: 'media', hasMany: true, label: 'Preview images (wide, anchor, detail, AR)' },
    { name: 'previewVideoUrl', type: 'text', label: 'Preview video URL (Cloudflare Stream — Phase 2)' },
    { name: 'onEngineRecordingUrl', type: 'text', label: 'On-engine screen recording URL (verification proof)' },

    // ── Deliverable (locked: buyers cannot open the file first — download is gated by order status) ──
    { name: 'file', type: 'upload', relationTo: 'asset-files', label: 'Downloadable package (buyers only get this after purchase)' },

    // ── Trust (locked: Verified badge, admin-granted, no recording = no badge) ──
    {
      name: 'verified', type: 'checkbox', defaultValue: false,
      admin: { position: 'sidebar', description: 'Recording checked against listing. Admin grants this.' },
      access: { update: adminOnly },
    },
    {
      name: 'awardWinner', type: 'checkbox', defaultValue: false,
      admin: { position: 'sidebar' }, access: { update: adminOnly },
    },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'pending',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Pending review', value: 'pending' },
        { label: 'Published', value: 'published' },
        { label: 'Delisted (exclusive sold)', value: 'delisted' },
      ],
      admin: { position: 'sidebar', description: 'Every listing is reviewed before publish (locked decision).' },
      access: { update: adminOnly },
    },
    { name: 'featured', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' }, access: { update: adminOnly } },

    // ── SEO (optional overrides) ──
    { name: 'seoTitle', type: 'text', admin: { position: 'sidebar' } },
    { name: 'seoDescription', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
