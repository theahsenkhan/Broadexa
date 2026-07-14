import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: () => true, update: ({ req }) => req.user?.role === 'admin' },
  fields: [
    {
      name: 'sections',
      type: 'group',
      label: 'Page visibility (your launch control — locked decision: build all, reveal by CMS)',
      fields: [
        { name: 'marketplace', type: 'checkbox', defaultValue: false, label: 'Show Marketplace' },
        { name: 'services', type: 'checkbox', defaultValue: false, label: 'Show Services' },
        { name: 'awards', type: 'checkbox', defaultValue: false, label: 'Show Awards' },
        { name: 'blog', type: 'checkbox', defaultValue: false, label: 'Show Blog' },
        { name: 'jobs', type: 'checkbox', defaultValue: false, label: 'Show Jobs' },
        { name: 'sellPage', type: 'checkbox', defaultValue: false, label: 'Show "Sell your scenes"' },
      ],
    },
    {
      name: 'commerce',
      type: 'group',
      fields: [
        { name: 'commissionAssetsPct', type: 'number', defaultValue: 20, label: 'Commission on asset sales (%)' },
        { name: 'commissionServicesPct', type: 'number', defaultValue: 20, label: 'Commission on custom projects (%)' },
        { name: 'designerSharePct', type: 'number', defaultValue: 80, admin: { readOnly: true }, label: 'Designer keeps (%)' },
      ],
    },
    { name: 'announcement', type: 'text', label: 'Site-wide announcement bar (empty = hidden)' },
    { name: 'tagline', type: 'text', defaultValue: 'The home of broadcast design' },
  ],
}
