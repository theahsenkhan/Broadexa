import type { getPayload } from 'payload'

type Payload = Awaited<ReturnType<typeof getPayload>>

export const engines = [
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

export const categories = [
  { name: 'Virtual Set', slug: 'virtual-set' },
  { name: 'AR Graphics', slug: 'ar-graphics' },
  { name: 'Show Package', slug: 'show-package' },
  { name: 'Lower Thirds', slug: 'lower-thirds' },
  { name: 'Data Visualization', slug: 'data-visualization' },
  { name: 'Transitions & Stingers', slug: 'transitions-stingers' },
  { name: 'Studio Template', slug: 'studio-template' },
  { name: 'Full Show Package', slug: 'full-show-package' },
]

export const genres = [
  { name: 'News', slug: 'news' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Weather', slug: 'weather' },
  { name: 'Election', slug: 'election' },
  { name: 'Talk', slug: 'talk' },
  { name: 'Other', slug: 'other' },
]

export const blogCategories = [
  { name: 'Product', slug: 'product' },
  { name: 'Design', slug: 'design' },
  { name: 'Industry', slug: 'industry' },
]

export const faqItems = [
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

// ── Sample catalog content ──
// R2 isn't configured yet (no credentials set), so there's nowhere to upload
// real preview photography that would actually work on the live site. These
// listings ship without a gallery image — the frontend falls back to a
// styled gradient + icon placeholder per category, same treatment used
// across the site until real photos are added per listing.
export const designers = [
  {
    email: 'northline-studio@broadexa.seed', username: 'northline-studio', name: 'Alex Doyle', studioName: 'Northline Studio',
    bio: 'Broadcast design studio specialising in news and current-affairs graphics.',
    country: 'United States', verifiedDesigner: true,
    profession: 'Broadcast Designer', yearsExperience: 9,
    skills: [{ skill: 'Viz Engine' }, { skill: 'News graphics' }, { skill: 'Motion design' }],
  },
  {
    email: 'vantage-point@broadexa.seed', username: 'vantage-point', name: 'Priya Anand', studioName: 'Vantage Point',
    bio: 'AR and virtual graphics for elections, results nights and live events.',
    country: 'United Kingdom', verifiedDesigner: true, certifiedDesigner: true,
    profession: 'AR Developer', yearsExperience: 7,
    skills: [{ skill: 'Unreal Engine' }, { skill: 'AR graphics' }, { skill: 'Camera tracking' }],
  },
  {
    email: 'skyline-fx@broadexa.seed', username: 'skyline-fx', name: 'Marco Bellini', studioName: 'Skyline FX',
    bio: 'Weather and data-visualisation packages built for daily broadcast use.',
    country: 'Italy', verifiedDesigner: true,
    profession: 'Data Visualisation Designer', yearsExperience: 6,
    skills: [{ skill: 'Zero Density' }, { skill: 'Weather graphics' }, { skill: 'Data viz' }],
  },
  {
    email: 'courtside-design@broadexa.seed', username: 'courtside-design', name: 'Jordan Lee', studioName: 'Courtside Design',
    bio: 'Sports desks and scoreboard systems for regional and national broadcasters.',
    country: 'Canada',
    profession: 'Motion Designer', yearsExperience: 5,
    skills: [{ skill: 'Pixotope' }, { skill: 'Sports graphics' }, { skill: 'Virtual sets' }],
  },
  {
    email: 'warmlight-co@broadexa.seed', username: 'warmlight-co', name: 'Sam Okafor', studioName: 'Warmlight Co',
    bio: 'Talk-show and studio sets with an emphasis on warm, approachable lighting.',
    country: 'United States',
    profession: 'Virtual Set Designer', yearsExperience: 4,
    skills: [{ skill: 'Brainstorm' }, { skill: 'Studio lighting' }, { skill: 'Virtual sets' }],
  },
]

export const sampleAssets = [
  {
    title: 'Prime Time News Desk', slug: 'prime-time-news-desk', designerEmail: 'northline-studio@broadexa.seed',
    categorySlug: 'virtual-set', engineSlug: 'viz-engine', genreSlugs: ['news'], engineVersionBuilt: '5.1', engineVersionMin: '4.4',
    description: 'A modern prime-time news desk built for a 3-camera setup, with a dynamic ticker zone and swappable background branding.',
    price: 1240, originalPrice: 1480, dealLabel: 'launch', rating: 4.8, reviewCount: 126,
    verified: true, featured: true, ribbon: 'editors-choice', fileSizeGB: 2.4, trackingReady: true,
    includes: [{ item: 'Main desk scene', included: true }, { item: 'Ticker + lower third templates', included: true }, { item: 'Alternate colour variant', included: true }],
    editableNotes: 'Background colour, logo panel, ticker text and desk material are all exposed as editable parameters.',
    requirements: 'Requires the Viz Trio plugin pack for the ticker template.',
  },
  {
    title: 'Election Night AR Package', slug: 'election-night-ar-package', designerEmail: 'vantage-point@broadexa.seed',
    categorySlug: 'ar-graphics', engineSlug: 'unreal', genreSlugs: ['election'], engineVersionBuilt: '5.3', engineVersionMin: '5.1',
    description: 'A full AR results package — floating results boards, county-by-county maps and a seat-projection tracker.',
    price: 2400, rating: 4.9, reviewCount: 58, verified: true, featured: true, ribbon: 'best-seller', fileSizeGB: 5.1, trackingReady: true,
    includes: [{ item: 'Results board AR set', included: true }, { item: 'Map + county breakdown', included: true }, { item: 'Seat projection tracker', included: true }],
    editableNotes: 'Party colours, candidate names/photos and map regions are all data-driven.',
    requirements: 'Needs a calibrated camera-tracking rig (Stype, Mo-Sys or equivalent).',
  },
  {
    title: 'Weather Wall Pro Kit', slug: 'weather-wall-pro-kit', designerEmail: 'skyline-fx@broadexa.seed',
    categorySlug: 'data-visualization', engineSlug: 'zero-density', genreSlugs: ['weather'], engineVersionBuilt: '2024.1', engineVersionMin: '2022.2',
    description: 'A complete weather wall with animated radar layers, 5-day forecast strip and a full-screen storm-tracking mode.',
    price: 890, rating: 4.6, reviewCount: 73, verified: true,
    includes: [{ item: 'Radar + forecast wall', included: true }, { item: 'Storm-tracking full screen', included: true }, { item: 'Data connector template', included: false }],
    editableNotes: 'Colour palette and unit system (°C/°F) are configurable.',
    requirements: 'Pairs best with a live weather-data feed (not included).',
  },
  {
    title: 'Studio Sports Desk — 4 Cam', slug: 'studio-sports-desk-4-cam', designerEmail: 'courtside-design@broadexa.seed',
    categorySlug: 'virtual-set', engineSlug: 'pixotope', genreSlugs: ['sports'], engineVersionBuilt: '2024.2', engineVersionMin: '2023.1',
    description: 'A 4-camera sports desk with an integrated scoreboard wall and highlight-reel screen zone.',
    price: 1650, originalPrice: 1950, dealLabel: 'intro', rating: 4.7, reviewCount: 41, fileSizeGB: 3.2,
    includes: [{ item: 'Main desk (4 camera angles)', included: true }, { item: 'Scoreboard wall', included: true }],
    editableNotes: 'Team colours and league branding zone are swappable per broadcast.',
    requirements: 'Needs Pixotope Studio 2023.1 or newer.',
  },
  {
    title: 'Minimal Lower Thirds Vol. 2', slug: 'minimal-lower-thirds-vol-2', designerEmail: 'northline-studio@broadexa.seed',
    categorySlug: 'lower-thirds', engineSlug: 'aximmetry', genreSlugs: ['other'], engineVersionBuilt: '2024', isFree: true,
    description: 'A clean, minimal lower-third pack — name/title, ticker and social-handle templates.',
    rating: 4.5, reviewCount: 210,
    includes: [{ item: 'Name / title lower third', included: true }, { item: 'Social handle bug', included: true }, { item: 'Ticker template', included: true }],
    editableNotes: 'Font, accent colour and animation speed are all exposed.',
  },
  {
    title: 'Talk Show Set — Warm Studio', slug: 'talk-show-set-warm-studio', designerEmail: 'warmlight-co@broadexa.seed',
    categorySlug: 'virtual-set', engineSlug: 'brainstorm', genreSlugs: ['talk'], engineVersionBuilt: '5', engineVersionMin: '4',
    description: 'A warm, approachable talk-show set with a two-seat interview area and a live-audience-ready backdrop.',
    price: 1120, rating: 4.4, reviewCount: 19, ribbon: 'new', fileSizeGB: 1.8,
    includes: [{ item: 'Main interview set', included: true }, { item: 'Audience backdrop variant', included: true }],
    editableNotes: 'Lighting warmth, wall colour and seating layout are adjustable.',
  },
  {
    title: 'Election Results Board AR', slug: 'election-results-board-ar', designerEmail: 'vantage-point@broadexa.seed',
    categorySlug: 'ar-graphics', engineSlug: 'chyron', genreSlugs: ['election'], engineVersionBuilt: '6', engineVersionMin: '5.5',
    description: 'A standalone AR results board designed to drop into an existing studio set for election-night coverage.',
    price: 1980, rating: 4.9, reviewCount: 33, verified: true,
    includes: [{ item: 'Results board AR object', included: true }, { item: 'Data template (CSV/JSON)', included: true }],
    editableNotes: 'Board size, party colours and typography are configurable.',
    requirements: 'Requires PRIME or Lyric-compatible tracking.',
  },
  {
    title: 'Breaking News Package', slug: 'breaking-news-package', designerEmail: 'northline-studio@broadexa.seed',
    categorySlug: 'full-show-package', engineSlug: 'ross', genreSlugs: ['news'], engineVersionBuilt: '12', engineVersionMin: '11',
    description: 'A full breaking-news show package — open sting, lower thirds, full-screen graphics and a closing sting.',
    price: 760, rating: 4.3, reviewCount: 88, ribbon: 'best-value', fileSizeGB: 1.1,
    includes: [{ item: 'Open + close stings', included: true }, { item: 'Lower third set', included: true }, { item: 'Full-screen graphics', included: true }],
    editableNotes: 'Station branding, colours and music bed are all swappable.',
    requirements: 'Built for Ross Xpression — requires an active Ross licence.',
  },
]

export const sampleReviews = [
  { assetSlug: 'prime-time-news-desk', rating: 5, title: 'Exactly as described', comment: 'Dropped straight into our Viz rig with almost no tweaking. The ticker template alone saved us a week of work.' },
  { assetSlug: 'prime-time-news-desk', rating: 4, title: 'Great desk, tight on GPU', comment: 'Looks fantastic on air. Runs a little heavy on older hardware, but worth it.' },
  { assetSlug: 'election-night-ar-package', rating: 5, title: 'Used this on election night', comment: 'Held up under live pressure with real-time data updates. Support from the designer was fast too.' },
  { assetSlug: 'weather-wall-pro-kit', rating: 5, title: 'Our forecast team loves it', comment: 'Clean, readable at a glance, and the storm-tracking mode is a standout.' },
  { assetSlug: 'breaking-news-package', rating: 4, title: 'Solid value package', comment: 'Everything you need for a breaking-news cutaway. Good value for the price.' },
]

export async function seedCollection(
  payload: Payload,
  slug: 'engines' | 'categories' | 'genres' | 'blog-categories',
  items: { name: string; slug: string; shortLabel?: string }[],
  log: (msg: string) => void,
) {
  for (const item of items) {
    const existing = await payload.find({ collection: slug, where: { slug: { equals: item.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      log(`skip ${slug}: ${item.slug} already exists`)
      continue
    }
    await payload.create({ collection: slug, data: item })
    log(`created ${slug}: ${item.slug}`)
  }
}

export async function seedFaqItemsInto(payload: Payload, log: (msg: string) => void) {
  for (const item of faqItems) {
    const existing = await payload.find({ collection: 'faq-items', where: { question: { equals: item.question } }, limit: 1 })
    if (existing.docs.length > 0) {
      log(`skip faq-items: ${item.question} already exists`)
      continue
    }
    await payload.create({ collection: 'faq-items', data: item })
    log(`created faq-items: ${item.question}`)
  }
}

export async function seedDesignersInto(payload: Payload, log: (msg: string) => void) {
  for (const d of designers) {
    const existing = await payload.find({ collection: 'users', where: { email: { equals: d.email } }, limit: 1 })
    if (existing.docs.length > 0) {
      log(`skip designer: ${d.email} already exists`)
      continue
    }
    await payload.create({
      collection: 'users',
      data: { ...d, password: `Broadexa-Seed-${Math.random().toString(36).slice(2, 10)}!`, role: 'designer' },
    })
    log(`created designer: ${d.email}`)
  }
}

export async function seedAssetsInto(payload: Payload, log: (msg: string) => void) {
  for (const a of sampleAssets) {
    const existing = await payload.find({ collection: 'assets', where: { slug: { equals: a.slug } }, limit: 1 })
    if (existing.docs.length > 0) {
      log(`skip asset: ${a.slug} already exists`)
      continue
    }

    const [designer, category, engine, genreDocs] = await Promise.all([
      payload.find({ collection: 'users', where: { email: { equals: a.designerEmail } }, limit: 1 }),
      payload.find({ collection: 'categories', where: { slug: { equals: a.categorySlug } }, limit: 1 }),
      payload.find({ collection: 'engines', where: { slug: { equals: a.engineSlug } }, limit: 1 }),
      payload.find({ collection: 'genres', where: { slug: { in: a.genreSlugs } }, limit: 10 }),
    ])
    if (!designer.docs[0] || !category.docs[0] || !engine.docs[0]) {
      log(`skip asset: ${a.slug} — missing designer/category/engine (run the base seed first)`)
      continue
    }

    const { designerEmail, categorySlug, engineSlug, genreSlugs, ...rest } = a
    await payload.create({
      collection: 'assets',
      data: {
        ...rest,
        designer: designer.docs[0].id,
        category: category.docs[0].id,
        engine: engine.docs[0].id,
        genre: genreDocs.docs.map((g) => g.id),
        status: 'published',
        dealLabel: (rest as any).dealLabel || 'none',
        ribbon: (rest as any).ribbon || 'none',
      },
    })
    log(`created asset: ${a.slug}`)
  }
}

export async function seedReviewsInto(payload: Payload, log: (msg: string) => void) {
  const admin = await payload.find({ collection: 'users', where: { role: { equals: 'admin' } }, limit: 1 })
  if (!admin.docs[0]) {
    log('skip reviews: no admin user found to author them')
    return
  }
  for (const r of sampleReviews) {
    const asset = await payload.find({ collection: 'assets', where: { slug: { equals: r.assetSlug } }, limit: 1 })
    if (!asset.docs[0]) continue
    const existing = await payload.find({
      collection: 'reviews',
      where: { asset: { equals: asset.docs[0].id }, title: { equals: r.title } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      log(`skip review: "${r.title}" already exists`)
      continue
    }
    await payload.create({
      collection: 'reviews',
      data: { asset: asset.docs[0].id, buyer: admin.docs[0].id, rating: r.rating, title: r.title, comment: r.comment },
      user: admin.docs[0],
      overrideAccess: false,
    })
    log(`created review: ${r.title}`)
  }
}

export async function seedHomepageContentInto(payload: Payload, log: (msg: string) => void) {
  const settings: any = await payload.findGlobal({ slug: 'site-settings' })
  const needsTiles = !settings?.categoryTiles?.tiles || settings.categoryTiles.tiles.length === 0
  const needsPicks = !settings?.editorsPicks?.assets || settings.editorsPicks.assets.length === 0

  if (!needsTiles && !needsPicks) {
    log('skip homepage content: category tiles + editors picks already set')
    return
  }

  const [tileCats, pickSlugs] = await Promise.all([
    Promise.all(
      ['virtual-set', 'ar-graphics', 'data-visualization', 'lower-thirds'].map((slug) =>
        payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 }),
      ),
    ),
    Promise.all(
      ['prime-time-news-desk', 'election-night-ar-package', 'studio-sports-desk-4-cam', 'election-results-board-ar', 'weather-wall-pro-kit']
        .map((slug) => payload.find({ collection: 'assets', where: { slug: { equals: slug } }, limit: 1 })),
    ),
  ])

  const data: any = {}
  if (needsTiles) {
    data.categoryTiles = {
      ...(settings?.categoryTiles || {}),
      tiles: tileCats.filter((c) => c.docs[0]).map((c) => ({ category: c.docs[0].id })),
    }
  }
  if (needsPicks) {
    data.editorsPicks = {
      ...(settings?.editorsPicks || {}),
      assets: pickSlugs.filter((a) => a.docs[0]).map((a) => a.docs[0].id),
    }
  }

  await payload.updateGlobal({ slug: 'site-settings', data })
  log('seeded homepage category tiles + editors picks')
}

export async function runFullSeed(payload: Payload, log: (msg: string) => void = () => {}) {
  await seedCollection(payload, 'engines', engines, log)
  await seedCollection(payload, 'categories', categories, log)
  await seedCollection(payload, 'genres', genres, log)
  await seedCollection(payload, 'blog-categories', blogCategories, log)
  await seedFaqItemsInto(payload, log)
  await seedDesignersInto(payload, log)
  await seedAssetsInto(payload, log)
  await seedReviewsInto(payload, log)
  await seedHomepageContentInto(payload, log)
}
