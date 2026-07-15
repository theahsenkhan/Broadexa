import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

const adminOnly = ({ req }: any) => req.user?.role === 'admin'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: { group: 'Settings' },
  access: { read: () => true, update: adminOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Visibility',
          description: 'Your launch control — locked decision: build everything, reveal by CMS. Everything starts OFF.',
          fields: [
            {
              name: 'sections',
              type: 'group',
              label: 'Page visibility',
              fields: [
                { name: 'marketplace', type: 'checkbox', defaultValue: false, label: 'Show Marketplace' },
                { name: 'services', type: 'checkbox', defaultValue: false, label: 'Show Services' },
                { name: 'awards', type: 'checkbox', defaultValue: false, label: 'Show Awards' },
                { name: 'competitions', type: 'checkbox', defaultValue: false, label: 'Show Competitions' },
                { name: 'blog', type: 'checkbox', defaultValue: false, label: 'Show Blog' },
                { name: 'jobs', type: 'checkbox', defaultValue: false, label: 'Show Jobs' },
                { name: 'sellPage', type: 'checkbox', defaultValue: false, label: 'Show "Sell your scenes"' },
              ],
            },
            { name: 'announcement', type: 'text', label: 'Site-wide announcement bar (empty = hidden)' },
          ],
        },
        {
          label: 'Branding',
          fields: [
            { name: 'logo', type: 'upload', relationTo: 'media', label: 'Logo (replaces the BROADEXA wordmark once set)' },
            { name: 'favicon', type: 'upload', relationTo: 'media', label: 'Favicon (square image, e.g. 512x512)' },
            { name: 'tagline', type: 'text', defaultValue: 'The home of broadcast design' },
          ],
        },
        {
          label: 'Homepage',
          fields: [
            { name: 'heroEyebrow', type: 'text', defaultValue: '● REC — Coming soon', label: 'Small tag above the headline' },
            { name: 'heroHeadline', type: 'text', defaultValue: 'The home of broadcast design', label: 'Headline (the last word wraps in gradient style automatically if it\'s on its own line in your head — keep it short)' },
            { name: 'heroSubhead', type: 'textarea', defaultValue: 'Virtual sets, AR graphics and full show packages — built by real-time designers, verified on the engines you run.' },
            { name: 'heroCtaLabel', type: 'text', defaultValue: 'Browse the marketplace' },
            { name: 'showFreeSpotlight', type: 'checkbox', defaultValue: true, label: 'Show a "Free assets" spotlight when free assets exist' },
            {
              name: 'stats', type: 'array', label: 'Stats row (leave empty to hide)',
              fields: [
                { name: 'value', type: 'text', required: true, label: 'Value (e.g. "500+")' },
                { name: 'label', type: 'text', required: true, label: 'Label (e.g. "Designers")' },
              ],
            },
            {
              name: 'testimonials', type: 'array', label: 'Testimonials (leave empty to hide)',
              fields: [
                { name: 'quote', type: 'textarea', required: true },
                { name: 'name', type: 'text', required: true },
                { name: 'role', type: 'text', label: 'Role / studio' },
              ],
            },
          ],
        },
        {
          label: 'Sell page',
          fields: [
            { name: 'sellHeadline', type: 'text', defaultValue: 'Sell your scenes. Keep 80%.' },
            {
              name: 'sellSubhead', type: 'textarea',
              defaultValue: 'List virtual sets, AR graphics and show packages for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry, Brainstorm, Chyron, Ross and Reality. You set your own prices. We take 20% — nothing else.',
            },
            {
              name: 'sellSteps', type: 'array', label: 'How it works steps',
              defaultValue: [
                { title: '1. Upload', body: 'List your scene with specs, includes and a short on-engine recording. Set your own price, and optionally offer an exclusive buyout.' },
                { title: '2. Reviewed', body: 'Every listing is checked before it goes live. Supply an on-engine recording and we\'ll verify it against your listing — that earns the Verified badge.' },
                { title: '3. Get paid', body: 'Buyers pay you directly through Stripe. We take 20% commission — you keep 80%. Payouts run monthly.' },
              ],
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
            { name: 'sellClosingHeadline', type: 'text', defaultValue: 'Ready to list your first scene?' },
          ],
        },
        {
          label: 'Footer & contact',
          fields: [
            { name: 'contactEmail', type: 'text', label: 'Public contact email' },
            {
              name: 'social', type: 'group', label: 'Social links (leave blank to hide)',
              fields: [
                { name: 'twitter', type: 'text', label: 'X / Twitter URL' },
                { name: 'instagram', type: 'text', label: 'Instagram URL' },
                { name: 'linkedin', type: 'text', label: 'LinkedIn URL' },
                { name: 'youtube', type: 'text', label: 'YouTube URL' },
              ],
            },
            {
              name: 'extraNavLinks', type: 'array', label: 'Custom nav links',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'url', type: 'text', required: true },
              ],
            },
            { name: 'copyrightText', type: 'text', defaultValue: '© Broadexa. All rights reserved.' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'defaultSeoTitle', type: 'text', defaultValue: 'Broadexa — The home of broadcast design' },
            {
              name: 'defaultSeoDescription', type: 'textarea',
              defaultValue: 'A global marketplace for broadcast-ready real-time assets. Virtual sets, AR graphics and show packages for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry and more.',
            },
          ],
        },
        {
          label: 'Legal',
          fields: [
            { name: 'termsOfService', type: 'richText', editor: lexicalEditor() },
            { name: 'privacyPolicy', type: 'richText', editor: lexicalEditor() },
            { name: 'refundPolicy', type: 'richText', editor: lexicalEditor() },
          ],
        },
        {
          label: 'Commerce',
          fields: [
            {
              name: 'commerce',
              type: 'group',
              fields: [
                { name: 'commissionAssetsPct', type: 'number', defaultValue: 20, label: 'Commission on asset sales (%)' },
                { name: 'commissionServicesPct', type: 'number', defaultValue: 20, label: 'Commission on custom projects (%)' },
                { name: 'designerSharePct', type: 'number', defaultValue: 80, admin: { readOnly: true }, label: 'Designer keeps (%)' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
