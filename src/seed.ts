import { getPayload } from 'payload'
import config from './payload.config'

const engines = [
  { name: 'Viz Engine', slug: 'viz-engine', shortLabel: 'VIZ' },
  { name: 'Unreal Engine', slug: 'unreal', shortLabel: 'UE' },
  { name: 'Zero Density', slug: 'zero-density', shortLabel: 'ZD' },
  { name: 'Pixotope', slug: 'pixotope', shortLabel: 'PIXOTOPE' },
  { name: 'Aximmetry', slug: 'aximmetry', shortLabel: 'AXIMMETRY' },
  { name: 'Brainstorm', slug: 'brainstorm', shortLabel: 'BRAINSTORM' },
  { name: 'Chyron', slug: 'chyron', shortLabel: 'CHYRON' },
  { name: 'Ross', slug: 'ross', shortLabel: 'ROSS' },
  { name: 'Reality', slug: 'reality', shortLabel: 'REALITY' },
]

const categories = [
  { name: 'Virtual Set', slug: 'virtual-set' },
  { name: 'AR Graphics', slug: 'ar-graphics' },
  { name: 'Show Package', slug: 'show-package' },
  { name: 'Lower Thirds', slug: 'lower-thirds' },
  { name: 'Data Visualization', slug: 'data-visualization' },
  { name: 'Transitions & Stingers', slug: 'transitions-stingers' },
  { name: 'Studio Template', slug: 'studio-template' },
  { name: 'Full Show Package', slug: 'full-show-package' },
]

const faqItems = [
  {
    question: 'What is Broadexa?',
    answer: 'A marketplace for broadcast-ready real-time assets — virtual sets, AR graphics and show packages — built for Viz Engine, Unreal, Zero Density, Pixotope, Aximmetry, Brainstorm, Chyron, Ross and Reality.',
  },
  {
    question: 'What does the commission structure look like?',
    answer: 'Designers keep 80% of every sale, on both marketplace assets and custom projects. Broadexa takes a 20% commission. Designers set their own prices.',
  },
  {
    question: 'What does the "Verified" badge mean?',
    answer: "It means the designer supplied an on-engine screen recording of the asset and our team checked it against the listing. It confirms the asset matches what's described — it is not a quality guarantee or endorsement.",
  },
  {
    question: 'Can I list an asset without a recording?',
    answer: "Yes — publishing is allowed without a recording, but the listing won't carry the Verified badge. Every listing is still reviewed by our team before it goes live.",
  },
  {
    question: 'Are bids on projects public?',
    answer: 'No — bids are private, visible only to the project poster, the bidding designer, and Broadexa admins. The number of bids on a project is shown publicly.',
  },
  {
    question: 'Do I need an account to browse?',
    answer: "No — buyers can browse the marketplace and see prices without an account. You'll need one to purchase, post a project, or submit a bid.",
  },
  {
    question: 'When do designers get paid?',
    answer: 'Payouts run monthly through Stripe Connect. Once you connect your Stripe account from your dashboard, sales are transferred automatically minus the 20% commission.',
  },
  {
    question: "What's your refund policy?",
    answer: "Refunds are handled case-by-case. Contact us with your order details and we'll review it against our written refund policy.",
  },
  {
    question: 'Are there free assets?',
    answer: 'Yes — browse the Free section of the marketplace for assets designers have made available at no cost.',
  },
  {
    question: 'What is an exclusive buyout?',
    answer: "Some designers offer an exclusive licence at a higher price. Once purchased, the listing is automatically delisted from the marketplace — you're the only one who has it.",
  },
].map((f, i) => ({ ...f, order: i }))

async function seedCollection(payload: Awaited<ReturnType<typeof getPayload>>, slug: 'engines' | 'categories', items: { name: string; slug: string; shortLabel?: string }[]) {
  for (const item of items) {
    const existing = await payload.find({
      collection: slug,
      where: { slug: { equals: item.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`skip ${slug}: ${item.slug} already exists`)
      continue
    }
    await payload.create({ collection: slug, data: item })
    console.log(`created ${slug}: ${item.slug}`)
  }
}

async function seedFaqItems(payload: Awaited<ReturnType<typeof getPayload>>) {
  for (const item of faqItems) {
    const existing = await payload.find({
      collection: 'faq-items',
      where: { question: { equals: item.question } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      console.log(`skip faq-items: ${item.question} already exists`)
      continue
    }
    await payload.create({ collection: 'faq-items', data: item })
    console.log(`created faq-items: ${item.question}`)
  }
}

async function seed() {
  const payload = await getPayload({ config })
  await seedCollection(payload, 'engines', engines)
  await seedCollection(payload, 'categories', categories)
  await seedFaqItems(payload)
  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
