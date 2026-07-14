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

async function seed() {
  const payload = await getPayload({ config })
  await seedCollection(payload, 'engines', engines)
  await seedCollection(payload, 'categories', categories)
  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
