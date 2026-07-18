import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import { Reveal } from '../components/Reveal'
import { AssetCard, type AssetCardData } from '../components/AssetCard'
import { getSessionUser } from '@/lib/session'
import type { Where } from 'payload'

export const dynamic = 'force-dynamic'

function toCardData(a: any): AssetCardData {
  return {
    id: String(a.id),
    slug: a.slug,
    title: a.title,
    price: a.price,
    isFree: a.isFree,
    originalPrice: a.originalPrice,
    dealLabel: a.dealLabel,
    ribbon: a.ribbon,
    verified: a.verified,
    rating: a.rating,
    reviewCount: a.reviewCount,
    designerName: typeof a.designer === 'object' ? a.designer?.studioName || a.designer?.name : undefined,
    categoryName: typeof a.category === 'object' ? a.category?.name : undefined,
    engineLabel: typeof a.engine === 'object' ? `${a.engine?.shortLabel || a.engine?.name || ''} ${a.engineVersionBuilt || ''}`.trim() : undefined,
    thumbUrl: Array.isArray(a.gallery) && typeof a.gallery[0] === 'object' ? a.gallery[0]?.url : null,
  }
}

type SearchParams = {
  q?: string
  engine?: string
  category?: string
  genre?: string
  min?: string
  max?: string
  verified?: string
  free?: string
}

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const sp = await searchParams
  const payload = await getPayload({ config })
  const user = await getSessionUser().catch(() => null)

  const [engines, categories, genres] = await Promise.all([
    payload.find({ collection: 'engines', limit: 100, sort: 'name' }),
    payload.find({ collection: 'categories', limit: 100, sort: 'name' }),
    payload.find({ collection: 'genres', limit: 100, sort: 'name' }),
  ])

  const where: Where = { status: { equals: 'published' } }
  const and: Where[] = []

  if (sp.engine) {
    const eng = engines.docs.find((e) => e.slug === sp.engine)
    if (eng) and.push({ engine: { equals: eng.id } })
  }
  if (sp.category) {
    const cat = categories.docs.find((c) => c.slug === sp.category)
    if (cat) and.push({ category: { equals: cat.id } })
  }
  if (sp.genre) {
    const gen = genres.docs.find((g) => g.slug === sp.genre)
    if (gen) and.push({ genre: { equals: gen.id } })
  }
  if (sp.q) {
    and.push({
      or: [
        { title: { contains: sp.q } },
        { description: { contains: sp.q } },
      ],
    })
  }
  if (sp.verified === '1') and.push({ verified: { equals: true } })
  if (sp.free === '1') and.push({ isFree: { equals: true } })
  if (sp.min) and.push({ price: { greater_than_equal: Number(sp.min) } })
  if (sp.max) and.push({ price: { less_than_equal: Number(sp.max) } })
  if (and.length > 0) where.and = and

  const assets = await payload.find({
    collection: 'assets',
    where,
    limit: 24,
    sort: '-createdAt',
    depth: 1,
  })

  const buildHref = (patch: Partial<SearchParams>) => {
    const next = { ...sp, ...patch }
    const params = new URLSearchParams()
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    const qs = params.toString()
    return `/marketplace${qs ? `?${qs}` : ''}`
  }

  return (
    <>
      <SiteNav />

      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Marketplace</div>
          <h1>Broadcast-ready assets</h1>
          <p>Virtual sets, AR graphics and show packages — built by real-time designers, verified on the engines you run.</p>
        </div>

        <form action="/marketplace" method="get" className="search-row">
          {sp.engine && <input type="hidden" name="engine" value={sp.engine} />}
          {sp.category && <input type="hidden" name="category" value={sp.category} />}
          {sp.genre && <input type="hidden" name="genre" value={sp.genre} />}
          {sp.min && <input type="hidden" name="min" value={sp.min} />}
          {sp.max && <input type="hidden" name="max" value={sp.max} />}
          {sp.verified && <input type="hidden" name="verified" value={sp.verified} />}
          {sp.free && <input type="hidden" name="free" value={sp.free} />}
          <input type="search" name="q" defaultValue={sp.q || ''} placeholder="Search assets by name or description…" />
          <button type="submit" className="btn btn-dark">Search</button>
        </form>

        <div className="mkt-layout">
          <aside className="filters">
            <div className="filter-group">
              <h4>Engine</h4>
              <div className="filter-list">
                <Link href={buildHref({ engine: undefined })} className={!sp.engine ? 'active' : ''}>All engines</Link>
                {engines.docs.map((e) => (
                  <Link key={e.id} href={buildHref({ engine: e.slug })} className={sp.engine === e.slug ? 'active' : ''}>
                    {e.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-list">
                <Link href={buildHref({ category: undefined })} className={!sp.category ? 'active' : ''}>All categories</Link>
                {categories.docs.map((c) => (
                  <Link key={c.id} href={buildHref({ category: c.slug })} className={sp.category === c.slug ? 'active' : ''}>
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Genre</h4>
              <div className="filter-row">
                {genres.docs.map((g) => (
                  <Link
                    key={g.id}
                    href={buildHref({ genre: sp.genre === g.slug ? undefined : g.slug })}
                    className={`chip-toggle ${sp.genre === g.slug ? 'active' : ''}`}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Trust</h4>
              <div className="filter-row">
                <Link href={buildHref({ verified: sp.verified === '1' ? undefined : '1' })} className={`chip-toggle ${sp.verified === '1' ? 'active' : ''}`}>
                  ✓ Verified only
                </Link>
                <Link href={buildHref({ free: sp.free === '1' ? undefined : '1' })} className={`chip-toggle ${sp.free === '1' ? 'active' : ''}`}>
                  Free
                </Link>
              </div>
            </div>
          </aside>

          <div>
            <div className="results-head">
              <span>{assets.totalDocs} asset{assets.totalDocs === 1 ? '' : 's'}</span>
            </div>

            {assets.docs.length === 0 ? (
              <div className="empty">No assets match these filters yet.</div>
            ) : (
              <Reveal>
                <div className="grid-dense">
                  {assets.docs.map((a: any, i: number) => (
                    <AssetCard key={a.id} asset={toCardData(a)} index={i} isLoggedIn={Boolean(user)} />
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  )
}
