import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteNav } from '../components/SiteNav'
import { SiteFooter } from '../components/SiteFooter'
import type { Where } from 'payload'

export const dynamic = 'force-dynamic'

type SearchParams = {
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

  const [engines, categories] = await Promise.all([
    payload.find({ collection: 'engines', limit: 100, sort: 'name' }),
    payload.find({ collection: 'categories', limit: 100, sort: 'name' }),
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
  if (sp.genre) and.push({ genre: { contains: sp.genre } })
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

  const genres = ['news', 'sports', 'weather', 'election', 'talk', 'other']

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
                {genres.map((g) => (
                  <Link
                    key={g}
                    href={buildHref({ genre: sp.genre === g ? undefined : g })}
                    className={`chip-toggle ${sp.genre === g ? 'active' : ''}`}
                  >
                    {g}
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
              <div className="grid">
                {assets.docs.map((a: any) => (
                  <Link key={a.id} href={`/marketplace/${a.slug}`} className="card-a">
                    <div className="thumb" />
                    <div className="card-body">
                      <h3>{a.title}</h3>
                      <div className="byline">
                        {typeof a.designer === 'object' ? a.designer?.studioName || a.designer?.name : ''}
                      </div>
                      <div className="card-foot">
                        <span className="price">{a.isFree ? 'Free' : `$${Number(a.price || 0).toLocaleString()}`}</span>
                        {a.verified && <span className="badge verified">✓ Verified</span>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  )
}
