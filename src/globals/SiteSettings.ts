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
            { name: 'heroBackgroundImage', type: 'upload', relationTo: 'media', label: 'Hero background image (optional — sits behind the gradient)' },
            { name: 'heroBackgroundVideoUrl', type: 'text', label: 'Hero background video URL (optional — takes priority over the image if both are set)' },
            { name: 'showEngineStrip', type: 'checkbox', defaultValue: true, label: 'Show supported-engines strip under the hero' },
            { name: 'showFreeSpotlight', type: 'checkbox', defaultValue: true, label: 'Show a "Free assets" spotlight when free assets exist' },
            {
              name: 'howItWorksBuyerSteps', type: 'array', label: '"How it works" — steps for buyers',
              defaultValue: [
                { title: '1. Browse', body: 'Search the marketplace by engine, genre and price. No account needed to look around.' },
                { title: '2. Buy or bid', body: 'Buy instantly, request an invoice, or bid on an exclusive buyout — you choose the licence.' },
                { title: '3. Download', body: 'Get the files straight away through your dashboard, with support from the designer if you need it.' },
              ],
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
            { name: 'verifiedHeading', type: 'text', defaultValue: 'What "Verified" means', label: 'Verified-badge explainer heading' },
            {
              name: 'verifiedBody', type: 'textarea', label: 'Verified-badge explainer body',
              defaultValue: 'A Verified badge means the designer supplied a recording of the asset running live on the engine, and our team checked it matches the listing. It\'s not a quality score — it\'s confirmation the listing is what it claims to be.',
            },
            { name: 'showCompetitionsTeaser', type: 'checkbox', defaultValue: true, label: 'Show a Competitions teaser section (pulls the latest open competition)' },
            { name: 'ctaBuyLabel', type: 'text', defaultValue: 'Browse the marketplace', label: 'Closing CTA — buy button label' },
            { name: 'ctaSellLabel', type: 'text', defaultValue: 'Start selling', label: 'Closing CTA — sell button label' },
            {
              name: 'categoryTiles', type: 'group', label: 'Category tiles section',
              fields: [
                { name: 'heading', type: 'text', defaultValue: 'Explore by category' },
                { name: 'subheading', type: 'text', defaultValue: 'Every listing is admin-reviewed before it goes live' },
                {
                  name: 'tiles', type: 'array', label: 'Tiles (item counts are pulled live — no need to update them)',
                  fields: [
                    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
                    { name: 'image', type: 'upload', relationTo: 'media', label: 'Tile image (optional — a styled placeholder shows if empty)' },
                  ],
                },
              ],
            },
            {
              name: 'editorsPicks', type: 'group', label: "Editor's picks section (horizontal scroll row)",
              fields: [
                { name: 'heading', type: 'text', defaultValue: "Editor's picks" },
                { name: 'subheading', type: 'text', defaultValue: 'Hand-selected for build quality and on-engine accuracy' },
                { name: 'assets', type: 'relationship', relationTo: 'assets', hasMany: true, label: 'Picked assets (shown in this order)' },
              ],
            },
            {
              name: 'featureBands', type: 'array', label: 'Alternating feature bands (image one side, text the other)',
              defaultValue: [
                { eyebrow: 'Verified badge', heading: 'Verified on-engine — not just claimed', body: 'A Verified badge means the designer supplied a recording of the asset running live on the engine, and our team checked it matches the listing. Every listing is admin-reviewed either way.', imageSide: 'right' },
                { eyebrow: 'Commission', heading: 'You keep 80%. Always.', body: 'Flat 20% commission on every sale and custom project — no tiers, no surprises. You set your own prices. Payouts run monthly through Stripe Connect.', imageSide: 'left' },
                { eyebrow: 'Messaging', heading: 'Bid privately. Message safely.', body: 'Bids stay private — only the count is public. Buyer/designer messaging is scoped to a real order or accepted bid, and contact-info sharing is automatically blocked.', imageSide: 'right' },
              ],
              fields: [
                { name: 'eyebrow', type: 'text', label: 'Small label above the heading' },
                { name: 'heading', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media', label: 'Image (optional — a styled placeholder shows if empty)' },
                {
                  name: 'imageSide', type: 'select', defaultValue: 'right',
                  options: [{ label: 'Image on the right', value: 'right' }, { label: 'Image on the left', value: 'left' }],
                },
              ],
            },
            {
              name: 'blogRow', type: 'group', label: 'Latest from blog section',
              fields: [
                { name: 'heading', type: 'text', defaultValue: 'Latest from the blog' },
              ],
            },
            {
              name: 'valueProps', type: 'array', label: 'Value props row (icon + short blurb, leave empty to hide)',
              defaultValue: [
                { icon: '💰', title: '80% commission', body: 'You keep 80% of every sale. We take 20% — nothing else.' },
                { icon: '✓', title: 'Verified on-engine', body: 'Admin-checked recordings confirm every listing matches what it claims.' },
                { icon: '📅', title: 'Monthly payouts', body: 'Paid directly through Stripe Connect, automatically, every month.' },
              ],
              fields: [
                { name: 'icon', type: 'text', label: 'Icon (emoji or short label)' },
                { name: 'title', type: 'text', required: true },
                { name: 'body', type: 'textarea', required: true },
              ],
            },
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
            {
              name: 'sectionOrder', type: 'select', hasMany: true, label: 'Homepage section order (drag to reorder — sections not selected are hidden)',
              defaultValue: ['categoryTiles', 'howItWorks', 'valueProps', 'featured', 'editorsPicks', 'featureBands', 'verifiedExplainer', 'competitionsTeaser', 'stats', 'blogRow', 'testimonials'],
              options: [
                { label: 'Category tiles', value: 'categoryTiles' },
                { label: 'How it works', value: 'howItWorks' },
                { label: 'Value props', value: 'valueProps' },
                { label: 'Featured assets (incl. free tab)', value: 'featured' },
                { label: "Editor's picks", value: 'editorsPicks' },
                { label: 'Feature bands', value: 'featureBands' },
                { label: 'Verified badge explainer', value: 'verifiedExplainer' },
                { label: 'Competitions teaser', value: 'competitionsTeaser' },
                { label: 'Stats', value: 'stats' },
                { label: 'Latest from blog', value: 'blogRow' },
                { label: 'Testimonials', value: 'testimonials' },
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
